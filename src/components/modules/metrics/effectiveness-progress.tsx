'use client'

import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react'
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ChartConfig, ChartContainer } from '@/components/ui/chart'

const chartConfig = {
  effectiveness: {
    label: 'Efectividad',
    color: '#4ADE7F',
  },
} satisfies ChartConfig

interface EffectivenessProgressProps {
  description?: string
  l3mValue: number
  l1mValue: number
}

export function EffectivenessProgress({
  description,
  l3mValue,
  l1mValue,
}: EffectivenessProgressProps) {
  const chartData = [
    {
      metric: 'effectiveness',
      value: l3mValue,
      fill: 'var(--color-effectiveness)',
    },
  ]
  const endAngle = Math.round(l3mValue * 3.6)
  const TrendingIcon = l1mValue > l3mValue ? TrendingUpIcon : TrendingDownIcon

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center">
        <CardTitle>Efectividad</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={endAngle}
            innerRadius={80}
            outerRadius={140}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="value" background />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          <tspan>{chartData[0]?.value.toLocaleString()}</tspan>
                          <tspan className="fill-muted-foreground text-sm">
                            %
                          </tspan>
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          vs {l1mValue}% este mes
          <TrendingIcon className="h-4 w-4" />
        </div>
        <div className="text-center leading-none text-muted-foreground">
          Métrica calculada como porcentaje de órdenes entregadas sobre totales
        </div>
      </CardFooter>
    </Card>
  )
}
