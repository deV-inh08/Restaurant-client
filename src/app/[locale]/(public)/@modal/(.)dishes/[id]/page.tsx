import dishApiRequest from "@/apiRequests/dish"
import Modal from "@/app/[locale]/(public)/@modal/(.)dishes/[id]/modal"
import DishDetail from "@/app/[locale]/(public)/dishes/[id]/dish-detail"
import { wrapServerApi } from "@/lib/utils"

type tParams = Promise<{ id: string }>

export default async function DishPage(
    props: {
        params: tParams
    }) {
    const { id } = await props.params;
    const data = await wrapServerApi(() => dishApiRequest.getDish(Number(id)));
    const dish = data?.payload?.data;
    if (!dish) {
        return <p>Món ăn không tồn tại</p>;
    }
    return (
        <Modal>
            <DishDetail dish={dish}></DishDetail>
        </Modal>
    );
}