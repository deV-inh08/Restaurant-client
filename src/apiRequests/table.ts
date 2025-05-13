import { http } from "@/lib/http";
import { CreateTableBodyType, TableListResType, TableResType, UpdateTableBodyType } from "@/schema/table.schema";

const tableApiReq = {
    list: () => http.get<{ payload: TableListResType }>('tables'),

    add: (body: CreateTableBodyType) => http.post<{ payload: TableResType }>('tables', body),

    getTable: (id: number) => http.get<{ payload: TableResType }>(`tables/${id}`),

    updateTable: (id: number, body: UpdateTableBodyType) => http.put<{ payload: TableResType }>(`tables/${id}`, body),

    deleteTable: (id: number) => http.delete<{ payload: TableResType }>(`tables/${id}`)
}

export default tableApiReq