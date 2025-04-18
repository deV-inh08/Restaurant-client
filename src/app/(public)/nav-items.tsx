'use client'

import { getAccessTokenFromLocalStorage } from '@/lib/utils'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const menuItems = [
    {
        title: 'Món ăn',
        href: '/menu'
    },
    {
        title: 'Đơn hàng',
        href: '/orders'
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
    const [isAuth, setIsAuth] = useState(false)
    const visibleItems = menuItems.filter((item) => {
        if (item.authRequired === false && isAuth) return false
        if (item.authRequired === true && !isAuth) return false
        return true
    })
    useEffect(() => {
        setIsAuth(Boolean(getAccessTokenFromLocalStorage()))
    }, [])
    return visibleItems.map((item) => (
        <Link href={item.href} key={item.href} className={className}>
            {item.title}
        </Link>
    ))
}
