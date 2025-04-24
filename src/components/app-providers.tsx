'use client'

import RefreshToken from "@/components/refresh-token"
import { AuthProvider } from "@/contexts/AuthContext"
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
            <AuthProvider>
                {children}
                <RefreshToken />
                <ReactQueryDevtools initialIsOpen={false} />
            </AuthProvider>
        </QueryClientProvider>
    )
}

export default AppProvider