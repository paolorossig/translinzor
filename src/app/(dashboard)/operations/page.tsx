import { DataTable, DataTableWrapper } from '@/components/ui/data-table'
import { db } from '@/db'
import { drivers, transportUnits } from '@/db/schema'

import { driversColumns, transportUnitsColumns } from './columns'

async function getTransportUnits() {
  return db.select().from(transportUnits)
}

async function getDrivers() {
  return db.select().from(drivers)
}

export default async function OperationsPage() {
  const [transportUnits, drivers] = await Promise.all([
    getTransportUnits(),
    getDrivers(),
  ])

  return (
    <>
      <h1 className="scroll-m-20 pb-4 text-2xl font-medium tracking-tight text-primary">
        Operaciones
      </h1>
      <div className="space-y-6">
        <section>
          <h2 className="pb-2 text-xl font-semibold tracking-tight text-foreground">
            Unidades de Transportes
          </h2>
          <DataTableWrapper
            columns={transportUnitsColumns}
            data={transportUnits}
          >
            <DataTable className="mt-2" />
          </DataTableWrapper>
        </section>
        <section>
          <h2 className="pb-4 text-xl font-semibold tracking-tight text-foreground">
            Choferes
          </h2>
          <DataTableWrapper columns={driversColumns} data={drivers}>
            <DataTable className="mt-2" />
          </DataTableWrapper>
        </section>
      </div>
    </>
  )
}
