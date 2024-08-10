'use client'

import type { ColumnDef } from '@tanstack/react-table'

import { HeaderWithSorting } from '@/components/ui/data-table'
import { CostumersByClient } from '@/lib/actions'

export const columns: ColumnDef<CostumersByClient[number]>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <HeaderWithSorting column={column}>Cliente</HeaderWithSorting>
    ),
  },
  {
    accessorKey: 'internalCode',
    header: ({ column }) => (
      <HeaderWithSorting column={column}>Código</HeaderWithSorting>
    ),
    filterFn: (row, id, value) => {
      return (value as string).includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'channel',
    header: ({ column }) => (
      <HeaderWithSorting column={column}>Canal</HeaderWithSorting>
    ),
    filterFn: (row, id, value) => {
      return (value as string).includes(row.getValue(id))
    },
  },
]
