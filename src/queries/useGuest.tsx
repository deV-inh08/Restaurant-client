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

const useGuestGetOrderListQuery = () => {
    return useQuery({
        queryKey: ['orders'],
        queryFn: guestApiRequest.getOrderList
    })
}

export {
    useGuestLoginMutation,
    useGuestLogoutMutation,
    useGuestOrderMutation,
    useGuestGetOrderListQuery
}