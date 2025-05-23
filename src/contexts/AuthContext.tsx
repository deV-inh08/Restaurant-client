// 'use client'

// import { decodeToken, generateSocketInstance, getAccessTokenFromLocalStorage, removeTokensFromLS } from "@/lib/utils"
// import { RoleType } from "@/types/jwt.type"
// import React, { createContext, useCallback, useEffect, useRef, useState } from "react"
// import type { Socket } from "socket.io-client"
// import type { DefaultEventsMap } from '../../node_modules/@socket.io/component-emitter'
// import { create } from 'zustand'

// type AuthContextType = {
//     role: RoleType | undefined
//     setRole: React.Dispatch<React.SetStateAction<RoleType | undefined>>
//     socket: undefined | Socket
//     setSocket: React.Dispatch<React.SetStateAction<Socket<DefaultEventsMap, DefaultEventsMap> | undefined>>
//     disconnectSocket: () => void
// }

// export const useAppStore = create((set) => (
//     {
//         role: undefined as RoleType | undefined,
//         setRole: (role?: RoleType | undefined) => {
//             set({ role })
//             if (!role) {
//                 removeTokensFromLS()
//             }
//         },
//         socket: undefined as Socket | undefined,
//         setSocket: (socket?: Socket) => set({ socket }),
//         disconnectSocket: () => set((state) => {
//             state.socket.disconnect()
//             return { socket: undefined }
//         })
//     }
// ))

// export const AuthContext = createContext<AuthContextType>({
//     role: undefined,
//     setRole: () => { },
//     socket: undefined,
//     setSocket: () => { },
//     disconnectSocket: () => { }
// })

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//     const [role, setRole] = useState<RoleType | undefined>()
//     const [socket, setSocket] = useState<Socket | undefined>(undefined)
//     const count = useRef(0)
//     useEffect(() => {
//         if (count.current === 0) {
//             const accessToken = getAccessTokenFromLocalStorage()
//             if (accessToken) {
//                 const decodeAccessToken = decodeToken(accessToken) as { role: "Owner" | "Employee" | "Guest" }
//                 setRole(decodeAccessToken.role)
//                 if (count.current === 0) {
//                     const accessToken = getAccessTokenFromLocalStorage()
//                     if (accessToken) {
//                         const decodeAccessToken = decodeToken(accessToken) as { role: "Owner" | "Employee" | "Guest" }
//                         setRole(decodeAccessToken.role)
//                         setSocket(generateSocketInstance(accessToken))
//                     }
//                 }
//             }
//         }
//         count.current++
//     }, [])

//     const disconnectSocket = useCallback(() => {
//         socket?.disconnect()
//         setSocket(undefined)
//     }, [socket, setSocket])

//     return (
//         <AuthContext.Provider value={{ role, setRole, socket, setSocket, disconnectSocket }}>
//             {children}
//         </AuthContext.Provider>
//     )
// }