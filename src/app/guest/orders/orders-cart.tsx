'use client'
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { useGuestGetOrderListQuery } from '@/queries/useGuest'
import React, { useEffect, useMemo } from 'react'
import { formatCurrency, getVietnameseOrdersStatus } from "@/lib/utils"
import socket from "@/lib/socket"
import { UpdateOrderResType } from "@/schema/order.schema"
import { toast } from "sonner"

const OrdersCart = () => {
    const { data, refetch } = useGuestGetOrderListQuery()
    const orders = useMemo(() => data?.payload.data ?? [], [data?.payload.data])
    const totalPrice = useMemo(() => {
        return orders.reduce((result, order) => {
            return result + order.dishSnapshot.price * order.quantity
        }, 0)
    }, [orders])

    useEffect(() => {
        if (socket.connected) {
            onConnect();
        }

        // when connect
        function onConnect() {
            console.log(socket.id)
        }

        // when disconnect
        function onDisconnect() {
            console.log('disconnected')
        }

        // update ordrer
        function onUpdateOrder(data: UpdateOrderResType['data']) {
            const { dishSnapshot: { name } } = data
            toast.success(`Món ăn ${name} vừa được cập nhật sang trạng thái ${getVietnameseOrdersStatus(data.status)}`, {
                duration: 4000
            })
            refetch()
        }

        // listen envent
        socket.on('update-order', onUpdateOrder)
        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("update-order", onUpdateOrder);

        };
    }, [refetch]);

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
                        <h3 className='text-xl font-semibold'>{order.dishSnapshot.name}</h3>
                        <p className='text-xs'>{formatCurrency(order.dishSnapshot.price)}</p>
                        <Badge>
                            {getVietnameseOrdersStatus(order.status)}
                        </Badge>

                    </div>
                    <div className='flex-shrink-0 ml-auto flex justify-center items-center'>
                        <Badge>x{order.quantity}</Badge>
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