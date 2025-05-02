'use client'

import { Roles } from '@/constants/type'
import useAuth from '@/hooks/useAuth'
import { cn, handleErrorApi } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { RoleType } from '@/types/jwt.type'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const menuItems: {
    title: string,
    href: string
    role?: RoleType[]
    hideWhenLogin?: boolean
}[] = [
        {
            title: 'Trang chủ',
            href: '/'
        },
        {
            title: 'Menu',
            href: '/guest/menu',
            role: [Roles.Guest]
        },
        {
            title: 'Đăng nhập',
            href: '/login',
            hideWhenLogin: true
        },
        {
            title: 'Quản lý',
            href: '/manage/dashboard',
            role: [Roles.Owner, Roles.Employee]
        },
    ]

export default function NavItems({ className }: { className?: string }) {
    const { role, setRole } = useAuth()
    const logoutMutation = useLogoutMutation()
    const router = useRouter()
    const logout = async () => {
        if (logoutMutation.isPending) return
        try {
            const result = await logoutMutation.mutateAsync()
            toast.success(result.payload.message)
            setRole(undefined)
            router.push('/')
        } catch (error) {
            handleErrorApi({
                error
            })
        }
    }
    return (
        <>
            {menuItems.map((item) => {
                const isAuth = item.role && role && item.role.includes(role)
                const canShow = (item.role === undefined && !item.hideWhenLogin) ||
                    (!role && item.hideWhenLogin)
                if (isAuth || canShow) {
                    return (
                        <Link href={item.href} key={item.href} className={className}>
                            {item.title}
                        </Link>
                    )
                }
                return null
            })}
            {role && (
                <span className={cn(className, 'cursor-pointer')} onClick={logout}>
                    Đăng xuất
                </span>
            )}
        </>
    )
}
