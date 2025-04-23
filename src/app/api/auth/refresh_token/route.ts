import authApiRequest from "@/apiRequests/auth";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken'
import { HttpStatus } from "@/constants/httpStatus";

export async function POST() {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get('refreshToken')?.value
    if (!refreshToken) {
        return Response.json({
            message: 'Not found refreshToken'
        }, {
            status: 401
        })
    }
    try {
        const { payload } = await authApiRequest.serverRefreshToken({ refreshToken })
        const decodedAccessToken = jwt.decode(payload.data.accessToken) as {
            exp: number
        }
        const decodedRefreshToken = jwt.decode(payload.data.refreshToken) as {
            exp: number
        }
        cookieStore.set('accessToken', payload.data.accessToken, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
            expires: decodedAccessToken.exp * 1000
        })
        cookieStore.set('refreshToken', payload.data.refreshToken, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
            expires: decodedRefreshToken.exp * 1000
        })
        return Response.json(payload)
    } catch (error) {
        return Response.json(
            {
                message: 'Error'
            },
            {
                status: HttpStatus.UNAUTHORIZED
            }
        )
    }
}