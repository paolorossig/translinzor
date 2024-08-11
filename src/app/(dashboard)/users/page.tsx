import { DataTable, DataTableWrapper } from '@/components/ui/data-table'
import { getAllUsers } from '@/lib/auth/server'

import { columns } from './columns'

export default async function UsersPage() {
  const users = await getAllUsers()
  return (
    <>
      <h1 className="scroll-m-20 pb-2 text-2xl font-medium tracking-tight text-primary">
        Usuarios
      </h1>
      <div>
        <DataTableWrapper columns={columns} data={users}>
          <DataTable />
        </DataTableWrapper>
      </div>
    </>
  )
}
