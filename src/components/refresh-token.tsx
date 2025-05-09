'use client'
import useAuth from '@/hooks/useAuth'
import { checkAndRefreshToken } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

// page don't need to check refresh-token
const UNAUTHENTICATED_PATH = ['/login', '/logout', '/refresh-token']
const RefreshToken = () => {
    const router = useRouter()
    const pathName = usePathname()
    const { socket, setSocket } = useAuth()
    useEffect(() => {
        if (UNAUTHENTICATED_PATH.includes(pathName)) return
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let interval: any = null
        const onRefreshToken = (force?: boolean) => {
            checkAndRefreshToken({
                onError: () => {
                    clearInterval(interval)
                    socket?.disconnect()
                    setSocket(undefined)
                    router.push('/login')
                },
                force
            })
        }

        onRefreshToken()
        const TIMEOUT = 1000
        interval = setInterval(onRefreshToken, TIMEOUT)

        if (socket?.connected) {
            onConnect()
        }

        function onConnect() {
            console.log(socket?.id)
        }

        function onDisconnect() {
            console.log('disconnect')
        }

        function onRefreshTokenSocket() {
            onRefreshToken(true)
        }

        // listen socket?
        socket?.on('connect', onConnect)
        socket?.on('disconnect', onDisconnect)
        socket?.on('refresh-token', onRefreshTokenSocket)

        // run when component disMount
        return () => {
            clearInterval(interval)

            socket?.off('connect', onConnect)
            socket?.off('disconnect', onDisconnect)
            socket?.off('refresh-token', onRefreshTokenSocket)

        }
    }, [pathName, router, socket])
    return null
}

export default RefreshToken