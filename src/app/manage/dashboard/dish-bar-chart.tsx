// 'use client'

// import { Bar, BarChart, XAxis, YAxis } from 'recharts'

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle
// } from '@/components/ui/card'
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent
// } from '@/components/ui/chart'
// // import { DashboardIndicatorResType } from '@/schema/indicator.schema'
// // import { useMemo } from 'react'

// const chartData = [
//   { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
//   { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
//   { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
//   { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
//   { browser: "other", visitors: 90, fill: "var(--color-other)" },
// ]

// const chartConfig = {
//   visitors: {
//     label: "Visitors",
//   },
//   chrome: {
//     label: "Chrome",
//     color: "hsl(var(--chart-1))",
//   },
//   safari: {
//     label: "Safari",
//     color: "hsl(var(--chart-2))",
//   },
//   firefox: {
//     label: "Firefox",
//     color: "hsl(var(--chart-3))",
//   },
//   edge: {
//     label: "Edge",
//     color: "hsl(var(--chart-4))",
//   },
//   other: {
//     label: "Other",
//     color: "hsl(var(--chart-5))",
//   },
// } satisfies ChartConfig

// export function DishBarChart() {
//   // const chartDateColors = useMemo(
//   //   () =>
//   //     chartData.map((data, index) => {
//   //       return {
//   //         ...data,
//   //         fill: colors[index] ?? colors[colors.length - 1]
//   //       }
//   //     }),
//   //   [chartData]
//   // )
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Xếp hạng món ăn</CardTitle>
//         <CardDescription>Được gọi nhiều nhất</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ChartContainer config={chartConfig}>
//           <BarChart
//             accessibilityLayer
//             data={chartData}
//             layout='vertical'
//             margin={{
//               left: 0
//             }}
//           >
//             <YAxis
//               dataKey='name'
//               type='category'
//               tickLine={false}
//               tickMargin={2}
//               axisLine={false}
//               tickFormatter={(value) => {
//                 return value

//                 // return chartConfig[value as keyof typeof chartConfig]?.label
//               }}
//             />
//             <XAxis dataKey='successOrders' type='number' hide />
//             <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
//             <Bar
//               dataKey='successOrders'
//               name={'Đơn thanh toán: '}
//               layout='vertical'
//               radius={5}
//             />
//           </BarChart>
//         </ChartContainer>
//       </CardContent>
//       <CardFooter className='flex-col items-start gap-2 text-sm'>
//         {/* <div className='flex gap-2 font-medium leading-none'>
//           Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
//         </div> */}
//         {/* <div className='leading-none text-muted-foreground'>
//           Showing total visitors for the last 6 months
//         </div> */}
//       </CardFooter>
//     </Card>
//   )
// }


"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { DashboardIndicatorResType } from "@/schema/indicator.schema"
import { useMemo } from "react"

// fake data
// const chartData = [
//   { browser: "chrome", visitors: 275, fill: "var(--chart-1)" },
//   { browser: "safari", visitors: 200, fill: "var(--chart-2)" },
//   { browser: "firefox", visitors: 187, fill: "var(--chart-3)" },
//   { browser: "edge", visitors: 173, fill: "var(--chart-4)" },
//   { browser: "other", visitors: 90, fill: "var(--chart-5)" },
// ]

const colors = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)'
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function DishBarChart({
  chartData
}: {
  chartData: Pick<
    DashboardIndicatorResType['data']['dishIndicator'][0],
    'name' | 'successOrders'
  >[]
}) {
  const chartDateColors = useMemo(
    () =>
      chartData.map((data, index) => {
        return {
          ...data,
          fill: colors[index] ?? colors[colors.length - 1]
        }
      }),
    [chartData])
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Mixed</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          {/* <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="browser"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                return value
                // chartConfig[value as keyof typeof chartConfig]?.label

              }
              }
            />
            <XAxis dataKey="successOrders" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Bar dataKey="successOrders" layout="vertical" radius={5} name={'Đơn thanh toán: '} />
          </BarChart> */}
          <BarChart data={chartDateColors} layout="vertical" margin={{ left: 0 }}>
            <YAxis dataKey="name" type="category" tickLine={false} tickMargin={10} axisLine={false} />
            <XAxis dataKey="successOrders" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="successOrders" layout="vertical" radius={5} name={'Đơn thanh toán: '}>
              {chartDateColors.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
