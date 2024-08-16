'use client'

import { startTransition } from 'react'
import { DownloadIcon, LineChartIcon } from 'lucide-react'
import { parseAsIsoDateTime, parseAsStringLiteral, useQueryStates } from 'nuqs'
import * as xlsx from 'xlsx'

import { BarChartSkeleton } from '@/components/charts/chart-skeletons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DatePicker } from '@/components/ui/date-picker'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { getShipmentMetrics } from '@/db/queries'
import { AnyObject, flattenObject, getPastMonday, getToday } from '@/lib/utils'

interface EffectivenessProps {
  children: React.ReactNode
  data?: Awaited<ReturnType<typeof getShipmentMetrics>>
}

export function EffectivenessWrapper({ children, data }: EffectivenessProps) {
  const today = getToday()
  const [params, setParams] = useQueryStates(
    {
      aggregator: parseAsStringLiteral([
        'route',
        'deliveryDate',
      ] as const).withDefault('route'),
      date: parseAsIsoDateTime.withDefault(today),
      from: parseAsIsoDateTime.withDefault(getPastMonday(today)),
      to: parseAsIsoDateTime.withDefault(today),
    },
    { startTransition },
  )

  const downloadMetrics = () => {
    if (!data) return

    const _data = JSON.parse(JSON.stringify(data)) as AnyObject[]
    const worksheet = xlsx.utils.json_to_sheet(_data.map(flattenObject))
    const workbook = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Metrics')
    xlsx.writeFile(
      workbook,
      `Efectividad de entregas - ${new Date().toISOString()}.xlsx`,
    )
  }

  return (
    <Tabs
      value={params.aggregator}
      onValueChange={(value) =>
        setParams({ aggregator: value as 'route' | 'deliveryDate' })
      }
      className="my-4 space-y-4"
    >
      <TabsList>
        <TabsTrigger value="route">Diario</TabsTrigger>
        <TabsTrigger value="deliveryDate">Histórico</TabsTrigger>
      </TabsList>
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
          <div className="flex gap-2">
            <TabsContent value="route">
              <DatePicker
                date={params.date}
                onSelect={(date) => date && setParams({ date })}
              />
            </TabsContent>
            <TabsContent value="deliveryDate">
              <DateRangePicker
                date={params}
                onSelect={(dateRange) => dateRange && setParams(dateRange)}
              />
            </TabsContent>
            <Button variant="outline" size="icon" onClick={downloadMetrics}>
              <span className="sr-only">Descargar</span>
              <DownloadIcon className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pl-0">{children}</CardContent>
      </Card>
    </Tabs>
  )
}

export function EffectivenessSkeleton() {
  return (
    <EffectivenessWrapper>
      <BarChartSkeleton />
    </EffectivenessWrapper>
  )
}
