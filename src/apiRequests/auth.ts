import { http } from "@/lib/http";
import { LoginBodyType, LoginResponseType, LogoutBodyType, RefreshTokenBodyType, RefreshTokenRes } from "@/schema/auth.schema";

const authApiRequest = {
    // login: next server -> main server  
    serverLogin: (body: LoginBodyType) => http.post<{ status: number, payload: LoginResponseType }>('/auth/login', body),
    // login: next client -> next server
    login: (body: LoginBodyType) => http.post<{ status: number, payload: LoginResponseType }>('/api/auth/login', body, {
        baseUrl: '' // baseUrl = undefined => main server || baseUrl = '' => next server
    }),
    // logout: next server -> main server
    // main server need 'accessToken' from headers
    serverLogout: (body: LogoutBodyType & { accessToken: string }) => http.post<{ payload: { message: string } }>('/auth/logout', { refreshToken: body.refreshToken }, {
        headers: {
            Authorization: `Bearer ${body.accessToken}`
        }
    }),
    // next client -> next server (khong can truyen AT & RT vi 'request headers' auto send cookie)
    logout: () => http.post<{ payload: { message: string } }>('/api/auth/logout', null, {
        baseUrl: ''
    }),

    // refresh token
    refreshToken: () => http.post<RefreshTokenBodyType>('/api/auth/refresh-token', null, {
        baseUrl: ''
    }),
    serverRefreshToken: (body: RefreshTokenBodyType) => http.post<{ payload: RefreshTokenRes }>('/auth/refresh-token', body)

}
export default authApiRequest