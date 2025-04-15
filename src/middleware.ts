import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePaths = ['/manage']
const unAuthPaths = ['/login']

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const isAuth = request.cookies.get('accessToken')?.value
    if (isAuth && unAuthPaths.some((path) => pathname.startsWith(path))) {
        return NextResponse.redirect(new URL('/', request.url))
    }
    if (!isAuth && privatePaths.some((path) => pathname.startsWith(path))) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
}

// Matching Paths

export const config = {
    matcher: ['/manage/:path*', '/login']
}