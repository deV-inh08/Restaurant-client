import { http } from "@/lib/http";
import { AccountResType, ChangePasswordBodyType, ChangePasswordResType, UpdateMeBodyType } from "@/schema/account.schema";

const accountApiReq = {
    me: () => http.get<{ payload: AccountResType }>('/accounts/me'),
    updateMe: (body: UpdateMeBodyType) => http.put<{ payload: AccountResType }>('/accounts/me', body),
    // changePassword: (body: ChangePasswordBodyType) => http.put<{ payload: AccountResType }>('/accounts/change-password', body),

    changePasswordv2: (body: ChangePasswordBodyType) => http.put<{ payload: ChangePasswordResType }>('/api/accounts/change-password-v2', body, {
        baseUrl: ''
    }),
    serverChangePasswordv2: (body: ChangePasswordBodyType, accessToken: string) => http.put<{ payload: ChangePasswordResType }>('/accounts/change-password-v2', body, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default accountApiReq