'use client'

import { Bar, BarChart, XAxis, YAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { getCostumerMetrics } from '@/db/queries'

const chartConfig = {
  orders: { label: 'Ordenes' },
} satisfies ChartConfig

interface TopCostumersProps {
  description?: string
  data: Awaited<ReturnType<typeof getCostumerMetrics>>
}

export function TopCostumers({ description, data }: TopCostumersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clientes Top</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[300px] w-full">
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{ left: 0 }}
            barSize={15}
          >
            <YAxis
              dataKey="costumer"
              type="category"
              tickLine={false}
              axisLine={false}
              width={170}
            />
            <XAxis dataKey="orders" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="orders" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
