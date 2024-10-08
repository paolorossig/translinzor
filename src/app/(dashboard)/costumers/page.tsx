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
import { getCostumers } from '@/db/queries'
import { getUser } from '@/lib/auth/server'
import { uniqueValues } from '@/lib/utils'

import { columns } from './columns'

export default async function CostumersPage() {
  const user = await getUser()
  const data = await getCostumers({ clientId: user?.clientId })

  const channelOptions = uniqueValues(data, (c) => c.channel).flatMap((c) => {
    return c ? { label: c, value: c } : []
  })

  return (
    <>
      <h1 className="scroll-m-20 pb-2 text-2xl font-medium tracking-tight text-primary">
        Clientes
      </h1>
      <div>
        <DataTableWrapper columns={columns} data={data}>
          <DataTableHeader
            actionArea={user?.isAdmin && <CreateCostumerButton />}
          >
            <DataTableFilterInput
              columnName="name"
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
