'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { UpdateMeBody, UpdateMeBodyType } from '@/schema/account.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useEffect, useRef, useState } from 'react'
import { handleErrorApi } from '@/lib/utils'
import { useAccountMe, useMutationAccountMe } from '@/queries/useAccount'
import { useMutationMediaUpload } from '@/queries/useMedia'
import { toast } from 'sonner'

export default function UpdateProfileForm() {
    const [file, setFile] = useState<File | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const { data, refetch } = useAccountMe()
    const updateMeMutation = useMutationAccountMe()
    const mediaMutation = useMutationMediaUpload()
    const form = useForm<UpdateMeBodyType>({
        resolver: zodResolver(UpdateMeBody),
        defaultValues: {
            name: '',
            avatar: undefined
        }
    })
    const getMeData = data?.payload.data
    const avatar = form.watch('avatar')
    const name = form.watch('name')
    const previewAvatar = file ? URL.createObjectURL(file) : avatar
    useEffect(() => {
        if (getMeData) {
            const { avatar, name } = getMeData
            form.reset({
                avatar: avatar ?? undefined,
                name
            })
        }
    }, [form, getMeData])
    // reset form if user click cancel
    const reset = () => form.reset()
    const onSubmit = async (value: UpdateMeBodyType) => {
        try {
            let body = value
            if (file) {
                const formData = new FormData()
                formData.append('file', file)
                // update 'formData' => useMedia
                // update media (avatar)

                const res = await mediaMutation.mutateAsync(formData)
                // get payload from 'res' to update me
                const avatar = res.payload.data
                body = {
                    ...value,
                    avatar
                }
            }
            // update me
            const result = await updateMeMutation.mutateAsync(body)
            toast.success(result.payload.message)
            refetch()
        } catch (error) {
            handleErrorApi({
                error,
                setError: form.setError
            })
        }
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, (error) => {
                console.log(error)
            })} onReset={reset} noValidate className='grid auto-rows-max items-start gap-4 md:gap-8'>
                <Card x-chunk='dashboard-07-chunk-0'>
                    <CardHeader>
                        <CardTitle>Thông tin cá nhân</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='grid gap-6'>
                            <FormField
                                control={form.control}
                                name='avatar'
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <div className='flex gap-2 items-start justify-start'>
                                                <Avatar className='aspect-square w-[100px] h-[100px] rounded-md object-cover'>
                                                    <AvatarImage src={previewAvatar} />
                                                    <AvatarFallback className='rounded-none'>{name}</AvatarFallback>
                                                </Avatar>
                                                <input type='file' accept='image/*' className='hidden' ref={inputRef} onChange={(e) => {
                                                    const file = e.target.files?.['0']
                                                    if (file) {
                                                        setFile(file)
                                                        field.onChange(
                                                            'http://localhost:3000/' + field.name
                                                        )
                                                    }

                                                }} />
                                                <button
                                                    className='flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed'
                                                    type='button'
                                                    onClick={() => inputRef.current?.click()}
                                                >
                                                    <Upload className='h-4 w-4 text-muted-foreground' />
                                                    <span className='sr-only'>Upload</span>
                                                </button>
                                            </div>
                                        </FormItem>
                                    )
                                }}
                            />

                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <div className='grid gap-3'>
                                            <Label htmlFor='name'>Tên</Label>
                                            <Input id='name' type='text' className='w-full' {...field} />
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <div className=' items-center gap-2 md:ml-auto flex'>
                                <Button variant='outline' size='sm' type='reset'>
                                    Hủy
                                </Button>
                                <Button size='sm' type='submit'>
                                    Lưu thông tin
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </Form >
    )
}
