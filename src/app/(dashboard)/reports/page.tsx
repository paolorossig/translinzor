import DayEffectivenessReport from '@/components/modules/shipments/day-effectiveness-report'
import HistoryEffectivenessReport from '@/components/modules/shipments/history-effectiveness-report'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getShipmentMetrics } from '@/lib/actions'
import { useAuth } from '@/lib/auth'
import { searchParamsSchema } from '@/lib/validations/params'
import type { SearchParams } from '@/types'

interface ReportsPageProps {
  searchParams: SearchParams
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const { profile } = await useAuth()

  const { date } = searchParamsSchema.parse(searchParams)
  const dateDay = date ? new Date(`${date}T05:00:00.000Z`) : new Date()

  const metrics = await getShipmentMetrics({
    date: dateDay,
    clientId: profile.clientId,
  })

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
            <DayEffectivenessReport data={metrics} />
          </TabsContent>
          <TabsContent value="history">
            <HistoryEffectivenessReport data={metrics} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
