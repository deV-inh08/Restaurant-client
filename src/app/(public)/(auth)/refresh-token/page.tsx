'use client'
import { checkAndRefreshToken, getRefreshTokenFromLocalStorage } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

const RefreshToken = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const refreshTokenFromUrl = searchParams.get('refreshToken')
    const redirectPathname = searchParams.get('redirect')
    useEffect(() => {
        if (refreshTokenFromUrl && refreshTokenFromUrl == getRefreshTokenFromLocalStorage()) {
            checkAndRefreshToken({
                onSuccess: () => {
                    router.push(redirectPathname || '/')
                },
            })
        } else {
            router.push('/')
        }
    }, [router, refreshTokenFromUrl, redirectPathname])
    return (
        <div>...Refresh Token</div>
    )
}

export default RefreshToken