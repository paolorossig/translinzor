import {
  DataTable,
  DataTableFacetedFilter,
  DataTableFilterInput,
  DataTableHeader,
  DataTableResetFilter,
  DataTableWrapper,
} from '@/components/ui/data-table'
import { getCostumersByClientId } from '@/lib/actions'
import { useAuth } from '@/lib/auth'
import { channelOptions } from '@/lib/data'

import { columns } from './columns'

export default async function CostumersPage() {
  const { profile } = await useAuth()
  const data = await getCostumersByClientId(profile.clientId!)

  return (
    <>
      <h1 className="scroll-m-20 pb-2 text-2xl font-medium tracking-tight text-primary">
        Clientes
      </h1>
      <div>
        <DataTableWrapper columns={columns} data={data}>
          <DataTableHeader>
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
        </DataTableWrapper>
      </div>
    </>
  )
}
