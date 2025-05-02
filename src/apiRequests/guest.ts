import { http } from "@/lib/http"
import { LogoutBodyType, RefreshTokenBodyType, RefreshTokenRes } from "@/schema/auth.schema"
import { GuestCreateOrdersResType, GuestGetOrdersResType, GuestLoginBodyType, GuestLoginResType } from "@/schema/guest.schema"
import { CreateOrdersBodyType } from "@/schema/order.schema";

const guestApiRequest = {
    refreshTokenRequest: null as Promise<{
        payload: RefreshTokenRes;
    }> | null,
    serverLogin: (body: GuestLoginBodyType) => http.post<{ payload: GuestLoginResType }>('/guest/auth/login', body),
    login: (body: GuestLoginBodyType) => http.post<{ payload: GuestLoginResType }>('/api/guest/auth/login', body, {
        baseUrl: ''
    }),
    serverLogout: (body: LogoutBodyType & {
        accessToken: string
    }) => http.post<{ payload: { message: string } }>('/guest/auth/logout', body, {
        headers: {
            Authorization: `Bearer ${body.accessToken}`
        }
    }),
    logout: () => http.post('/api/guest/auth/logout', null, {
        baseUrl: ''
    }),
    serverRefreshToken: (body: RefreshTokenBodyType) => http.post<{ payload: RefreshTokenRes }>('/guest/auth/refresh-token', body),
    async refreshToken() {
        if (this.refreshTokenRequest) return this.refreshTokenRequest
        this.refreshTokenRequest = http.post<{ payload: RefreshTokenRes }>('/api/guest/auth/refresh-token', null, {
            baseUrl: ''
        })
        const result = await this.refreshTokenRequest
        this.refreshTokenRequest = null
        return result
    },
    order: (body: CreateOrdersBodyType) => http.post<{ payload: GuestCreateOrdersResType }>('/guest/orders', body),
    getOrders: () => http.get<{ payload: GuestGetOrdersResType }>('/guest/orders')
}

export default guestApiRequest