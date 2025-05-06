import { http } from "@/lib/http";
import { DashboardIndicatorQueryParamsType, DashboardIndicatorResType } from "@/schema/indicator.schema";
import queryString from "query-string";

export const indicatorApiReq = {
    getDashboardIndicator: (queryParams: DashboardIndicatorQueryParamsType) => http.get<{ payload: DashboardIndicatorResType }>('/indicators/dashboard?' + queryString.stringify({
        fromDate: queryParams.fromDate.toISOString(),
        toDate: queryParams.toDate.toISOString()
    }))
}