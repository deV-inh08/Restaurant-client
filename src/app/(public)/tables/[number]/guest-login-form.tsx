'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GuestLoginBodyType, GuestLoginBody } from '@/schema/guest.schema'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useGuestLoginMutation } from '@/queries/useGuest'
import { generateSocketInstance, handleErrorApi } from '@/lib/utils'
import { useAppStore } from '@/components/app-providers'
import { useTranslations } from 'next-intl'
export default function GuestLoginForm() {
  const t = useTranslations('LoginGuest')
  const setRole = useAppStore(state => state.setRole)
  const setSocket = useAppStore(state => state.setSocket)
  const searchParams = useSearchParams()
  const { number } = useParams()

  const tableNumber = Number(number)
  const token = searchParams.get('token')!

  const router = useRouter()

  const guestLoginMutaion = useGuestLoginMutation()

  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: '',
      token: token ?? '',
      tableNumber: tableNumber ?? ''
    }
  })

  useEffect(() => {
    if (!token) return router.push('/')
  }, [token, router])

  const onSubmit = async (values: GuestLoginBodyType) => {
    if (guestLoginMutaion.isPending) return
    try {
      const result = await guestLoginMutaion.mutateAsync(values)
      setRole(result.payload.data.guest.role)
      setSocket(generateSocketInstance(result.payload.data.accessToken))
      router.push('/guest/menu')
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }

  return (
    <Card className='mx-auto max-w-sm'>
      <CardHeader>
        <CardTitle className='text-2xl'>{t('title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, (error) => {
            console.log(error)
          })} className='space-y-2 max-w-[600px] flex-shrink-0 w-full' noValidate>
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-2'>
                      <Label htmlFor='name'>{t('description')}</Label>
                      <Input id='name' type='text' required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button type='submit' className='w-full'>
                Đăng nhập
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
