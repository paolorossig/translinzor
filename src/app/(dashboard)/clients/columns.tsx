'use client'

import { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import { type Client } from '@/lib/data'

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: 'name',
    header: 'Cliente',
  },
  {
    accessorKey: 'channel',
    header: 'Canal',
  },
  {
    accessorKey: 'documentNumber',
    header: 'Documento',
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Badge variant="outline" className="uppercase">
            {row.original.documentType}
          </Badge>
          <span>{row.getValue('documentNumber')}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'isActive',
    header: 'Activo',
    cell: ({ row }) => {
      return (
        <Badge variant={row.original.isActive ? 'default' : 'destructive'}>
          {row.original.isActive ? 'Activo' : 'Inactivo'}
        </Badge>
      )
    },
  },
]
