'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { LoginBodyType, LoginBodySchema } from '@/schema/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLoginMutation } from '@/queries/useAuth'
import { generateSocketInstance, handleErrorApi, removeTokensFromLS } from '@/lib/utils'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppStore } from '@/components/app-providers'
import { Suspense, useEffect } from 'react'
import { useTranslations } from 'next-intl'

function LoginForm() {
    const t = useTranslations('Login')
    const setRole = useAppStore(state => state.setRole)
    const setSocket = useAppStore(state => state.setSocket)
    const router = useRouter()
    const searchParams = useSearchParams()
    const clearToken = searchParams.get('clearTokens')
    const loginMutation = useLoginMutation()
    const form = useForm<LoginBodyType>({
        resolver: zodResolver(LoginBodySchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    useEffect(() => {
        if (clearToken) {
            removeTokensFromLS()
            setRole(undefined)
        }
    }, [clearToken, setRole])


    const onSubmit = async (data: LoginBodyType) => {
        try {
            const res = await loginMutation.mutateAsync(data)
            if (res.payload) {
                toast.success(res.payload.message)
                setRole(res.payload.data.account.role)
                setSocket(generateSocketInstance(res.payload.data.accessToken))
                router.push('/')
            }
        } catch (error) {
            handleErrorApi({ error, setError: form.setError })
        }
    }

    return (
        <Card className='mx-auto max-w-sm'>
            <CardHeader>
                <CardTitle className='text-2xl'>{t('title')}</CardTitle>
                <CardDescription>{t('desc')}</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className='space-y-2 max-w-[600px] flex-shrink-0 w-full' noValidate onSubmit={form.handleSubmit(onSubmit, (error) => {
                        console.warn(error)
                    })}>
                        <div className='grid gap-4'>
                            <FormField
                                control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem>
                                        <div className='grid gap-2'>
                                            <Label htmlFor='email'>Email</Label>
                                            <Input id='email' type='email' placeholder='m@example.com' required {...field} />
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='password'
                                render={({ field }) => (
                                    <FormItem>
                                        <div className='grid gap-2'>
                                            <div className='flex items-center'>
                                                <Label htmlFor='password'>{t('password')}</Label>
                                            </div>
                                            <Input id='password' type='password' required {...field} />
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <Button type='submit' className='w-full'>
                                {t('title')}
                            </Button>
                            <Button variant='outline' className='w-full' type='button'>
                                {t('gg')}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default function LoginFormPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    )
}
