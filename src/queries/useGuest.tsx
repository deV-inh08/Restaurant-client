import guestApiRequest from "@/apiRequests/guest"
import { useMutation } from "@tanstack/react-query"

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

export {
    useGuestLoginMutation,
    useGuestLogoutMutation
}