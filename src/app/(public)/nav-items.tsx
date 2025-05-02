'use client'

import useAuth from '@/hooks/useAuth'
import Link from 'next/link'

const menuItems = [
    {
        title: 'Món ăn',
        href: '/menu'
    },
    {
        title: 'Đơn hàng',
        href: '/orders',
        authRequired: true
    },
    {
        title: 'Đăng nhập',
        href: '/login',
        authRequired: false // khong can dang nhap van hien thi
    },
    {
        title: 'Quản lý',
        href: '/manage/dashboard',
        authRequired: true // can dang nhap de hien thi
    }
]

export default function NavItems({ className }: { className?: string }) {
    const { role } = useAuth()
    const visibleItems = menuItems.filter((item) => {
        if (item.authRequired === false && role) return false
        if (item.authRequired === true && !role) return false
        return true
    })

    return visibleItems.map((item) => (
        <Link href={item.href} key={item.href} className={className}>
            {item.title}
        </Link>
    ))
}
