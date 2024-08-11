import { ShipmentBulkUpload } from '@/components/modules/shipments'
import {
  DataTable,
  DataTableDateFilter,
  DataTableHeader,
  DataTablePagination,
  DataTableResetFilter,
  DataTableWrapper,
} from '@/components/ui/data-table'
import { getShipmentsByClientId } from '@/db/queries'
import { auth } from '@/lib/auth/server'

import { adminColumns, clientColumns } from './columns'

export default async function ShipmentsPage() {
  const { isAdmin, user } = await auth()
  const shipments = await getShipmentsByClientId(user.clientId)

  const columns = isAdmin ? adminColumns : clientColumns

  return (
    <>
      <h1 className="scroll-m-20 pb-2 text-2xl font-medium tracking-tight text-primary">
        Entregas
      </h1>
      <div>
        <DataTableWrapper columns={columns} data={shipments}>
          <DataTableHeader actionArea={isAdmin && <ShipmentBulkUpload />}>
            <DataTableDateFilter columnName="deliveryDate" />
            <DataTableResetFilter />
          </DataTableHeader>
          <DataTable />
          <DataTablePagination />
        </DataTableWrapper>
      </div>
    </>
  )
}
