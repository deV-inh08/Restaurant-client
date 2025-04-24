'use client'

import { getAccessTokenFromLocalStorage } from "@/lib/utils"
import React, { createContext, useEffect, useState } from "react"

type AuthContextType = {
    isAuth: boolean
    setIsAuth: (value: boolean) => void
}

export const AuthContext = createContext<AuthContextType>({
    isAuth: false,
    setIsAuth: () => { }
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuth, setIsAuth] = useState<boolean>(false)
    useEffect(() => {
        setIsAuth(Boolean(getAccessTokenFromLocalStorage()))
    }, [])

    return (
        <AuthContext.Provider value={{ isAuth, setIsAuth }}>
            {children}
        </AuthContext.Provider>
    )
}