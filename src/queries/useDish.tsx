import dishApiRequest from "@/apiRequests/dish"
import { UpdateDishBodyType } from "@/schema/dish.schema"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetDishes = () => {
    return useQuery({
        queryKey: ['dishes'],
        queryFn: dishApiRequest.list
    })
}

export const useAddDish = () => {
    return useMutation({
        mutationFn: dishApiRequest.add
    })
}

export const useGetDish = ({ id, enanbled }: { id: number, enanbled: boolean }) => {
    return useQuery({
        queryKey: ['dishes', id],
        queryFn: () => dishApiRequest.getDish(id),
        enabled: enanbled
    })
}

export const useUpdateDishMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, ...body }: UpdateDishBodyType & { id: number }) => dishApiRequest.updateDish(id, body),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['dishes']
            })
        }
    })
}

export const useDeleteDishMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => dishApiRequest.deleteDish(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['dishes']
            })
        }
    })
}