import authApiRequest from "@/apiRequests/auth";
import { LoginBodyType } from "@/schema/auth.schema";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken'
import { HttpError } from "@/lib/http";

/**
 * @param request 
 * @returns 
 * 
 * Flow Chart:
 * 
 * Next Client => User fill (email, password)
 * Next Client send 'UserForm' to Next Server
 * Next Server receive 'UserForm' from Next Client
 * After, Next Server request with 'UserForm' to Main Server
 * Next Server have 'data' from Main Server (accessToken, refreshToken)
 * Next Server decoded  'accessToken', 'refreshToken' to get 'expires'
 * After set cookie to Client (client.com)
 */


export async function POST(request: Request) {
    const body = (await request.json()) as LoginBodyType
    // GET cookei & SET cookie
    const cookieStore = await cookies()
    try {
        // handle Login next server => main server
        const { payload } = await authApiRequest.serverLogin(body)
        const { accessToken, refreshToken } = payload.data
        const decodedAccessToken = jwt.decode(accessToken) as { exp: number }
        const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number }
        // set cookie
        cookieStore.set('accessToken', accessToken, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
            expires: decodedAccessToken.exp * 1000
        })
        cookieStore.set('refreshToken', refreshToken, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
            expires: decodedRefreshToken.exp * 1000
        })
        // response payload
        return Response.json(payload)
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