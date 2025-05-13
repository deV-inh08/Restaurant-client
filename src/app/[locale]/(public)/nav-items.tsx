'use client'

import { Roles } from '@/constants/type'
import { cn, handleErrorApi } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { RoleType } from '@/types/jwt.type'
import { Link } from '@/i18n/navigation'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertDialogTrigger } from '@radix-ui/react-alert-dialog'
import { useAppStore } from '@/components/app-providers'
import { useTranslations } from 'next-intl'


const menuItems: {
    title: 'Home' | 'Menu' | 'Orders' | 'Login' | 'Manage',
    href: string
    role?: RoleType[]
    hideWhenLogin?: boolean
}[] = [
        {
            title: 'Home',
            href: '/'
        },
        {
            title: 'Menu',
            href: '/guest/menu',
            role: [Roles.Guest]
        },
        {
            title: 'Orders',
            href: '/guest/orders',
            role: [Roles.Guest]
        },
        {
            title: 'Login',
            href: '/login',
            hideWhenLogin: true
        },
        {
            title: 'Manage',
            href: '/manage/dashboard',
            role: [Roles.Owner, Roles.Employee]
        },
    ]

export default function NavItems({ className }: { className?: string }) {
    const role = useAppStore(state => state.role)
    const t = useTranslations('HomePage')
    const setRole = useAppStore(state => state.setRole)
    const disconnectSocket = useAppStore(state => state.disconnectSocket)
    const logoutMutation = useLogoutMutation()
    const router = useRouter()
    const logout = async () => {
        if (logoutMutation.isPending) return
        try {
            const result = await logoutMutation.mutateAsync()
            toast.success(result.payload.message)
            setRole(undefined)
            router.push('/')
            disconnectSocket()
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
                            {t(item.title)}
                        </Link>
                    )
                }
                return null
            })}
            {role && (
                <AlertDialog>
                    <AlertDialogTrigger><span className={cn(className, 'cursor-pointer')} >
                        Đăng xuất
                    </span></AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Bạn có muốn đăng xuất không?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Việc đăng xuất có thể làm mất đi đơn hàng của bạn
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction onClick={logout}>Tiếp</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}


        </>
    )
}
