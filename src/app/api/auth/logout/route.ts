/* eslint-disable @typescript-eslint/no-unused-vars */
import authApiRequest from "@/apiRequests/auth";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
export const POST = async (request: NextRequest) => {
    const cookieStore = await cookies()
    // get token from next client -> (request) -> next server
    const accessToken = request.cookies.get('accessToken')?.value as string
    const refreshToken = request.cookies.get('refreshToken')?.value as string
    if (!accessToken || !refreshToken) {
        return Response.json({
            message: 'Không nhận được access token hoặc refresh token'
        },
            {
                status: 200
            })
    }
    // next server -> request -> main server (refresh token & server don't auto send cookie)
    try {
        const res = await authApiRequest.serverLogout({ accessToken: accessToken.trim(), refreshToken: refreshToken.trim() })
        cookieStore.delete('accessToken')
        cookieStore.delete('refreshToken')
        return Response.json(res.payload, {
            status: 200
        })
    } catch (error) {
        return Response.json(
            {
                message: 'Lỗi khi gọi API đến server backend'
            },
            {
                status: 200
            }
        )
    }

}