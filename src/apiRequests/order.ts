import { http } from "@/lib/http"
import { GetOrderDetailResType, GetOrdersQueryParamsType, GetOrdersResType, UpdateOrderBodyType, UpdateOrderResType } from "@/schema/order.schema"
import queryString from 'query-string'

const orderApiReq = {
    getOrderList: (queryParams: GetOrdersQueryParamsType) => http.get<{ payload: GetOrdersResType }>('/orders?' + queryString.stringify({
        fromDate: queryParams.fromDate?.toISOString(),
        toDate: queryParams.toDate?.toISOString()
    })),
    updateOrder: (orderId: number, body: UpdateOrderBodyType) => http.put<{ payload: UpdateOrderResType }>(`/orders/${orderId}`, body),
    getOrderDetail: (orderId: number) => http.get<{ payload: GetOrderDetailResType }>(`/orders/${orderId}`),

}

export default orderApiReq