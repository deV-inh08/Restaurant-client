import authApiRequest from "@/apiRequests/auth"
import { cookies } from "next/headers"

export async function POST() {
    const cookieStore = await cookies()
    const accessToken = (cookieStore.get('accessToken')?.value) as string
    const refreshToken = (cookieStore.get('refreshToken')?.value) as string

    if (!accessToken || !refreshToken) {
        return Response.json({
            message: 'accessToken & refreshToken invalid',
        }, {
            status: 200
        })
    }
    /**
     * if have accessToken & refreshToken
     * + Request API logout from Next Server -> Main server 
     * body: { refreshToken: string }
     * In Main Server receipt 'headers' => { Authorization: Bearer Token (accessToken) }
     */
    try {
        const res = await authApiRequest.serverLogout({ refreshToken, accessToken })
        // delete cookie in Next Server
        cookieStore.delete('accessToken')
        cookieStore.delete('refreshToken')
        return Response.json(res.payload, {
            status: 200
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        // delete cookie in Next Server
        cookieStore.delete('accessToken')
        cookieStore.delete('refreshToken')
        return Response.json({
            message: 'Lỗi khi gọi API đến server backend, buộc phải xóa cookie'
        }, {
            status: 200
        })
    }
}

