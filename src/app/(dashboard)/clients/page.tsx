import {
  DataTable,
  DataTableFilterInput,
  DataTableHeader,
  DataTableWrapper,
} from '@/components/ui/data-table'
import { clients, type Client } from '@/lib/data'
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
      <div className="container mx-auto py-10">
        <DataTableWrapper columns={columns} data={data}>
          <DataTableHeader>
            <DataTableFilterInput
              columnName="name"
              placeholder="Filtrar clientes..."
            />
          </DataTableHeader>
          <DataTable />
        </DataTableWrapper>
      </div>
    </>
  )
}
