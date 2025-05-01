import { http } from "@/lib/http"
import { LogoutBodyType, RefreshTokenBodyType, RefreshTokenRes } from "@/schema/auth.schema"
import { GuestLoginBodyType, GuestLoginResType } from "@/schema/guest.schema"

const guestApiRequest = {
    refreshTokenRequest: null as Promise<{
        payload: RefreshTokenRes;
    }> | null,
    sLogin: (body: GuestLoginBodyType) => http.post<{ payload: GuestLoginResType }>('/guest/auth/login', body),
    login: (body: GuestLoginBodyType) => http.post<{ payload: GuestLoginResType }>('/api/guest/auth/login', body, {
        baseUrl: ''
    }),
    sLogout: (body: LogoutBodyType & {
        accessToken: string
    }) => http.post('/guest/auth/logout', body, {
        headers: {
            Authorization: `Bearer ${body.accessToken}`
        }
    }),
    logout: () => http.post('/api/guest/auth/logout', null, {
        baseUrl: ''
    }),
    sRefreshToken: (body: RefreshTokenBodyType) => http.post<{ payload: RefreshTokenBodyType }>('/guest/auth/refresh-token', body),
    async refreshToken() {
        if (this.refreshTokenRequest) return this.refreshTokenRequest
        this.refreshTokenRequest = http.post<{ payload: RefreshTokenRes }>('/api/guest/auth/refresh-token', null, {
            baseUrl: ''
        })
        const result = await this.refreshTokenRequest
        this.refreshTokenRequest = null
        return result
    }
}

export default guestApiRequest