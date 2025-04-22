import React from 'react'
import { cookies } from 'next/headers'
import accountApiReq from '@/apiRequests/account'
const Dashboard = async () => {
    const cookieStore = await cookies()
    const accessToken = (cookieStore.get('accessToken')?.value) as string
    const result = await accountApiReq.serverMe(accessToken)
    return (
        <div>{result.payload.data.name}</div>
    )
}

export default Dashboard
