import { http } from "@/lib/http";
import { LoginBodyType, LoginResponseType, LogoutBodyType } from "@/schema/auth.schema";

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
    logout: (body: LogoutBodyType) => http.post<{ payload: { message: string } }>('/api/auth/logout', body, {
        baseUrl: ''
    })

}
export default authApiRequest