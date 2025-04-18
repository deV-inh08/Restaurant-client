import { http } from "@/lib/http"
import { UploadImageResType } from "@/schema/media.schema"

const mediaApiReq = {
    uploadImage: (body: FormData) => http.post<{ payload: UploadImageResType }>('/media/upload', body)
}

export default mediaApiReq