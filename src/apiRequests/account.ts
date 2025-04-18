import { http } from "@/lib/http";
import { AccountResType, UpdateMeBodyType } from "@/schema/account.schema";

const accountApiReq = {
    me: () => http.get<{ payload: AccountResType }>('/accounts/me'),
    updateMe: (body: UpdateMeBodyType) => http.put<{ payload: AccountResType }>('/accounts/me', body)
}

export default accountApiReq