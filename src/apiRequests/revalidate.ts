import { http } from "@/lib/http";

export const revalidateApiReq = (tag: string) => http.get(`/api/revalidate?tag=${tag}`, {
    baseUrl: ''
})