'use client'

import { decodeToken, getAccessTokenFromLocalStorage } from "@/lib/utils"
import { RoleType } from "@/types/jwt.type"
import React, { createContext, useEffect, useState } from "react"

type AuthContextType = {
    role: RoleType | undefined
    setRole: React.Dispatch<React.SetStateAction<RoleType | undefined>>
}

export const AuthContext = createContext<AuthContextType>({
    role: undefined,
    setRole: () => { }
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [role, setRole] = useState<RoleType | undefined>()
    useEffect(() => {
        const accessToken = getAccessTokenFromLocalStorage()
        if (accessToken) {
            const decodeAccessToken = decodeToken(accessToken) as { role: "Owner" | "Employee" | "Guest" }
            setRole(decodeAccessToken.role)
        }
    }, [])

    return (
        <AuthContext.Provider value={{ role, setRole }}>
            {children}
        </AuthContext.Provider>
    )
}