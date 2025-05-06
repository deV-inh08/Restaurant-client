import { indicatorApiReq } from "@/apiRequests/indicator"
import { DashboardIndicatorQueryParamsType } from "@/schema/indicator.schema"
import { useQuery } from "@tanstack/react-query"

export const useDashboardIndicator = (queryParams: DashboardIndicatorQueryParamsType) => {
    return useQuery({
        queryKey: ['dashboardIndicators', queryParams],
        queryFn: () => indicatorApiReq.getDashboardIndicator(queryParams)
    })
}