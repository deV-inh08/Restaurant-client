import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePaths = ['/manage']
const unAuthPaths = ['/login']

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // get accessToken & refreshToken from cookies
    const getAccessToken = request.cookies.get('accessToken')?.value
    const getRefreshToken = request.cookies.get('refreshToken')?.value

    console.log('refreshToken', getRefreshToken)
    console.log('accessToken', getAccessToken)
    // chua Login ma vao privatePaths
    if (privatePaths.some((path) => pathname.startsWith(path)) && !getRefreshToken) {
        return Response.redirect(new URL('/login', request.url))
    }
    // Login roi thi ko cho vao Login page nua
    if (unAuthPaths.some((path) => pathname.startsWith(path)) && getRefreshToken && getAccessToken) {
        return Response.redirect(new URL('/', request.url))
    }
    // Dang nhap roi, nhung accessToken het han
    if (privatePaths.some((path) => pathname.startsWith(path)) && getRefreshToken && !getAccessToken) {
        const url = new URL('/refresh-token', request.url)
        url.searchParams.set('refreshToken', getRefreshToken)
        url.searchParams.set('redirect', pathname)
        return NextResponse.redirect(url)
    }
    return NextResponse.next()
}

// Matching Paths
export const config = {
    matcher: ['/manage/:path*', '/login']
}