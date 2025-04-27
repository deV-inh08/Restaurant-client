import accountApiReq from "@/apiRequests/account";
import { UpdateEmployeeAccountBodyType } from "@/schema/account.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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


export const useGetAccountList = () => {
    return useQuery({
        queryKey: ['accounts'],
        queryFn: accountApiReq.list
    })
}

export const useGetAccount = ({ id }: { id: number }) => {
    return useQuery({
        queryKey: ['accounts', id],
        queryFn: () => accountApiReq.getEmployee(id)
    })
}

export const useAddAccountMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: accountApiReq.addEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['accounts']
            })
        }
    })
}

export const useUpdateAccountMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, body }: {
            id: number,
            body: UpdateEmployeeAccountBodyType
        }) => accountApiReq.updateEmployee(id, body),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['accounts']
            })
        }
    })
}