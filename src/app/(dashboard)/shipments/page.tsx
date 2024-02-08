import { ShipmentBulkUpload } from '@/components/modules/shipments'
import {
  DataTable,
  DataTableDateFilter,
  DataTableHeader,
  DataTableResetFilter,
  DataTableWrapper,
} from '@/components/ui/data-table'
import { getShipmentsByClientId } from '@/lib/actions'
import { useAuth } from '@/lib/auth'

import { adminColumns, clientColumns } from './columns'

export default async function ShipmentsPage() {
  const { isAdmin, profile } = await useAuth()
  const shipments = await getShipmentsByClientId(profile.clientId)

  const columns = isAdmin ? adminColumns : clientColumns

  return (
    <>
      <h1 className="scroll-m-20 pb-2 text-2xl font-medium tracking-tight text-primary">
        Entregas
      </h1>
      <div>
        <DataTableWrapper columns={columns} data={shipments}>
          <DataTableHeader
            actionArea={<ShipmentBulkUpload disabled={!isAdmin} />}
          >
            <DataTableDateFilter columnName="deliveryDate" />
            <DataTableResetFilter />
          </DataTableHeader>
          <DataTable />
        </DataTableWrapper>
      </div>
    </>
  )
}
