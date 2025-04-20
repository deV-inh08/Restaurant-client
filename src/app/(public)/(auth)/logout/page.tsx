'use client'
import { getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { UseMutateAsyncFunction } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useRef } from 'react'

const Logout = () => {
    const { mutateAsync } = useLogoutMutation()
    const searchParams = useSearchParams()
    const refreshTokenFromUrl = searchParams.get('refreshToken')
    console.log(refreshTokenFromUrl)
    const ref = useRef<UseMutateAsyncFunction | null>(null)
    const router = useRouter()
    useEffect(() => {
        if (ref.current || refreshTokenFromUrl !== getRefreshTokenFromLocalStorage()) {
            return
        }
        ref.current = mutateAsync
        mutateAsync().then((res) => {
            setTimeout(() => {
                ref.current = null
            }, 1000)
            router.push('/login')
        })
    }, [router, mutateAsync, refreshTokenFromUrl])
    return (
        <div>Logout Page</div>
    )
}

export default Logout