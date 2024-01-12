'use client'

import type { Column, ColumnDef } from '@tanstack/react-table'
import { ArrowUpDownIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { type Client } from '@/lib/data'

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
        className="hover:bg-secondary hover:text-secondary-foreground"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        <ArrowUpDownIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
