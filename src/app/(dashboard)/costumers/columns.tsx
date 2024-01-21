'use client'

import type { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import { HeaderWithSorting } from '@/components/ui/data-table'
import { statusOptions, type Costumer } from '@/lib/data'

export const columns: ColumnDef<Costumer>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return <HeaderWithSorting column={column}>Cliente</HeaderWithSorting>
    },
  },
  {
    accessorKey: 'channel',
    header: ({ column }) => {
      return <HeaderWithSorting column={column}>Canal</HeaderWithSorting>
    },
    filterFn: (row, id, value) => {
      return (value as string).includes(row.getValue(id))
    },
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
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const status = statusOptions.find(
        (status) => status.value === row.getValue('status'),
      )

      return (
        <Badge variant={status?.value === 'active' ? 'default' : 'destructive'}>
          {status?.label}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return (value as string).includes(row.getValue(id))
    },
  },
]
