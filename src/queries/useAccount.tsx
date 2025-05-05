import accountApiReq from "@/apiRequests/account";
import { GetGuestListQueryParamsType, UpdateEmployeeAccountBodyType } from "@/schema/account.schema";
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

export const useGetAccount = ({ id, enabled }: { id: number, enabled: boolean }) => {
    return useQuery({
        queryKey: ['accounts', id],
        queryFn: () => accountApiReq.getEmployee(id),
        enabled: enabled
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
        mutationFn: ({ id, ...body }: UpdateEmployeeAccountBodyType & { id: number }) => accountApiReq.updateEmployee(id, body),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['accounts']
            })
        }
    })
}

export const useDeleteAccountMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => accountApiReq.deleteEmployee(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['accounts']
            })
        }
    })
}

export const useGetGuestList = (queryParams: GetGuestListQueryParamsType) => {
    return useQuery({
        queryKey: ['guests', queryParams],
        queryFn: () => accountApiReq.guestList(queryParams)
    })
}

export const useCreateGuestMutation = () => {
    return useMutation({
        mutationFn: accountApiReq.createGuest
    })
}