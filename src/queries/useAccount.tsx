import accountApiReq from "@/apiRequests/account";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAccountMe = () => {
    return useQuery({
        queryKey: ['account-profile'],
        queryFn: () => accountApiReq.me()
    })
}

export const useMutationAccountMe = () => {
    return useMutation({
        mutationFn: accountApiReq.updateMe
    })
}

export const useMutationChangePassword = () => {
    return useMutation({
        mutationFn: accountApiReq.changePassword
    })
}