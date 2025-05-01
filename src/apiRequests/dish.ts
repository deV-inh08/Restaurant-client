import { http } from "@/lib/http";
import { CreateDishBodyType, DishListResType, DishResType, UpdateDishBodyType } from "@/schema/dish.schema";

const dishApiRequest = {
    // get list dishes
    list: () => http.get<{ payload: DishListResType }>('dishes', { next: { tags: ['dishes'] } }),
    add: (body: CreateDishBodyType) => http.post<{ payload: DishResType }>('dishes', body),
    getDish: (id: number) => http.get<{ payload: DishResType }>(`dishes/${id}`),
    updateDish: (id: number, body: UpdateDishBodyType) => http.put<{ payload: DishResType }>(`dishes/${id}`, body),
    deleteDish: (id: number) => http.delete<{ payload: DishResType }>(`dishes/${id}`)
}

export default dishApiRequest