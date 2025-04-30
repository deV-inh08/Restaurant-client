import tableApiReq from "@/apiRequests/table"
import { UpdateTableBodyType } from "@/schema/table.schema"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetTables = () => {
    return useQuery({
        queryKey: ['tables'],
        queryFn: tableApiReq.list
    })
}

export const useAddTable = () => {
    return useMutation({
        mutationFn: tableApiReq.add
    })
}

export const useGetTable = ({ id, enanbled }: { id: number, enanbled: boolean }) => {
    return useQuery({
        queryKey: ['tables', id],
        queryFn: () => tableApiReq.getTable(id),
        enabled: enanbled
    })
}

export const useUpdateTableMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, ...body }: UpdateTableBodyType & { id: number }) => dishApiRequest.updateDish(id, body),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['tables']
            })
        }
    })
}

export const useDeleteTableMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => tableApiReq.deleteTable(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['tables']
            })
        }
    })
}