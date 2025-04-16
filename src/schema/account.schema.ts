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