import http from "@/lib/http";
import { LoginBodyType, LoginResponseType, LogoutBodyType } from "@/schema/auth.schema";

const authApiRequest = {
    // login: next server -> main server  
    serverLogin: (body: LoginBodyType) => http.post<LoginResponseType>('/auth/login', body),
    // login: next client -> next server
    login: (body: LoginBodyType) => http.post<LoginResponseType>('/api/auth/login', body, {
        baseUrl: '' // baseUrl = undefined => main server || baseUrl = '' => next server
    }),

    // server Logout: Next server -> Main server
    serverLogout: (body: LogoutBodyType & {
        accessToken: string
    }) => http.post('/auth/logout', body, {
        headers: {
            Authorization: `Bearer ${body.accessToken}`
        }
    }),

    // logout: Next client -> Next server
    logout: (body: LogoutBodyType) => http.post('/api/auth/logout', body, {
        baseUrl: ''
    })
}

export default authApiRequest