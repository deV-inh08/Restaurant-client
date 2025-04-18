import z from 'zod'
import { Roles } from '@/constants/type'
export const AccountSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    role: z.enum([Roles.Owner, Roles.Employee]),
    avatar: z.string().nullable()
})
export type AccountType = z.TypeOf<typeof AccountSchema>


export const AccountRes = z.object({
    data: AccountSchema,
    message: z.string()
})
export type AccountResType = z.TypeOf<typeof AccountRes>


export const ChangePasswordBody = z.object({
    oldPassword: z.string().min(6).max(100),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100)
})
export type ChangePasswordBodyType = z.TypeOf<typeof ChangePasswordBody>

export const ChangePasswordV2Res = z.object({
    data: z.object({
        accessToken: z.string(),
        refreshToken: z.string(),
        account: z.object({
            id: z.number(),
            name: z.string(),
            email: z.string(),
            role: z.enum([Roles.Owner, Roles.Employee]),
            avatar: z.string().nullable()
        })
    }),
    message: z.string()
})
export type ChangePasswordResType = z.TypeOf<typeof ChangePasswordV2Res>

export const UpdateMeBody = z.object({
    name: z.string().trim().min(2).max(256),
    avatar: z.string().url().optional()
})

export type UpdateMeBodyType = z.TypeOf<typeof UpdateMeBody>