import { AlertCircle } from 'lucide-react'
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
import type { ShipmentMetrics } from '@/lib/actions'
import { useMediaQuery } from '@/lib/hooks/use-media-query'
import { keyMirror } from '@/lib/utils'

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

const formatPercentValue = (value: number | string) => `${value}%`

interface EffectivenessChartProps {
  data: ShipmentMetrics
}

export default function EffectivenessChart({ data }: EffectivenessChartProps) {
  const isDesktop = useMediaQuery('(min-width: 640px)')

  if (!data.length) {
    return (
      <div className="grid h-[350px] place-content-center">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Sin resultados</AlertTitle>
          <AlertDescription>
            No hay datos de efectividad para mostrar en el dia seleccionado.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const dataKeyHelper = keyMirror(data[0]!)

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} maxBarSize={40}>
        <XAxis
          dataKey={dataKeyHelper.route}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        >
          <Label
            value="Ruta"
            position="insideBottom"
            offset={-2}
            fontSize={12}
          />
        </XAxis>
        <YAxis
          fontSize={12}
          tickLine={false}
          axisLine={false}
          ticks={[0, 25, 50, 75, 100]}
          tickFormatter={formatPercentValue}
        />
        <CartesianGrid
          vertical={false}
          syncWithTicks={true}
          strokeDasharray="3 3"
        />
        <Bar
          name="Entregado"
          dataKey={dataKeyHelper.deliveryRate}
          stackId="rateMetrics"
          fill="#5CC2BC"
        >
          {isDesktop && (
            <LabelList
              dataKey={dataKeyHelper.deliveryRate}
              fontSize={12}
              formatter={formatPercentValue}
              position="inside"
              fill="#FFFFFF"
            />
          )}
        </Bar>
        <Bar
          name="Rechazado"
          dataKey={dataKeyHelper.refusedRate}
          stackId="rateMetrics"
          fill="#E35B64"
        />
        <Bar
          name="Pendiente"
          dataKey={dataKeyHelper.pendingRate}
          stackId="rateMetrics"
          fill="#F3AC3C"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
