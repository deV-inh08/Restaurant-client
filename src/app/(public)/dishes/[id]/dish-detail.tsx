import { formatCurrency } from "@/lib/utils"
import { DishResType } from "@/schema/dish.schema"
import Image from "next/image"

export default async function DishDetail({ dish }: {
    dish: DishResType['data']
}) {
    if (!dish) {
        return (
            <p>Món ăn không tồn tại</p>
        )
    }
    return (
        <div className="space-y-4">
            <h1 className="text-2xl lg:text-3xl font-semibold">{dish.name}</h1>
            <p>
                Giá: {formatCurrency(dish.price)}
            </p>
            <Image
                src={dish.image}
                width={700}
                height={700}
                quality={100}
                alt={dish.name}
                className="object-cover w-full h-full max-w-[1080px] max-h-[1080px] rounded-md"
            />
            <p className="">
                {dish.description}
            </p>
        </div>
    )
}