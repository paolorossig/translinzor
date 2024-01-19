import { Button } from '@/components/ui/button'
import {
  DataTable,
  DataTableDateFilter,
  DataTableFilterInput,
  DataTableHeader,
  DataTableResetFilter,
  DataTableWrapper,
} from '@/components/ui/data-table'
import { Shipment, shipments } from '@/lib/data'
import { wait } from '@/lib/utils'

import { columns } from './columns'

async function getShipments(): Promise<Shipment[]> {
  await wait(1000)
  return shipments
}

export default async function ShipmentsPage() {
  const data = await getShipments()

  return (
    <>
      <h1 className="scroll-m-20 pb-2 text-2xl font-medium tracking-tight text-primary">
        Entregas
      </h1>
      <div>
        <DataTableWrapper columns={columns} data={data}>
          <DataTableHeader actionArea={<Button className="h-8">Nuevo</Button>}>
            <DataTableFilterInput
              columnName="route"
              placeholder="Filtrar entregas..."
            />
            <DataTableDateFilter columnName="date" />
            <DataTableResetFilter />
          </DataTableHeader>
          <DataTable />
        </DataTableWrapper>
      </div>
    </>
  )
}
