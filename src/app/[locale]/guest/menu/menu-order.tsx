'use client'
import Quantity from "@/app/[locale]/guest/menu/quantity"
import { Button } from "@/components/ui/button"
import { DishStatus } from "@/constants/type"
import { formatCurrency, handleErrorApi } from "@/lib/utils"
import { useGetDishes } from "@/queries/useDish"
import { useGuestOrderMutation } from "@/queries/useGuest"
import { GuestCreateOrdersBodyType } from "@/schema/guest.schema"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { toast } from "sonner"


const MenuOrder = () => {
    const data = useGetDishes()
    const dishes = useMemo(() => data.data?.payload.data ?? [], [data])
    const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([])
    const router = useRouter()
    const { mutateAsync } = useGuestOrderMutation()
    const totalPrice = useMemo(() => {
        return dishes.reduce((result, dish) => {
            const order = orders.find((order) => order.dishId === dish.id)
            if (!order) return result
            return result + order.quantity * dish.price
        }, 0)
    }, [dishes, orders])

    const handleQuantityChange = (dishId: number, quantity: number) => {
        setOrders((prevOrder) => {
            if (quantity === 0) {
                return prevOrder.filter((order) => order.dishId !== dishId)
            }
            const index = prevOrder.findIndex((order) => order.dishId === dishId)
            if (index === -1) {
                return [...prevOrder, { dishId, quantity }]
            }
            const newOrders = [...prevOrder]
            newOrders[index] = { ...newOrders[index], quantity }
            return newOrders
        })
    }

    const handleOrder = async () => {
        try {
            const result = await mutateAsync(orders)
            toast.success(result.payload.message)
            router.push('/guest/orders')
        } catch (error) {
            handleErrorApi({
                error,
            })
        }
    }

    return (
        <>
            {dishes.filter((dish) => dish.status !== DishStatus.Hidden).map((dish) => (
                <div key={dish.id} className='flex gap-4'>
                    <div className='flex-shrink-0 relative'>
                        <span className="absolute inset-0 flex items-center justify-center">
                            {dish.status === DishStatus.Unavailable && 'Hết hàng'}
                        </span>
                        <Image
                            src={dish.image}
                            alt={dish.name}
                            height={100}
                            width={100}
                            quality={100}
                            className='object-cover w-[80px] h-[80px] rounded-md'
                        />
                    </div>
                    <div className='space-y-1'>
                        <h3 className='text-sm'>{dish.name}</h3>
                        <p className='text-xs'>{dish.description}</p>
                        <p className='text-xs font-semibold'>{formatCurrency(dish.price)}</p>
                    </div>
                    <div className='flex-shrink-0 ml-auto flex justify-center items-center'>
                        <Quantity
                            onChange={(value) => handleQuantityChange(dish.id, value)}
                            value={orders.find((order) => order.dishId === dish.id)?.quantity ?? 0}
                        />
                    </div>
                </div>
            ))}
            <div className='sticky bottom-0'>
                <Button onClick={handleOrder} className='w-full justify-between'>
                    <span>Đặt hàng · {orders.length} món</span>
                    <span>{formatCurrency(totalPrice)}</span>
                </Button>
            </div>
        </>
    )
}

export default MenuOrder