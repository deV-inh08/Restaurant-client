/* eslint-disable @typescript-eslint/no-explicit-any */
import envConfig from "@/config";
import { HttpStatus } from "@/constants/httpStatus";
import { normalizePath } from "@/lib/utils";
import { LoginResponseType } from "@/schema/auth.schema";
import { redirect } from "next/navigation";


// Cấu hình gửi lên API: headers, body, signal...
type CustomOptions = Omit<RequestInit, 'method'> & {
    baseUrl?: string //  tùy chọn baseUrl để gọi main server hoặc next server.
}

type EntityErrorPayload = {
    message: string
    errors: {
        field: string
        message: string
    }[]
}


/**
 * HttpError: là lỗi chung khi gọi API thất bại
 * Ví dụ: server lỗi 500, bạn bị lỗi 403, 404...
 */
export class HttpError extends Error {
    status: number
    payload: {
        message: string
        [key: string]: any
    }
    constructor(
        {
            status,
            payload,
            message = 'Error HTTP'
        }: {
            status: number
            payload?: any
            message?: string
        }
    ) {
        super(message)
        this.status = status
        this.payload = payload
    }
}


/**
 * EntityError: là lỗi do người dùng nhập form sai (422)
 * ví dụ: nhập thiếu email, mật khẩu sai định dạng.
 */
export class EntityError extends HttpError {
    status: typeof HttpStatus.UNPROCESSABLE_ENTITY
    payload: EntityErrorPayload
    constructor({
        status,
        payload
    }: {
        status: typeof HttpStatus.UNPROCESSABLE_ENTITY
        payload: EntityErrorPayload
    }
    ) {
        super({ status, payload, message: 'Enitty Error' })
        this.status = status
        this.payload = payload
    }
}


// clientLogoutRequest Mục đích: Tránh gọi logout nhiều lần
let clientLogoutRequest: null | Promise<any> = null

// Đây là cách xác định xem code đang chạy ở Client (trình duyệt) hay Server (Node.js - Next.js)
const isClient = typeof window !== 'undefined'

const request = async <Response>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    options?: CustomOptions
) => {

    // body: file (FormData) | JSON (string) {email , password}
    let body: FormData | string | undefined = undefined
    // upload file (image, ...)
    if (options?.body instanceof FormData) {
        body = options.body

        // data { email, password }.... 
    } else if (options?.body) {
        body = JSON.stringify(options.body)
    }

    // Request Header
    const baseHeaders: {
        [key: string]: string
    } =
        // if body FormData (file) => header is {}
        // else JSON => { 'application/json' }
        body instanceof FormData ? {} : {
            'Content-Type': 'application/json'
        }


    if (isClient) {
        // if in Client => get accessToken in LS
        const accessToken = localStorage.getItem('accessToken')
        if (accessToken) {
            // assign access Token 
            baseHeaders.Authorization = `Bearer ${accessToken}`
        }
    }

    // Nếu không truyền baseUrl (hoặc baseUrl = undefined) call 'Main Server'
    // Nếu truyền baseUrl thì lấy giá trị truyền vào, call 'Next Server'
    const baseUrl = options?.baseUrl === undefined ?
        envConfig.NEXT_PUBLIC_API_ENDPOINT // Main Server
        : options?.baseUrl // Next Server

    const fullUrl = `${baseUrl}/${normalizePath(url)}`
    const res = await fetch(fullUrl, {
        ...options,
        headers: {
            ...baseHeaders,
            ...options?.headers
        },
        body,
        method
    })
    const payload: Response = await res.json()
    const data = {
        status: res.status,
        payload
    }
    if (!res.ok) {
        // handle Entity Error (Data error)
        if (res.status === HttpStatus.UNPROCESSABLE_ENTITY) {
            throw new EntityError(
                data as {
                    status: typeof HttpStatus.UNPROCESSABLE_ENTITY,
                    payload: EntityErrorPayload
                }
            )
        }
        // handle UNAUTHORIZED Error
        else if (res.status === HttpStatus.UNAUTHORIZED) {
            if (isClient) {
                if (!clientLogoutRequest) {
                    clientLogoutRequest = fetch('/api/auth/logout', {
                        method: 'POST',
                        body: null,
                        headers: {
                            ...baseHeaders
                        }
                    })
                    try {
                        await clientLogoutRequest
                    } finally {
                        localStorage.removeItem('accessToken')
                        localStorage.removeItem('refreshToken')
                        clientLogoutRequest = null
                        location.href = '/login'
                    }
                }
            } else {
                const accessToken = (options?.headers as any).Authorization.split(
                    'Bearer '
                )[1] as string
                redirect(`/logout?accessToken=${accessToken}`)
            }
        } else {
            throw new HttpError(data)
        }
    }
    // Đảm bảo logic dưới đây chỉ chạy ở phía client (browser)
    if (isClient) {
        const normalizeUrl = normalizePath(url)
        if (normalizeUrl === '/api/auth/login') {
            const { accessToken, refreshToken } = (payload as LoginResponseType).data
            console.log('accessToken', accessToken)
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', refreshToken)
        }
    }
    return data
}

const http = {
    get(url: string, options?: Omit<CustomOptions, 'body'> | undefined) {
        return request("GET", url, options)
    },
    post<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
        return request<Response>('POST', url, { ...options, body })
    },
    put<Response>(
        url: string,
        body: any,
        options?: Omit<CustomOptions, 'body'> | undefined
    ) {
        return request<Response>('PUT', url, { ...options, body })
    },
    delete<Response>(
        url: string,
        options?: Omit<CustomOptions, 'body'> | undefined
    ) {
        return request<Response>('DELETE', url, { ...options })
    }
}

export default http