import dishApiRequest from "@/apiRequests/dish"
import DishDetail from "@/app/(public)/dishes/[id]/dish-detail"
import { wrapServerApi } from "@/lib/utils"

type tParams = Promise<{ id: string }>

export default async function DishPage({ params }: {
    params: tParams
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
        <DishDetail dish={dish} />
    )
}