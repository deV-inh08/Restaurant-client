import authApiRequest from "@/apiRequests/auth"
import { LoginBodyType } from "@/schema/auth.schema"
import { cookies } from "next/headers"
import jwt from 'jsonwebtoken'
import { HttpError } from "@/lib/http"

/**
 * Flow: Next client -> Next Server(proxy) -> Main Server
 * 
 * Next Client -> (request) with data (email, password) -> Next Server 
 * Next Server receipt 'data' (email, password) -> (request) -> Main Server
 * Main Server -> return for Next Server (payload)
 * Next get payload (token) -> Set cookie (Client)
 */

type decodedToken = {
    userId: number;
    role: string;
    tokenType: string;
    iat: number;
    exp: number;
}

export const POST = async (request: Request) => {
    const body = (await request.json()) as LoginBodyType
    const cookieStore = await cookies()
    try {
        const res = await authApiRequest.serverLogin(body)
        const { accessToken, refreshToken } = res.payload.data
        const decodedAccessToken = jwt.decode(accessToken) as decodedToken
        const decodedRefreshToken = jwt.decode(refreshToken) as decodedToken
        cookieStore.set('accessToken', accessToken, {
            httpOnly: true,
            expires: decodedAccessToken.exp * 1000,
            sameSite: 'lax',
            // secure: true -> Cookie chỉ được gửi qua HTTPS.

        })
        cookieStore.set('refreshToken', refreshToken, {
            httpOnly: true,
            expires: decodedRefreshToken.exp * 1000,
            sameSite: 'lax',
            // secure: true -> Cookie chỉ được gửi qua HTTPS.
        })
        return Response.json(res.payload)
    } catch (error) {
        if (error instanceof HttpError) {
            return Response.json(error.payload, {
                status: error.status
            })
        } else {
            return Response.json({
                message: 'Error',
                status: 500
            })
        }
    }
}