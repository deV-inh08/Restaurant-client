'use client'

import RefreshToken from "@/components/refresh-token"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Tab 1 -> Tab 2 => refetch API
            // false: don't fetch
            refetchOnWindowFocus: false,
            refetchOnMount: false,
        }
    }
})

const AppProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <RefreshToken />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}

export default AppProvider