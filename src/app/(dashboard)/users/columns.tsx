'use client'

import type { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import type { Users } from '@/lib/auth/actions'

export const columns: ColumnDef<Users[number]>[] = [
  {
    accessorKey: 'displayName',
    header: 'Nombre',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Rol',
    cell: ({ row }) => {
      const { role } = row.original
      return (
        <Badge variant={role === 'admin' ? 'default' : 'secondary'}>
          {role}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'client.name',
    header: 'Nombre de cliente',
  },
]
