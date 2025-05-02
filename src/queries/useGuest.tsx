import guestApiRequest from "@/apiRequests/guest"
import { useMutation, useQuery } from "@tanstack/react-query"

const useGuestLoginMutation = () => {
    return useMutation({
        mutationFn: guestApiRequest.login
    })
}

const useGuestLogoutMutation = () => {
    return useMutation({
        mutationFn: guestApiRequest.logout
    })
}

const useGuestOrderMutation = () => {
    return useMutation({
        mutationFn: guestApiRequest.order
    })
}

const useGetOrderListQuery = () => {
    return useQuery({
        queryKey: ['orders'],
        queryFn: guestApiRequest.getOrders
    })
}

export {
    useGuestLoginMutation,
    useGuestLogoutMutation,
    useGuestOrderMutation,
    useGetOrderListQuery
}