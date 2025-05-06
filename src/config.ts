import { z } from 'zod'

// type schema '.env'
const configSchema = z.object({
    NEXT_PUBLIC_API_ENDPOINT: z.string(),
    NEXT_PUBLIC_URL: z.string()
})

console.log('test env', process.env.NEXT_PUBLIC_API_ENDPOINT)


const configProject = configSchema.safeParse({
    NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
})

if (!configProject.success) {
    console.log(configProject.error)
    throw new Error('Các biến môi trường không hợp lệ')
}

const envConfig = configProject.data
export type Locale = (typeof locales)[number]

export const locales = ['en', 'vi'] as const
export const defaultLocale: Locale = 'vi'

export default envConfig