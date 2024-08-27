'use client'

import { startTransition, useCallback } from 'react'
import FileSaver from 'file-saver'
import {
  DownloadIcon,
  FileDigitIcon,
  ImageIcon,
  LineChartIcon,
} from 'lucide-react'
import { useQueryStates } from 'nuqs'
import { useGenerateImage } from 'recharts-to-png'
import * as xlsx from 'xlsx'

import { BarChartSkeleton } from '@/components/charts/chart-skeletons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DatePicker } from '@/components/ui/date-picker'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AnyObject, flattenObject } from '@/lib/utils'
import { searchParamsParser } from '@/lib/validations/params'

import {
  EffectivenessChart,
  EffectivenessChartProps,
} from './effectiveness-chart'

export function Effectiveness({ data, aggregator }: EffectivenessChartProps) {
  const [getDivJpeg, { ref }] = useGenerateImage({
    quality: 0.8,
    type: 'image/jpeg',
  })

  const downloadMetricsData = () => {
    if (!data) return

    const _data = JSON.parse(JSON.stringify(data)) as AnyObject[]
    const worksheet = xlsx.utils.json_to_sheet(_data.map(flattenObject))
    const workbook = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Metrics')
    const fileName = `Efectividad de entregas - ${new Date().toISOString()}.xlsx`
    xlsx.writeFile(workbook, fileName)
  }

  const downloadMetricsImage = useCallback(async () => {
    const jpeg = await getDivJpeg()
    const fileName = `Efectividad de entregas - ${new Date().toISOString()}.jpeg`
    if (jpeg) FileSaver.saveAs(jpeg, fileName)
  }, [getDivJpeg])

  return (
    <EffectivenessWrapper
      onDataDownload={downloadMetricsData}
      onImageDownload={downloadMetricsImage}
    >
      <EffectivenessChart ref={ref} data={data} aggregator={aggregator} />
    </EffectivenessWrapper>
  )
}

interface EffectivenessProps extends React.PropsWithChildren {
  onDataDownload?: () => void
  onImageDownload?: () => void
}

function EffectivenessWrapper({
  children,
  onDataDownload,
  onImageDownload,
}: EffectivenessProps) {
  const [params, setParams] = useQueryStates(searchParamsParser, {
    startTransition,
  })
  const range = { from: params.from, to: params.to }

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
                range={range}
                onSelect={(range) => range && setParams(range)}
              />
            </TabsContent>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <span className="sr-only">Descargar</span>
                  <DownloadIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onDataDownload?.()}>
                  <FileDigitIcon className="mr-2 h-4 w-4" />
                  <span>Datos</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onImageDownload?.()}>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  <span>Gráfico</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
