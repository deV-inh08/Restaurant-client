import jwt from 'jsonwebtoken'
import accountApiReq from "@/apiRequests/account"
import { ChangePasswordBodyType } from "@/schema/account.schema"
import { cookies } from "next/headers"
import { HttpError } from '@/lib/http'
import { decodedToken } from '@/app/api/auth/login/route'

export const PUT = async (request: Request) => {
    // get body from Next client
    const body = (await request.json()) as ChangePasswordBodyType
    const cookieStore = await cookies()
    const accessTokenFromCookie = (cookieStore.get('accessToken')?.value) as string
    if (!accessTokenFromCookie) {
        return Response.json({
            message: "Don't have accessToken"
        }, {
            status: 401
        })
    }
    try {
        const res = await accountApiReq.serverChangePasswordv2(body, accessTokenFromCookie.trim())
        const { accessToken, refreshToken } = res.payload.data
        const decodedAccessToken = jwt.decode(accessToken) as decodedToken
        const decodedRefreshToken = jwt.decode(refreshToken) as decodedToken
        cookieStore.set('accessToken', accessToken, {
            httpOnly: true,
            expires: new Date(decodedAccessToken.exp * 1000),
            sameSite: 'lax',
            path: '/',
            secure: true
        })
        cookieStore.set('refreshToken', refreshToken, {
            httpOnly: true,
            expires: new Date(decodedRefreshToken.exp * 1000),
            sameSite: 'lax',
            path: '/',
            secure: true
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
    // request main Server
}