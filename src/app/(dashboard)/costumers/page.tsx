import { CreateCostumerButton } from '@/components/modules/costumers/new-costumer'
import {
  DataTable,
  DataTableFacetedFilter,
  DataTableFilterInput,
  DataTableHeader,
  DataTablePagination,
  DataTableResetFilter,
  DataTableWrapper,
} from '@/components/ui/data-table'
import { getCostumers } from '@/lib/actions'
import { useAuth } from '@/lib/auth'
import { channelOptions } from '@/lib/constants'

import { columns } from './columns'

export default async function CostumersPage() {
  const { user, isAdmin } = await useAuth()
  const data = await getCostumers({ clientId: user.clientId })

  return (
    <>
      <h1 className="scroll-m-20 pb-2 text-2xl font-medium tracking-tight text-primary">
        Clientes
      </h1>
      <div>
        <DataTableWrapper columns={columns} data={data}>
          <DataTableHeader actionArea={isAdmin && <CreateCostumerButton />}>
            <DataTableFilterInput
              columnName="company_name"
              placeholder="Filtrar clientes..."
            />
            <div className="flex w-full space-x-2 sm:w-fit">
              <DataTableFacetedFilter
                columnName="channel"
                title="Canal"
                options={channelOptions}
              />
              <DataTableResetFilter />
            </div>
          </DataTableHeader>
          <DataTable />
          <DataTablePagination />
        </DataTableWrapper>
      </div>
    </>
  )
}
