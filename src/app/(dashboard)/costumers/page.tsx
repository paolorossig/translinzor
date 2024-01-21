import {
  DataTable,
  DataTableFacetedFilter,
  DataTableFilterInput,
  DataTableHeader,
  DataTableResetFilter,
  DataTableWrapper,
} from '@/components/ui/data-table'
import {
  channelOptions,
  costumers,
  statusOptions,
  type Costumer,
} from '@/lib/data'
import { wait } from '@/lib/utils'

import { columns } from './columns'

async function getCostumers(): Promise<Costumer[]> {
  await wait(1000)
  return costumers
}

export default async function CostumersPage() {
  const data = await getCostumers()

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
              <DataTableFacetedFilter
                columnName="status"
                title="Estado"
                options={statusOptions}
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
