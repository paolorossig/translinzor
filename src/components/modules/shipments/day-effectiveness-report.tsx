import { Suspense } from 'react'
import { LineChartIcon } from 'lucide-react'

import { BarChartSkeleton } from '@/components/charts/chart-skeletons'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { getShipmentMetrics } from '@/lib/actions'
import { auth } from '@/lib/auth/server'

import EffectivenessChart from './effectiveness-chart'
import { DatePickerWithSearchParams } from './with-search-params'

interface DayEffectivenessProps {
  date: Date
}

export default function DayEffectivenessReport({
  date,
}: DayEffectivenessProps) {
  return (
    <Card>
      <CardHeader className="flex-col items-center justify-between md:flex-row">
        <div className="flex items-center space-x-2">
          <div className="grid h-8 w-8 shrink-0 place-content-center rounded-md bg-primary text-primary-foreground">
            <LineChartIcon className="h-4 w-4" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-primary">
            Efectividad de entregas
          </h2>
        </div>
        <DatePickerWithSearchParams />
      </CardHeader>
      <CardContent className="pl-0">
        <Suspense key={date.toString()} fallback={<BarChartSkeleton />}>
          <EffectivenessChartWrapper date={date} />
        </Suspense>
      </CardContent>
    </Card>
  )
}

async function EffectivenessChartWrapper({ date }: DayEffectivenessProps) {
  const { user } = await auth()
  const metrics = await getShipmentMetrics({
    date,
    clientId: user.clientId,
  })

  return <EffectivenessChart type="day" data={metrics} />
}
