/* eslint-disable @typescript-eslint/no-explicit-any */
import envConfig from "@/config"
import { HttpStatus } from "@/constants/httpStatus"
import { normalizePath } from "@/lib/utils"
import { LoginResponseType } from "@/schema/auth.schema"
/**
 * Create file http -> request
 * (case)
 * http.get(url, options)
 * http.post(url, body, options)
 * http.put(url, body, options)
 * http.delete(url, options)
 * 
 * 
 * Call API Next Client or Next Server deu duoc
 */
type CustomOptions = Omit<RequestInit, 'method'> & {
    baseUrl?: string
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
    constructor({ status, payload, message = 'HTTP Error' }: { status: number, payload?: any, message?: string }) {
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
    constructor({ status, payload }: {
        status: typeof HttpStatus.UNPROCESSABLE_ENTITY
        payload: EntityErrorPayload
    }) {
        super({ status, message: 'Entity Error', payload })
        this.status = status
        this.payload = payload
    }
}

/**
 * Main core 'request' fucntion
 * 
 * params: method, url, option
 * */

const isClient = typeof window !== 'undefined'

export async function request<Response>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    options?: CustomOptions) {
    // - get Data from user Form | File
    // - if Form -> request Headers 'application/json' | File -> {}
    // - custom baseUrl -> baseUrl = '' => Main server otherwise Next Server ( localhost://.... )
    // - fullUrl = baseUrl + url
    // - fetch Data
    // - catch error (HTTP Erorr | Entity Error)
    // login (Next Client) => set token in LS

    // handle login: next server -> 
    let body: FormData | string | undefined = undefined
    // File (avatar, ...)
    if (options?.body instanceof FormData) {
        body = options.body
    } else if (options?.body) {
        body = JSON.stringify(options.body)
    }
    const controller = new AbortController()
    const signal = options?.signal || controller.signal

    const baseHeaders: {
        [key: string]: string
    } = body instanceof FormData ? {} : {
        'Content-Type': 'application/json'
    }
    const baseUrl = options?.baseUrl === undefined
        ? envConfig.NEXT_PUBLIC_API_ENDPOINT // Main server
        : options.baseUrl
    const fullUrl = `${baseUrl}/${normalizePath(url)}`
    const res = await fetch(fullUrl, {
        ...options,
        headers: {
            ...baseHeaders,
            ...options?.headers
        },
        method,
        body,
        signal
    })
    const payload = await res.json()
    const data = {
        status: res.status,
        payload
    }
    if (!res.ok) {
        if (res.status === HttpStatus.UNPROCESSABLE_ENTITY) {
            throw new EntityError(
                data as {
                    status: typeof HttpStatus.UNPROCESSABLE_ENTITY,
                    payload: EntityErrorPayload
                }
            )
        } else {
            throw new HttpError(data)
        }
    }
    // client -> (login) -> next server (trong luc next server) => set token in LS
    if (isClient) {
        if (normalizePath(url) === 'api/auth/login') {
            const { accessToken, refreshToken } = (payload as LoginResponseType).data
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', refreshToken)
        }
    }
    return data as Response
}


// generate http
export const http = {
    // url, options
    get: <Response>(url: string, options?: CustomOptions) => {
        return request<Response>('GET', url, options)
    },
    post: <Response>(url: string, body: any, options?: CustomOptions) => {
        return request<Response>('POST', url, { ...options, body })
    },
    put: <Response>(url: string, body: any, options?: CustomOptions) => {
        return request<Response>('PUT', url, { ...options, body })
    },
    delete: <Response>(url: string, options: CustomOptions) => {
        return request<Response>('DELETE', url, { ...options })
    }
}

