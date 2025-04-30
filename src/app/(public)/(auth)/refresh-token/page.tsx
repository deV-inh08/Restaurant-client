'use client'
import useAuth from "@/hooks/useAuth"
import { checkAndRefreshToken, getRefreshTokenFromLocalStorage } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, Suspense } from "react"

function RefreshToken() {
    const router = useRouter()
    const { setIsAuth } = useAuth()
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
            setIsAuth(false)
            router.push('/')
        }
    }, [router, refreshTokenFromUrl, redirectPathname, setIsAuth])
    return (
        <div>...Refresh Token</div>
    )
}

const RefreshTokenPage = () => {
    return (
        <Suspense>
            <RefreshToken />
        </Suspense>
    )
}

export default RefreshTokenPage