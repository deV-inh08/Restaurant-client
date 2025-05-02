import orderApiReq from "@/apiRequests/order"
import { UpdateOrderBodyType } from "@/schema/order.schema"
import { useMutation, useQuery } from "@tanstack/react-query"

const useGetOrderList = () => {
    return useQuery({
        queryKey: ['orders'],
        queryFn: orderApiReq.getOrderList
    })
}

const useUpdateOrderMutation = () => {
    return useMutation({
        mutationFn: ({ orderId, ...body }: UpdateOrderBodyType & { orderId: number }) => orderApiReq.updateOrder(orderId, body)
    })
}

export {
    useUpdateOrderMutation,
    useGetOrderList
}