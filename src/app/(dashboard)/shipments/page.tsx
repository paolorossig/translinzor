import { ShipmentBulkUpload } from '@/components/shipment-bulk-upload'
import {
  DataTable,
  DataTableDateFilter,
  DataTableHeader,
  DataTableResetFilter,
  DataTableWrapper,
} from '@/components/ui/data-table'
import { getShipmentsByClientId } from '@/lib/actions'

import { columns } from './columns'

export default async function ShipmentsPage() {
  const shipments = await getShipmentsByClientId(1)

  return (
    <>
      <h1 className="scroll-m-20 pb-2 text-2xl font-medium tracking-tight text-primary">
        Entregas
      </h1>
      <div>
        <DataTableWrapper columns={columns} data={shipments}>
          <DataTableHeader actionArea={<ShipmentBulkUpload />}>
            <DataTableDateFilter columnName="deliveryDate" />
            <DataTableResetFilter />
          </DataTableHeader>
          <DataTable />
        </DataTableWrapper>
      </div>
    </>
  )
}
