'use client'

import { useState } from 'react'
import { addDays } from 'date-fns'
import { LineChartIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import type { ShipmentMetrics } from '@/lib/actions'

import EffectivenessChart from './effectiveness-chart'

interface HistoryEffectivenessReportProps {
  data: ShipmentMetrics
}

export default function HistoryEffectivenessReport({
  data,
}: HistoryEffectivenessReportProps) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 14),
    to: addDays(new Date(2024, 0, 14), 20),
  })

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
        <DateRangePicker date={date} onSelect={setDate} />
      </CardHeader>
      <CardContent className="pl-0">
        <EffectivenessChart data={data} />
      </CardContent>
    </Card>
  )
}
