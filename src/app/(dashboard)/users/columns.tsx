'use client'

import type { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import type { User } from '@/lib/auth/server'

export const columns: ColumnDef<User>[] = [
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
    cell: ({ row }) => (
      <Badge variant={row.original.role === 'admin' ? 'default' : 'secondary'}>
        {row.original.role}
      </Badge>
    ),
  },
  {
    accessorKey: 'client.name',
    header: 'Nombre de cliente',
  },
]
