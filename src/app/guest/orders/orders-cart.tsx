'use client'
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { useGuestGetOrderListQuery } from '@/queries/useGuest'
import React, { useEffect, useMemo } from 'react'
import { formatCurrency, getVietnameseOrdersStatus } from "@/lib/utils"
import socket from "@/lib/socket"
import { PayGuestOrdersResType, UpdateOrderResType } from "@/schema/order.schema"
import { toast } from "sonner"
import { OrderStatus } from "@/constants/type"

const OrdersCart = () => {
    const { data, refetch } = useGuestGetOrderListQuery()
    const orders = useMemo(() => data?.payload.data ?? [], [data?.payload.data])
    const { waitingForPaying, paid } = useMemo(() => {
        return orders.reduce((result, order) => {
            if (order.status === OrderStatus.Delivered || order.status === OrderStatus.Processing || order.status === OrderStatus.Pending) {
                return {
                    ...result,
                    waitingForPaying: {
                        price: result.waitingForPaying.price + order.dishSnapshot.price * order.quantity,
                        quantity: result.waitingForPaying.quantity + order.quantity
                    }
                }
            }
            if (order.status === OrderStatus.Paid) {
                return {
                    ...result,
                    paid: {
                        price: result.paid.price + order.dishSnapshot.price * order.quantity,
                        quantity: result.paid.quantity + order.quantity
                    }
                }
            }
            return result
        }, {
            waitingForPaying: {
                price: 0,
                quantity: 0
            },
            paid: {
                price: 0,
                quantity: 0
            }
        })
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

        // payment
        function onPayment(data: PayGuestOrdersResType['data']) {
            const { guest } = data[0]
            toast(`${guest?.name} tại bàn ${guest?.tableNumber} thanh toán thành công ${data.length} đơn`)
        }

        // listen envent
        socket.on('update-order', onUpdateOrder)
        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on('payment', onPayment)

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("update-order", onUpdateOrder);
            socket.off('payment', onPayment)
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
                <span>Đơn chưa thanh toán · {waitingForPaying.quantity} món</span>
                <span>{formatCurrency(waitingForPaying.price)}</span>
            </div>
            {paid.quantity ? (
                <div className="w-full flex justify-between text-xl font-semibold text-yellow-600 border-2 p-2 border-yellow-300">
                    <span>Đơn đã thanh toán · {paid.quantity} món</span>
                    <span>{formatCurrency(paid.price)}</span>
                </div>
            ) : undefined}
        </>
    )
}

export default OrdersCart