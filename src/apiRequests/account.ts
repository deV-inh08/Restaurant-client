import { http } from "@/lib/http";
import { AccountResType } from "@/schema/account.schema";

const accountApiReq = {
    me: (accessToken: string) => http.get<{ payload: AccountResType }>('/accounts/me', {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default accountApiReq