// // import { NextResponse } from "next/server";
// import { NextResponse, type NextRequest } from "next/server";
// import jwt from 'jsonwebtoken'
// import { RoleType } from "@/types/jwt.type";
// import { Roles } from "@/constants/type";
// import createMiddleware from 'next-intl/middleware';
// import { routing } from "@/i18n/routing";
// import { defaultLocale } from "@/config";


// const managePath = ['/vi/manage', '/en/manage']
// const guestPath = ['/vi/guest', '/en/guest']
// const ownerPath = ['/vi/manage/account', '/en/manage/account']
// const privatePaths = [...managePath, ...guestPath]
// const unAuthPaths = ['/vi/login', '/en/login']


// // Custom middleware xử lý i18n
// export const intlMiddleware = createMiddleware(routing);

// export async function middleware(request: NextRequest) {
//     const { pathname } = request.nextUrl

//     // get accessToken & refreshToken from cookies
//     const getAccessToken = request.cookies.get('accessToken')?.value
//     const getRefreshToken = request.cookies.get('refreshToken')?.value
//     const locale = request.cookies.get('NEXT_LOCALE')?.value ?? defaultLocale


//     // ✅ Gọi middleware i18n để xử lý locale & rewrite chính xác
//     const response = intlMiddleware(request);


//     /**
//      * Truong hop chua dang nhap
//      * chua Login ma vao privatePaths
//      * 
//      */
//     if (pathname === '/' && !getRefreshToken && !getAccessToken) {
//         const url = new URL(`/${locale}/login`, request.url)
//         return Response.redirect(url)
//     } else if ((pathname === '/en' || pathname === '/vi') && getAccessToken && getRefreshToken) {
//         const url = new URL(`/${locale}/`, request.url)
//         return Response.redirect(url)
//     }


//     if (privatePaths.some((path) => pathname.startsWith(path)) && !getRefreshToken) {
//         const url = new URL(`/${locale}/login`, request.url)
//         url.searchParams.set('clearTokens', 'true')
//         console.log('b')
//         return Response.redirect(url)
//     }

//     /**
//     * 2.Truong hop dang nhap roi
//     * 
//     */
//     if (getRefreshToken) {

//         // get role (decode refreshToken)
//         const decodedRefreshToken = jwt.decode(getRefreshToken) as { role: RoleType }
//         const role = decodedRefreshToken.role

//         // 2.1 Login roi thi ko cho vao Login page nua
//         if (unAuthPaths.some((path) => pathname.startsWith(path)) && getRefreshToken && getAccessToken) {
//             console.log('1')
//             return Response.redirect(new URL(`/${locale}`, request.url))
//             // response.headers.set('x-middleware-rewrite', new URL('/', request.url).toString())
//             // return response
//         }

//         // 2.2 Dang nhap roi, nhung accessToken het han
//         if (privatePaths.some((path) => pathname.startsWith(path)) && getRefreshToken && !getAccessToken) {
//             const url = new URL(`/${locale}/refresh-token`, request.url)
//             console.log(2)
//             url.searchParams.set('refreshToken', getRefreshToken)
//             url.searchParams.set('redirect', pathname)
//             return NextResponse.redirect(url)
//         }

//         // 2.3 Vao khong dung role cua minh (guest khong duoc vao role cua manager)
//         if ((role === Roles.Guest && managePath.some((path) => pathname.startsWith(path)))
//             || role !== Roles.Guest && guestPath.some((path) => pathname.startsWith(path))
//         ) {
//             console.log(3)
//             return Response.redirect(new URL(`/${locale}`, request.url))
//             // response.headers.set('x-middleware-rewrite', new URL('/', request.url).toString())
//             // return response
//         }

//         // 2.4 owner chi truy cap route cho Owner
//         const isNotOwner = role !== Roles.Owner && ownerPath.some((path) => pathname.startsWith(path))
//         const isGuestGoToManagePath = role == Roles.Guest && ownerPath.some((path) => pathname.startsWith(path))
//         if (
//             isGuestGoToManagePath ||
//             isNotOwner
//         ) {
//             console.log(4)
//             return NextResponse.redirect(new URL(`/${locale}`, request.url))
//             // response.headers.set('x-middleware-rewrite', new URL('/', request.url).toString())
//         }
//         // return NextResponse.next()
//         return response
//     }
// }

// export const config = {
//     matcher: ['/', '/((?!api|_next|.*\\..*).*)'], // Áp dụng middleware cho tất cả các đường dẫn, trừ các đường dẫn tĩnh và API
// }

import { Roles } from '@/constants/type'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { TokenPayload } from '@/types/jwt.type'
import createMiddleware from 'next-intl/middleware'
import { defaultLocale } from '@/config'
import { routing } from './i18n/routing'

const decodeToken = (token: string) => {
    return jwt.decode(token) as TokenPayload
}

const managePaths = ['/vi/manage', '/en/manage']
const guestPaths = ['/vi/guest', '/en/guest']
const onlyOwnerPaths = ['/vi/manage/accounts', '/en/manage/accounts']
const privatePaths = [...managePaths, ...guestPaths]
const unAuthPaths = ['/vi/login', '/en/login']
const loginPaths = ['/vi/login', '/en/login']

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const handleI18nRouting = createMiddleware(routing)
    const response = handleI18nRouting(request)
    const { pathname, searchParams } = request.nextUrl
    // pathname: /manage/dashboard
    const accessToken = request.cookies.get('accessToken')?.value
    const refreshToken = request.cookies.get('refreshToken')?.value
    const locale = request.cookies.get('NEXT_LOCALE')?.value ?? defaultLocale
    // 1. Chưa đăng nhập thì không cho vào private paths
    if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
        const url = new URL(`/${locale}/login`, request.url)
        url.searchParams.set('clearTokens', 'true')
        return NextResponse.redirect(url)
        // response.headers.set('x-middleware-rewrite', url.toString())
        // return response
    }
    // 2. Trường hợp đã đăng nhập
    if (refreshToken) {
        // 2.1 Nếu cố tình vào trang login sẽ redirect về trang chủ
        if (unAuthPaths.some((path) => pathname.startsWith(path))) {
            if (
                loginPaths.some((path) => pathname.startsWith(path)) &&
                searchParams.get('accessToken')
            ) {
                return response
            }
            return NextResponse.redirect(new URL(`/${locale}`, request.url))
            // response.headers.set(
            //   'x-middleware-rewrite',
            //   new URL('/en', request.url).toString()
            // )
            // return response
        }

        // 2.2 Nhưng access token lại hết hạn
        if (
            privatePaths.some((path) => pathname.startsWith(path)) &&
            !accessToken
        ) {
            const url = new URL(`/${locale}/refresh-token`, request.url)
            url.searchParams.set('refreshToken', refreshToken)
            url.searchParams.set('redirect', pathname)
            return NextResponse.redirect(url)
            // response.headers.set('x-middleware-rewrite', url.toString())
            // return response
        }

        // 2.3 Vào không đúng role, redirect về trang chủ
        const role = decodeToken(refreshToken).role
        // Guest nhưng cố vào route owner
        const isGuestGoToManagePath =
            role === Roles.Guest &&
            managePaths.some((path) => pathname.startsWith(path))
        // Không phải Guest nhưng cố vào route guest
        const isNotGuestGoToGuestPath =
            role !== Roles.Guest &&
            guestPaths.some((path) => pathname.startsWith(path))
        // Không phải Owner nhưng cố tình truy cập vào các route dành cho owner
        const isNotOwnerGoToOwnerPath =
            role !== Roles.Owner &&
            onlyOwnerPaths.some((path) => pathname.startsWith(path))
        if (
            isGuestGoToManagePath ||
            isNotGuestGoToGuestPath ||
            isNotOwnerGoToOwnerPath
        ) {
            return NextResponse.redirect(new URL(`/${locale}`, request.url))
            // response.headers.set(
            //   'x-middleware-rewrite',
            //   new URL('/', request.url).toString()
            // )
            // return response
        }

        // return NextResponse.next()
        return response
    }
    return response
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/', '/(vi|en)/:path*']
}