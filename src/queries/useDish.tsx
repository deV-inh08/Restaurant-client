import dishApiRequest from "@/apiRequests/dish"
import { useQuery } from "@tanstack/react-query"

export const useGetDishes = () => {
    return useQuery({
        queryKey: ['getDishes'],
        queryFn: dishApiRequest.list
    })
}