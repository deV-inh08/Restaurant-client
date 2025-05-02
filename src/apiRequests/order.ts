import { http } from "@/lib/http"
import { GetOrdersResType, UpdateOrderBodyType, UpdateOrderResType } from "@/schema/order.schema"
const orderApiReq = {
    getOrderList: () => http.get<{ payload: GetOrdersResType }>('/orders'),
    updateOrder: (orderId: number, body: UpdateOrderBodyType) => http.put<{ payload: UpdateOrderResType }>(`/orders/${orderId}`, body)
}

export default orderApiReq