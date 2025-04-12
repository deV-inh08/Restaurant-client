import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePaths = ['/fafafa']
const unAuthPaths = ['/login']

export function middleware(request: NextRequest) {
    // get pathname hien tai
    const { pathname } = request.nextUrl

    // check cookie (accessToken)
    const isAuth = Boolean(request.cookies.get('accessToken')?.value)

    // Don't have cookie & path === 'fafafa' => Login page
    if (privatePaths.some((path) => pathname.startsWith(path)) && !isAuth) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // If have cookie & path === 'login' => Home page
    if (unAuthPaths.some((path) => pathname.startsWith(path)) && isAuth) {
        return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
}

// Matching Paths

export const config = {
    matcher: ['/fafafa/:path*', '/login']
}