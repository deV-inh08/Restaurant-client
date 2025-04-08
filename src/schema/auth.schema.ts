import z from 'zod'
import { RoleValues } from '@/constants/type' // you should set RoleValues as const (readOnly)

export const LoginBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100)
})

// type LoginBody
export type LoginBodyType = z.TypeOf<typeof LoginBodySchema>

// Response Login
export const LoginResponse = z.object({
    data: z.object({
        accessToken: z.string(),
        refreshToken: z.string(),
        account: z.object({
            id: z.string(),
            name: z.string(),
            email: z.string(),
            role: z.enum(RoleValues),
            avatar: z.string().nullable()
        })
    }),
    message: z.string()
})
// type Login Response
export type LoginResponseType = z.TypeOf<typeof LoginResponse>

// Refresh Token
export const RefreshTokenBody = z
    .object({
        refreshToken: z.string()
    })
    .strict()

// RefreshToken type
export type RefreshTokenBodyType = z.TypeOf<typeof RefreshTokenBody>

// Logout
export const LogoutBody = z
    .object({
        refreshToken: z.string()
    })
    .strict()

// Logout Type
export type LogoutBodyType = z.TypeOf<typeof LogoutBody>