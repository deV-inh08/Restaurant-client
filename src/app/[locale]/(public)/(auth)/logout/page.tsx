'use client'
import { useAppStore } from '@/components/app-providers'
import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { UseMutateAsyncFunction } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect, useRef } from 'react'


function Logout() {
    const { mutateAsync } = useLogoutMutation()
    const setRole = useAppStore(state => state.setRole)
    const disconnectSocket = useAppStore(state => state.disconnectSocket)
    const searchParams = useSearchParams()
    const refreshTokenFromUrl = searchParams.get('refreshToken')
    const accessTokenFromUrl = searchParams.get('accessToken')
    const ref = useRef<UseMutateAsyncFunction | null>(null)
    const router = useRouter()
    useEffect(() => {
        if (!ref.current && ((refreshTokenFromUrl && refreshTokenFromUrl === getRefreshTokenFromLocalStorage()) || (accessTokenFromUrl && accessTokenFromUrl === getAccessTokenFromLocalStorage()))) {
            ref.current = mutateAsync
            mutateAsync().then(() => {
                setTimeout(() => {
                    ref.current = null
                }, 1000)
                setRole(undefined)
                router.push('/login')
                disconnectSocket()
            })
        } else {
            router.push('/')
        }
    }, [router, mutateAsync, refreshTokenFromUrl, accessTokenFromUrl, setRole, disconnectSocket])
    return (
        <div>Logout Page</div>
    )
}

const LogoutPage = () => {
    return (
        <Suspense>
            <Logout></Logout>
        </Suspense>
    )
}

export default LogoutPage