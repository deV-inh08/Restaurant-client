import accountApiReq from "@/apiRequests/account";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAccountMe = () => {
    return useQuery({
        queryKey: ['account-profile'],
        queryFn: () => accountApiReq.me()
    })
}

export const useAccountMeServer = (accessToken: string) => {
    return useQuery({
        queryKey: ['account-profile', accessToken],
        queryFn: () => accountApiReq.serverMe(accessToken)
    })
}

export const useMutationAccountMe = () => {
    return useMutation({
        mutationFn: accountApiReq.updateMe
    })
}

// export const useMutationChangePassword = () => {
//     return useMutation({
//         mutationFn: accountApiReq.changePasswordv2
//     })
// }
