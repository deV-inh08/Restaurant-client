import mediaApiReq from "@/apiRequests/media"
import { useMutation } from "@tanstack/react-query"

export const useMutationMediaUpload = () => {
    return useMutation({
        mutationFn: mediaApiReq.uploadImage
    })
}