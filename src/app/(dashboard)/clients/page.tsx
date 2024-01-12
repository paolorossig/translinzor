import {
  DataTable,
  DataTableFacetedFilter,
  DataTableFilterInput,
  DataTableHeader,
  DataTableWrapper,
} from '@/components/ui/data-table'
import { channelOptions, clients, type Client } from '@/lib/data'
import { wait } from '@/lib/utils'

import { columns } from './columns'

async function getClients(): Promise<Client[]> {
  await wait(1000)
  return clients
}

export default async function ClientsPage() {
  const data = await getClients()

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
            <DataTableFacetedFilter
              columnName="channel"
              title="Canal"
              options={channelOptions}
            />
          </DataTableHeader>
          <DataTable />
        </DataTableWrapper>
      </div>
    </>
  )
}
