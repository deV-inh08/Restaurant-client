import OrdersCart from '@/app/[locale]/guest/orders/orders-cart'
import { Toaster } from "@/components/ui/sonner"
import React from 'react'

const OrdersPage = () => {
    return (
        <>
            <OrdersCart />
            <Toaster />

        </>
    )
}

export default OrdersPage