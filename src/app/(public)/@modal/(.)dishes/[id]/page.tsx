import dishApiRequest from "@/apiRequests/dish"
import Modal from "@/app/(public)/@modal/(.)dishes/[id]/modal"
import DishDetail from "@/app/(public)/dishes/[id]/dish-detail"
import { wrapServerApi } from "@/lib/utils"

export default async function DishPage({ params }: {
    params: {
        id: string
    }
}) {
    const { id } = await params
    const data = await wrapServerApi(() => dishApiRequest.getDish(Number(id)))
    const dish = data?.payload?.data
    if (!dish) {
        return (
            <p>Món ăn không tồn tại</p>
        )
    }
    return (
        <Modal>
            <DishDetail dish={dish}></DishDetail>
        </Modal>
    )
}