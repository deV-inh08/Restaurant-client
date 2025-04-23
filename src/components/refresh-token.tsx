'use client'
import authApiRequest from '@/apiRequests/auth'
import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage, setAccessTokenFromLocalStorage, setRefreshTokenFromLocalStorage } from '@/lib/utils'
import jwt from 'jsonwebtoken'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

// page don't need to check refresh-token
const UNAUTHENTICATED_PATH = ['/login', '/logout', '/refresh-token']
const RefreshToken = () => {
    const pathName = usePathname()
    useEffect(() => {
        if (UNAUTHENTICATED_PATH.includes(pathName)) return
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let interval: any = null
        const checkAndRefreshToken = async () => {
            // get accessToken & refreshToken moi nhat
            const accessToken = getAccessTokenFromLocalStorage()
            const refreshToken = getRefreshTokenFromLocalStorage()

            // khong co accessToken & refreshToken => return
            if (!accessToken || !refreshToken) return

            const decodedAccessToken = jwt.decode(accessToken) as {
                exp: number, // time het han
                iat: number
            }
            const decodeRefreshToken = jwt.decode(refreshToken) as {
                exp: number, // time het han
                iat: number
            }

            // time now (thoi gian hien tai)
            const now = Math.round(new Date().getTime() / 1000)

            // refreshToken het han thi khong refresh-token(accessToken) nua
            if (decodeRefreshToken.exp <= now) return

            /**
             * thoi gian ton tai cua token: token.exp - token.iat
             * thoi gian con lai: token.exp - now
             */
            if (decodedAccessToken.exp - now < (decodedAccessToken.exp - decodedAccessToken.iat) / 3) {
                try {
                    const res = await authApiRequest.refreshToken()
                    setAccessTokenFromLocalStorage(res.payload.data.accessToken)
                    setRefreshTokenFromLocalStorage(res.payload.data.refreshToken)
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (error) {
                    clearInterval(interval)
                }
            }
        }
        checkAndRefreshToken()
        const TIMEOUT = 1000
        interval = setInterval(checkAndRefreshToken, TIMEOUT)
        return () => {
            clearInterval(interval)
        }
    }, [pathName])
    return (
        <div></div>
    )
}

export default RefreshToken