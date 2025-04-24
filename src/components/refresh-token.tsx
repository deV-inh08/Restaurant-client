'use client'
import { checkAndRefreshToken } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

// page don't need to check refresh-token
const UNAUTHENTICATED_PATH = ['/login', '/logout', '/refresh-token']
const RefreshToken = () => {
    const router = useRouter()
    const pathName = usePathname()
    useEffect(() => {
        if (UNAUTHENTICATED_PATH.includes(pathName)) return
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let interval: any = null
        checkAndRefreshToken({
            onError: () => {
                clearInterval(interval)
                router.push('/login')
            }
        })
        const TIMEOUT = 1000
        interval = setInterval(() => {
            checkAndRefreshToken({
                onError: () => {
                    clearInterval(interval)
                    router.push('/login')
                }
            })
        }, TIMEOUT)
        return () => {
            clearInterval(interval)
        }
    }, [pathName, router])
    return (
        <div></div>
    )
}

export default RefreshToken