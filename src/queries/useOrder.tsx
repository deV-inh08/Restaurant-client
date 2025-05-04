import orderApiReq from "@/apiRequests/order"
import { GetOrdersQueryParamsType, UpdateOrderBodyType } from "@/schema/order.schema"
import { useMutation, useQuery } from "@tanstack/react-query"

const useGetOrderList = (queryParams: GetOrdersQueryParamsType) => {
    return useQuery({
        queryKey: ['orders', queryParams],
        queryFn: () => orderApiReq.getOrderList(queryParams)
    })
}

const useUpdateOrderMutation = () => {
    return useMutation({
        mutationFn: ({ orderId, ...body }: UpdateOrderBodyType & { orderId: number }) => orderApiReq.updateOrder(orderId, body),

    })
}

const useGetOrderDetailQuery = ({
    id,
    enabled
}: {
    id: number,
    enabled: boolean
}) => {
    return useQuery({
        queryKey: ['orders', id],
        queryFn: () => orderApiReq.getOrderDetail(id),
        enabled
    })
}

export {
    useUpdateOrderMutation,
    useGetOrderList,
    useGetOrderDetailQuery
}