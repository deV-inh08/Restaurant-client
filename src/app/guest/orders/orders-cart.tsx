'use client'
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { useGuestGetOrderListQuery } from '@/queries/useGuest'
import React, { useMemo } from 'react'
import { formatCurrency, getVietnameseOrdersStatus } from "@/lib/utils"

const OrdersCart = () => {
    const { data } = useGuestGetOrderListQuery()
    const orders = useMemo(() => data?.payload.data ?? [], [data?.payload.data])
    const totalPrice = useMemo(() => {
        return orders.reduce((result, order) => {
            return result + order.dishSnapshot.price * order.quantity
        }, 0)
    }, [orders])
    return (
        <>
            {orders.map((order, index) => (
                <div key={order.id} className='flex gap-4'>
                    <p className="text-sm font-semibold">{index + 1}</p>
                    <div className='flex-shrink-0 relative'>
                        <Image
                            src={order.dishSnapshot.image}
                            alt={order.dishSnapshot.name}
                            height={100}
                            width={100}
                            quality={100}
                            className='object-cover w-[80px] h-[80px] rounded-md'
                        />
                    </div>
                    <div className='space-y-1'>
                        <h3 className='text-sm'>{order.dishSnapshot.name}</h3>
                        <p className='text-xs font-semibold'>{formatCurrency(order.dishSnapshot.price)}</p>
                        <Badge>
                            {getVietnameseOrdersStatus(order.status)}
                        </Badge>

                    </div>
                    <div className='flex-shrink-0 ml-auto flex justify-center items-center'>
                        <p className="text-sm font-semibold">x{order.quantity}</p>
                    </div>
                </div>
            ))}
            <div className="w-full flex justify-between text-xl font-semibold">
                <span>Đặt hàng · {orders.length} món</span>
                <span>{formatCurrency(totalPrice)}</span>
            </div>
        </>
    )
}

export default OrdersCart