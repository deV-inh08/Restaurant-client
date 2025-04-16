import accountApiReq from "@/apiRequests/account";
import { useQuery } from "@tanstack/react-query";

export const useAccountProfile = (accessToken: string) => {
    return useQuery({
        queryKey: ['account-profile', accessToken],
        queryFn: () => accountApiReq.me(accessToken)
    })
}

