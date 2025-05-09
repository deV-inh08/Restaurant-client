import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from 'jsonwebtoken'
import { RoleType } from "@/types/jwt.type";
import { Roles } from "@/constants/type";

const managePath = ['/manage']
const guestPath = ['/guest']
const ownerPath = ['/manage/account']
const privatePaths = [...managePath, ...guestPath]
const unAuthPaths = ['/login']

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
        const url = new URL('/login', request.url)
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
            return Response.redirect(new URL('/', request.url))
        }

        // 2.2 Dang nhap roi, nhung accessToken het han
        if (privatePaths.some((path) => pathname.startsWith(path)) && getRefreshToken && !getAccessToken) {
            const url = new URL('/refresh-token', request.url)
            url.searchParams.set('refreshToken', getRefreshToken)
            url.searchParams.set('redirect', pathname)
            return NextResponse.redirect(url)
        }

        // 2.3 Vao khong dung role cua minh (guest khong duoc vao role cua manager)
        if ((role === Roles.Guest && managePath.some((path) => pathname.startsWith(path)))
            || role !== Roles.Guest && guestPath.some((path) => pathname.startsWith(path))
        ) {
            return Response.redirect(new URL('/', request.url))
        }

        // 2.4 owner chi truy cap route cho Owner
        const isNotOwner = role !== Roles.Owner && ownerPath.some((path) => pathname.startsWith(path))
        const isGuestGoToManagePath = role == Roles.Guest && ownerPath.some((path) => pathname.startsWith(path))
        if (
            isGuestGoToManagePath ||
            isNotOwner
        ) {
            return NextResponse.redirect(new URL('/', request.url))
        }
        return NextResponse.next()
    }
}
// Matching Paths
export const config = {
    matcher: ['/manage/:path*', '/guest/:path*', '/login']
}
