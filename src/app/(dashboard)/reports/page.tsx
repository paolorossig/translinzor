import DayEffectivenessReport from '@/components/modules/shipments/day-effectiveness-report'
import HistoryEffectivenessReport from '@/components/modules/shipments/history-effectiveness-report'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { searchParamsSchema } from '@/lib/validations/params'
import type { SearchParams } from '@/types'

interface ReportsPageProps {
  searchParams: SearchParams
}

export default function ReportsPage({ searchParams }: ReportsPageProps) {
  const { date, from, to } = searchParamsSchema.parse(searchParams)
  const dateDay = date ? new Date(`${date}T05:00:00.000Z`) : new Date()
  const fromDay = from ? new Date(`${from}T05:00:00.000Z`) : new Date()
  const toDay = to ? new Date(`${to}T05:00:00.000Z`) : new Date()

  return (
    <>
      <h1 className="scroll-m-20 pb-2 text-2xl font-medium tracking-tight text-primary">
        Reportes
      </h1>
      <div>
        <Tabs defaultValue="day" className="my-4 space-y-4">
          <TabsList>
            <TabsTrigger value="day">Diario</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>
          <TabsContent value="day">
            <DayEffectivenessReport date={dateDay} />
          </TabsContent>
          <TabsContent value="history">
            <HistoryEffectivenessReport from={fromDay} to={toDay} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
