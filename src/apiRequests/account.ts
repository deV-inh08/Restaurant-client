import { http } from "@/lib/http";
import { AccountListResType, AccountResType, ChangePasswordBodyType, ChangePasswordResType, CreateEmployeeAccountBodyType, CreateGuestBodyType, CreateGuestResType, GetGuestListQueryParamsType, GetListGuestsResType, UpdateEmployeeAccountBodyType, UpdateMeBodyType } from "@/schema/account.schema";
import queryString from "query-string";

const accountApiReq = {
    me: () => http.get<{ payload: AccountResType }>('/accounts/me'),
    serverMe: (accessToken: string) => http.get<{ payload: AccountResType }>('/accounts/me', {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }),
    updateMe: (body: UpdateMeBodyType) => http.put<{ payload: AccountResType }>('/accounts/me', body),
    // changePassword: (body: ChangePasswordBodyType) => http.put<{ payload: AccountResType }>('/accounts/change-password', body),

    changePasswordv2: (body: ChangePasswordBodyType) => http.put<{ payload: ChangePasswordResType }>('/api/accounts/change-password-v2', body, {
        baseUrl: ''
    }),
    serverChangePasswordv2: (body: ChangePasswordBodyType, accessToken: string) => http.put<{ payload: ChangePasswordResType }>('/accounts/change-password-v2', body, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }),
    list: () => http.get<{ payload: AccountListResType }>('/accounts'),

    addEmployee: (body: CreateEmployeeAccountBodyType) => http.post<{ payload: AccountResType }>('/accounts', body),

    updateEmployee: (id: number, body: UpdateEmployeeAccountBodyType) => http.put<{ payload: AccountResType }>(`/accounts/detail/${id}`, body),

    getEmployee: (id: number) => http.get<{ payload: AccountResType }>(`/accounts/detail/${id}`),

    deleteEmployee: (id: number) => http.delete<{ payload: AccountResType }>(`/accounts/detail/${id}`),

    guestList: (queryParams: GetGuestListQueryParamsType) => http.get<{ payload: GetListGuestsResType }>(`/accounts/guests?` + queryString.stringify({
        fromDate: queryParams.fromDate?.toISOString(),
        toDate: queryParams.toDate?.toISOString()
    })),

    createGuest: (body: CreateGuestBodyType) => http.post<{ payload: CreateGuestResType }>(`/accounts/guests`, body)
}

export default accountApiReq