import { http } from "@/lib/http";
import { AccountResType, ChangePasswordBodyType, UpdateMeBodyType } from "@/schema/account.schema";

const accountApiReq = {
    me: () => http.get<{ payload: AccountResType }>('/accounts/me'),
    updateMe: (body: UpdateMeBodyType) => http.put<{ payload: AccountResType }>('/accounts/me', body),
    changePassword: (body: ChangePasswordBodyType) => http.put<{ payload: AccountResType }>('/accounts/change-password', body)
}

export default accountApiReq