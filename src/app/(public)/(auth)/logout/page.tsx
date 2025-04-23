'use client'
import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { UseMutateAsyncFunction } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useRef } from 'react'

const Logout = () => {
    const { mutateAsync } = useLogoutMutation()
    const searchParams = useSearchParams()
    const refreshTokenFromUrl = searchParams.get('refreshToken')
    const accessTokenFromUrl = searchParams.get('accessToken')
    const ref = useRef<UseMutateAsyncFunction | null>(null)
    const router = useRouter()
    useEffect(() => {
        if (ref.current || (refreshTokenFromUrl && refreshTokenFromUrl !== getRefreshTokenFromLocalStorage()) || (accessTokenFromUrl && accessTokenFromUrl !== getAccessTokenFromLocalStorage())) {
            return
        }
        ref.current = mutateAsync
        mutateAsync().then(() => {
            setTimeout(() => {
                ref.current = null
            }, 1000)
            router.push('/login')
        })
    }, [router, mutateAsync, refreshTokenFromUrl, accessTokenFromUrl])
    return (
        <div>Logout Page</div>
    )
}

export default Logout