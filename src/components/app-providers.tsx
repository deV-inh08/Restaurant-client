/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { ListenLogoutSocket } from "@/components/listen-logout-socket"
import RefreshToken from "@/components/refresh-token"
import { decodeToken, generateSocketInstance, getAccessTokenFromLocalStorage, removeTokensFromLS } from "@/lib/utils"
import { RoleType } from "@/types/jwt.type"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useEffect, useRef, useState } from "react"
import { Socket } from "socket.io-client"
import { create } from 'zustand'


interface AppStoreType {
    isAuth: boolean
    role: RoleType | undefined
    setRole: (role?: RoleType | undefined) => void
    socket: Socket | undefined
    setSocket: (socket?: Socket) => void
    disconnectSocket: () => void
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Tab 1 -> Tab 2 => refetch API
            // false: don't fetch
            refetchOnWindowFocus: false,
            refetchOnMount: true,
        }
    }
})

export const useAppStore = create<AppStoreType>((set) => (
    {
        isAuth: false,
        role: undefined as RoleType | undefined,
        setRole: (role: RoleType | undefined) => {
            set({ role, isAuth: Boolean(role) })
            if (!role) {
                removeTokensFromLS()
            }
        },
        socket: undefined as Socket | undefined,
        setSocket: (socket?: Socket) => set({ socket }),
        disconnectSocket: () => set((state) => {
            if (state.socket) {
                state.socket.disconnect()
            }
            return { socket: undefined }
        })
    }
))

const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [role, setRole] = useState<RoleType | undefined>()
    const [socket, setSocket] = useState<Socket | undefined>(undefined)
    const count = useRef(0)
    useEffect(() => {
        if (count.current === 0) {
            const accessToken = getAccessTokenFromLocalStorage()
            if (accessToken) {
                const decodeAccessToken = decodeToken(accessToken) as { role: "Owner" | "Employee" | "Guest" }
                setRole(decodeAccessToken.role)
                setSocket(generateSocketInstance(accessToken))
            }
            count.current++
        }
    }, [])

    // const disconnectSocket = useCallback(() => {
    //     socket?.disconnect()
    //     setSocket(undefined)
    // }, [socket, setSocket])
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <RefreshToken />
            <ListenLogoutSocket />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}

export default AppProvider