'use client'
import { useAppStore } from "@/components/app-providers"
import { checkAndRefreshToken, getRefreshTokenFromLocalStorage } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, Suspense } from "react"

function RefreshToken() {
    const router = useRouter()
    const setRole = useAppStore(state => state.setRole)
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
            setRole(undefined)
            router.push('/')
        }
    }, [router, refreshTokenFromUrl, redirectPathname, setRole])
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