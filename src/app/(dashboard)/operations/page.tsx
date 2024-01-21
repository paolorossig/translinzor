import { DataTable, DataTableWrapper } from '@/components/ui/data-table'
import {
  drivers,
  transportUnits,
  type Driver,
  type TransportUnit,
} from '@/lib/data'
import { wait } from '@/lib/utils'

import { driversColumns, transportUnitsColumns } from './columns'

async function getTransportUnits(): Promise<TransportUnit[]> {
  await wait(1000)
  return transportUnits
}

async function getDrivers(): Promise<Driver[]> {
  await wait(1000)
  return drivers
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
          <h2 className="text secondary pb-2 text-xl font-semibold tracking-tight">
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
          <h2 className="text secondary pb-4 text-xl font-semibold tracking-tight">
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
