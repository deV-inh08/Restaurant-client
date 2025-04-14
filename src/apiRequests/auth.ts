import { http } from "@/lib/http";
import { LoginBodyType, LoginResponseType } from "@/schema/auth.schema";

const authApiRequest = {
    // login: next server -> main server  
    serverLogin: (body: LoginBodyType) => http.post<{ status: number, payload: LoginResponseType }>('/auth/login', body),
    // login: next client -> next server
    login: (body: LoginBodyType) => http.post<{ status: number, payload: LoginResponseType }>('/api/auth/login', body, {
        baseUrl: '' // baseUrl = undefined => main server || baseUrl = '' => next server
    }),

}

export default authApiRequest