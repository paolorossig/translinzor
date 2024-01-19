'use client'

import type { Column, ColumnDef } from '@tanstack/react-table'
import { ArrowUpDownIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { statusOptions, type Client } from '@/lib/data'

export const columns: ColumnDef<Client>[] = [
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

function HeaderWithSorting<TData, TValue>({
  column,
  children,
}: {
  column: Column<TData, TValue>
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center space-x-2">
      <span>{children}</span>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        <ArrowUpDownIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
