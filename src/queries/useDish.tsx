import dishApiRequest from "@/apiRequests/dish"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useGetDishes = () => {
    return useQuery({
        queryKey: ['getDishes'],
        queryFn: dishApiRequest.list
    })
}

export const useAddDish = () => {
    return useMutation({
        mutationFn: dishApiRequest.add
    })
}