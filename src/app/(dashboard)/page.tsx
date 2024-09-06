import { addMonths, endOfMonth, isSameMonth, startOfMonth } from 'date-fns'
import { CalendarIcon, ListOrderedIcon, TruckIcon } from 'lucide-react'

import { MetricCard } from '@/components/modules/metrics/card'
import { EffectivenessProgress } from '@/components/modules/metrics/effectiveness-progress'
import { TopCostumers } from '@/components/modules/metrics/top-costumers'
import {
  getCostumerMetrics,
  getShipmentMetrics,
  getTotalsMetrics,
} from '@/db/queries'
import { formatDateRange } from '@/lib/utils'

export default async function Home() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const from = startOfMonth(addMonths(today, -3))
  const to = endOfMonth(today)
  const l3MDateRange = formatDateRange(from, to)

  const [totals, topCostumers, l3mMetrics] = await Promise.all([
    getTotalsMetrics(),
    getCostumerMetrics({ limit: 8 }),
    getShipmentMetrics({ aggregator: 'deliveryDate', from, to }),
  ])

  const l3mTotals = l3mMetrics.reduce(
    (acc, curr) => {
      acc.count += curr.orders.count
      acc.delivered += curr.orders.delivered
      return acc
    },
    { count: 0, delivered: 0 },
  )

  const l1mTotals = l3mMetrics.reduce(
    (acc, curr) => {
      if (!isSameMonth(new Date(curr.aggregator), today)) return acc
      acc.count += curr.orders.count
      acc.delivered += curr.orders.delivered
      return acc
    },
    { count: 0, delivered: 0 },
  )

  const l3mEffectiveness = Math.round(
    (l3mTotals.delivered / l3mTotals.count) * 100,
  )
  const l1mEffectiveness = l1mTotals.count
    ? Math.round((l1mTotals.delivered / l1mTotals.count) * 100)
    : 100

  return (
    <>
      <h1 className="scroll-m-20 pb-2 text-2xl font-medium tracking-tight text-primary">
        Dashboard
      </h1>
      <div className="grid gap-3 py-4 sm:grid-cols-3 sm:gap-6">
        <MetricCard
          title="Entregas totales"
          value={totals.shipments}
          detail="Esto es el número total de entregas"
          icon={TruckIcon}
        />
        <MetricCard
          title="Ordenes totales"
          value={totals.orders}
          detail="Esto es el número total de ordenes"
          icon={ListOrderedIcon}
        />
        <MetricCard
          title="Días con entregas"
          value={totals.daysWithShipments}
          detail="Esto es el número total de días con entregas"
          icon={CalendarIcon}
        />
        <EffectivenessProgress
          description={l3MDateRange}
          l3mValue={l3mEffectiveness}
          l1mValue={l1mEffectiveness}
        />
        <div className="sm:col-span-2 sm:col-start-2">
          <TopCostumers description={l3MDateRange} data={topCostumers} />
        </div>
      </div>
    </>
  )
}
