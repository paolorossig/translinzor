'use client'

import { forwardRef } from 'react'
import { AlertCircleIcon } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import type { getShipmentMetrics } from '@/db/queries'
import { useMediaQuery } from '@/lib/hooks/use-media-query'
import { toPercent } from '@/lib/utils'

const X_AXIS_LABELS = {
  route: 'Ruta',
  deliveryDate: 'Fecha de entrega',
}

const chartConfig = {
  deliveredRate: {
    label: 'Entregados',
    color: '#5CC2BC',
  },
  refusedRate: {
    label: 'Rechazados',
    color: '#E35B64',
  },
} satisfies ChartConfig

export interface EffectivenessChartProps {
  data: Awaited<ReturnType<typeof getShipmentMetrics>>
  aggregator: 'route' | 'deliveryDate'
}

export const EffectivenessChart = forwardRef<
  HTMLDivElement,
  EffectivenessChartProps
>(({ data, aggregator }, ref) => {
  const isDesktop = useMediaQuery('(min-width: 640px)')

  if (!data.length) return <EmptyState />

  const metrics = data.map(({ aggregator, orders }) => ({
    aggregator:
      typeof aggregator === 'string'
        ? aggregator
        : aggregator.toLocaleDateString('es'),
    deliveredRate: orders.delivered / orders.count,
    refusedRate: orders.refused / orders.count,
  }))

  return (
    <ChartContainer
      ref={ref}
      config={chartConfig}
      className="max-h-[500px] w-full"
    >
      <BarChart data={metrics} maxBarSize={40} accessibilityLayer>
        <CartesianGrid
          vertical={false}
          syncWithTicks={true}
          strokeDasharray="3 3"
        />
        <XAxis
          dataKey="aggregator"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        >
          <Label
            value={X_AXIS_LABELS[aggregator]}
            position="insideBottom"
            offset={-2}
            fontSize={12}
          />
        </XAxis>
        <YAxis
          fontSize={12}
          tickLine={false}
          axisLine={false}
          domain={[0, 1]}
          tickFormatter={(value: number) => toPercent(value)}
        />
        <ChartTooltip
          content={<ChartTooltipContent />}
          labelFormatter={(value: string) =>
            aggregator === 'route'
              ? `${X_AXIS_LABELS[aggregator]}: ${value}`
              : value
          }
          formatter={(value: number) => toPercent(value, 1)}
        />
        <Bar
          name="Entregado"
          dataKey="deliveredRate"
          stackId="rateMetrics"
          fill="var(--color-deliveredRate)"
        >
          {isDesktop && (
            <LabelList
              dataKey="deliveredRate"
              fontSize={12}
              formatter={(value: number) => toPercent(value, 1)}
              position="inside"
              fill="#FFFFFF"
            />
          )}
        </Bar>
        <Bar
          name="Rechazado"
          dataKey="refusedRate"
          stackId="rateMetrics"
          fill="var(--color-refusedRate)"
        />
      </BarChart>
    </ChartContainer>
  )
})
EffectivenessChart.displayName = 'EffectivenessChart'

function EmptyState() {
  return (
    <div className="ml-6 grid h-[350px] place-content-center sm:ml-0">
      <Alert>
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle className="text-primary">Sin resultados</AlertTitle>
        <AlertDescription>
          No hay datos de efectividad para mostrar con los filtros
          seleccionados.
        </AlertDescription>
      </Alert>
    </div>
  )
}

// Override console.error
// This is a hack to suppress the warning about missing defaultProps in recharts library as of version 2.12
// @link https://github.com/recharts/recharts/issues/3615
const error = console.error
// eslint-disable-next-line @typescript-eslint/no-explicit-any
console.error = (...args: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  if (/defaultProps/.test(args[0])) return
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  error(...args)
}
