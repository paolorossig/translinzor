'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { LineChartIcon } from 'lucide-react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DatePicker } from '@/components/ui/date-picker'
import type { ShipmentMetrics } from '@/lib/actions'
import { useQueryString } from '@/lib/hooks/use-query-string'

import EffectivenessChart from './effectiveness-chart'

interface DayEffectivenessReportProps {
  data: ShipmentMetrics
}

export default function DayEffectivenessReport({
  data,
}: DayEffectivenessReportProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { createQueryString } = useQueryString()
  const [date, setDate] = useState<Date | undefined>(new Date())

  useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        date: date ? format(date, 'yyyy-MM-dd') : null,
      })}`,
      { scroll: false },
    )
  }, [createQueryString, date, pathname, router])

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
        <DatePicker date={date} onSelect={setDate} />
      </CardHeader>
      <CardContent className="pl-0">
        <EffectivenessChart data={data} />
      </CardContent>
    </Card>
  )
}
