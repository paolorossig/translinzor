import { Suspense } from 'react'

import { BarChartSkeleton } from '@/components/charts/chart-skeletons'
import {
  Effectiveness,
  EffectivenessChart,
} from '@/components/modules/shipments'
import { getShipmentMetrics } from '@/db/queries'
import { auth } from '@/lib/auth/server'
import { searchParamsCache } from '@/lib/validations/params'
import type { SearchParams } from '@/types'

interface ReportsPageProps {
  searchParams: SearchParams
}

export default function ReportsPage({ searchParams }: ReportsPageProps) {
  const { date, from, to, aggregator } = searchParamsCache.parse(searchParams)
  const loadingKey = JSON.stringify({ date, from, to, aggregator })

  return (
    <>
      <h1 className="scroll-m-20 pb-2 text-2xl font-medium tracking-tight text-primary">
        Reportes
      </h1>
      <Effectiveness>
        <Suspense key={loadingKey} fallback={<BarChartSkeleton />}>
          <Chart />
        </Suspense>
      </Effectiveness>
    </>
  )
}

async function Chart() {
  const { user } = await auth()
  const { date, from, to, aggregator } = searchParamsCache.all()
  const params =
    aggregator === 'route'
      ? { aggregator, date: date! }
      : { aggregator, from: from!, to: to! }

  const data = await getShipmentMetrics({
    clientId: user.clientId,
    ...params,
  })

  return <EffectivenessChart data={data} aggregator={aggregator} />
}
