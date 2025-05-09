'use client'

import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useLogoutMutation } from '@/queries/useAuth'
import { toast } from 'sonner'
import useAuth from '@/hooks/useAuth'
import { handleErrorApi } from '@/lib/utils'

const UNAUTHENTICATED_PATH = ['/login', '/logout', '/refresh-token']

export const ListenLogoutSocket = () => {
    const pathName = usePathname()
    const router = useRouter()
    const { mutateAsync, isPending } = useLogoutMutation()
    const { setRole, disconnectSocket, socket } = useAuth()
    useEffect(() => {
        if (UNAUTHENTICATED_PATH.includes(pathName)) return
        async function onLogout() {
            if (isPending) return
            try {
                const res = await mutateAsync()
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                if (res.payload) {
                    toast.success(res.payload.message)
                    setRole(undefined)
                    router.push('/login')
                    disconnectSocket()
                }
            } catch (error) {
                handleErrorApi({
                    error
                })
            }
        }
        socket?.on('logout', onLogout)
        return () => {
            socket?.off('logout', onLogout)
        }
    }, [pathName, isPending, mutateAsync, router, setRole, disconnectSocket, socket])
    return null
}
