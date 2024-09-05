import { CalendarIcon, ListOrderedIcon, TruckIcon } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getMetrics } from '@/db/queries'

export default async function Home() {
  const metrics = await getMetrics()

  return (
    <>
      <h1 className="scroll-m-20 pb-2 text-2xl font-medium tracking-tight text-primary">
        Dashboard
      </h1>
      <div className="grid gap-x-6 gap-y-3 py-4 sm:grid-cols-3">
        <MetricCard
          title="Entregas totales"
          value={metrics.totalShipments}
          detail="Esto es el número total de entregas"
          icon={TruckIcon}
        />
        <MetricCard
          title="Ordenes totales"
          value={metrics.totalOrders}
          detail="Esto es el número total de ordenes"
          icon={ListOrderedIcon}
        />
        <MetricCard
          title="Días con entregas"
          value={metrics.totalDaysWithShipments}
          detail="Esto es el número total de días con entregas"
          icon={CalendarIcon}
        />
      </div>
    </>
  )
}

interface MetricCardProps {
  title: string
  value: number
  detail: string
  icon: React.ComponentType<{ className?: string }>
}

function MetricCard({ title, value, detail, icon: CardIcon }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <CardIcon className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">
          {new Intl.NumberFormat().format(value)}
        </div>
        <p className="text-xs text-gray-500">{detail}</p>
      </CardContent>
    </Card>
  )
}
