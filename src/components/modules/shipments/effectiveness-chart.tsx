'use client'

import { AlertCircleIcon } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { getShipmentMetrics } from '@/db/queries'
import { useMediaQuery } from '@/lib/hooks/use-media-query'
import { toPercent } from '@/lib/utils'

const COLORS = {
  delivered: '#5CC2BC',
  refused: '#E35B64',
}

const LABELS = {
  route: 'Ruta',
  deliveryDate: 'Fecha de entrega',
}

interface EffectivenessChartProps {
  data: Awaited<ReturnType<typeof getShipmentMetrics>>
  aggregator: 'route' | 'deliveryDate'
}

export function EffectivenessChart({
  data,
  aggregator,
}: EffectivenessChartProps) {
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
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={metrics} maxBarSize={40}>
        <XAxis
          dataKey="aggregator"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        >
          <Label
            value={LABELS[aggregator]}
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
        <CartesianGrid
          vertical={false}
          syncWithTicks={true}
          strokeDasharray="3 3"
        />
        <Bar
          name="Entregado"
          dataKey="deliveredRate"
          stackId="rateMetrics"
          fill={COLORS.delivered}
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
          fill={COLORS.refused}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

function EmptyState() {
  return (
    <div className="grid h-[350px] place-content-center">
      <Alert>
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle>Sin resultados</AlertTitle>
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
