import { LineChartIcon } from 'lucide-react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { getHistoryShipmentMetrics } from '@/lib/actions'
import { useAuth } from '@/lib/auth'

import EffectivenessChart from './effectiveness-chart'
import { DateRangeWithSearchParams } from './with-search-params'

interface HistoryEffectivenessProps {
  from: Date
  to: Date
}

export default function HistoryEffectivenessReport({
  from,
  to,
}: HistoryEffectivenessProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="grid h-8 w-8 place-content-center rounded-md bg-primary text-primary-foreground">
            <LineChartIcon className="h-4 w-4" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-primary">
            Efectividad de entregas
          </h2>
        </div>
        <DateRangeWithSearchParams />
      </CardHeader>
      <CardContent className="pl-0">
        <EffectivenessChartWrapper from={from} to={to} />
      </CardContent>
    </Card>
  )
}

async function EffectivenessChartWrapper({
  from,
  to,
}: HistoryEffectivenessProps) {
  const { user } = await useAuth()

  const metrics = await getHistoryShipmentMetrics({
    from,
    to,
    clientId: user.clientId,
  })

  return <EffectivenessChart type="history" data={metrics} />
}
