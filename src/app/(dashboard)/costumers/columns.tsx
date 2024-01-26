'use client'

import type { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import { HeaderWithSorting } from '@/components/ui/data-table'
import { CostumersByClient } from '@/lib/actions'

export const columns: ColumnDef<CostumersByClient[number]>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return <HeaderWithSorting column={column}>Cliente</HeaderWithSorting>
    },
  },
  {
    accessorKey: 'internalCode',
    header: ({ column }) => {
      return <HeaderWithSorting column={column}>Código</HeaderWithSorting>
    },
    filterFn: (row, id, value) => {
      return (value as string).includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'ruc',
    header: 'Documento',
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Badge variant="outline" className="uppercase">
            RUC
          </Badge>
          <span>{row.getValue('ruc')}</span>
        </div>
      )
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
]
