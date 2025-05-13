// import { NextResponse } from "next/server";
import { NextResponse, type NextRequest } from "next/server";
import jwt from 'jsonwebtoken'
import { RoleType } from "@/types/jwt.type";
import { Roles } from "@/constants/type";
import createMiddleware from 'next-intl/middleware';
import { routing } from "@/i18n/routing";


const managePath = ['/vi/manage', '/en/manage']
const guestPath = ['/vi/guest', '/en/guest']
const ownerPath = ['/vi/manage/account', '/en/manage/account']
const privatePaths = [...managePath, ...guestPath]
const unAuthPaths = ['/vi/login', '/en/login']


// Custom middleware xử lý i18n
export const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // get accessToken & refreshToken from cookies
    const getAccessToken = request.cookies.get('accessToken')?.value
    const getRefreshToken = request.cookies.get('refreshToken')?.value

    /**
     * Truong hop chua dang nhap
     * chua Login ma vao privatePaths
     * 
     */



    if (privatePaths.some((path) => pathname.startsWith(path)) && !getRefreshToken) {
        const url = new URL(`/login`, request.url)
        url.searchParams.set('clearTokens', 'true')
        return Response.redirect(url)
    }

    /**
    * 2.Truong hop dang nhap roi
    * 
    */
    if (getRefreshToken) {

        // get role (decode refreshToken)
        const decodedRefreshToken = jwt.decode(getRefreshToken) as { role: RoleType }
        const role = decodedRefreshToken.role

        // 2.1 Login roi thi ko cho vao Login page nua
        if (unAuthPaths.some((path) => pathname.startsWith(path)) && getRefreshToken && getAccessToken) {
            return Response.redirect(new URL(`/`, request.url))
            // response.headers.set('x-middleware-rewrite', new URL('/', request.url).toString())
            // return response
        }

        // 2.2 Dang nhap roi, nhung accessToken het han
        if (privatePaths.some((path) => pathname.startsWith(path)) && getRefreshToken && !getAccessToken) {
            const url = new URL(`/refresh-token`, request.url)
            url.searchParams.set('refreshToken', getRefreshToken)
            url.searchParams.set('redirect', pathname)
            return NextResponse.redirect(url)
        }

        // 2.3 Vao khong dung role cua minh (guest khong duoc vao role cua manager)
        if ((role === Roles.Guest && managePath.some((path) => pathname.startsWith(path)))
            || role !== Roles.Guest && guestPath.some((path) => pathname.startsWith(path))
        ) {
            return Response.redirect(new URL(`/`, request.url))
            // response.headers.set('x-middleware-rewrite', new URL('/', request.url).toString())
            // return response
        }

        // 2.4 owner chi truy cap route cho Owner
        const isNotOwner = role !== Roles.Owner && ownerPath.some((path) => pathname.startsWith(path))
        const isGuestGoToManagePath = role == Roles.Guest && ownerPath.some((path) => pathname.startsWith(path))
        if (
            isGuestGoToManagePath ||
            isNotOwner
        ) {
            return NextResponse.redirect(new URL(`/`, request.url))
            // response.headers.set('x-middleware-rewrite', new URL('/', request.url).toString())
        }
        return NextResponse.next()
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/manage/:path*', '/guest/:path*', '/login']
}