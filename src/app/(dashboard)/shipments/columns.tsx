'use client'

import type { Column, ColumnDef } from '@tanstack/react-table'
import { ArrowUpDownIcon, CalendarIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { type Shipment } from '@/lib/data'
import { cn } from '@/lib/utils'

export const columns: ColumnDef<Shipment>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'route',
    header: ({ column }) => {
      return <HeaderWithSorting column={column}>Ruta</HeaderWithSorting>
    },
  },
  {
    accessorKey: 'date',
    header: 'Fecha',
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-1 text-card-foreground">
          <CalendarIcon className="h-4 w-4" />
          <span>{new Date(row.getValue('date')).toLocaleDateString('es')}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const date = new Date(row.getValue(id))
      const dateStr = date.toLocaleDateString('es')
      return (value as Date).toLocaleDateString('es').includes(dateStr)
    },
  },
  {
    id: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const totalOrders = row.original.orderIds.length
      const deliveredOrders = row.original.orders.filter(
        (order) => order.status === 'delivered',
      ).length
      const deliveredRate = (deliveredOrders / totalOrders) * 100

      return (
        <div className="flex items-center space-x-2">
          <Badge
            className={cn({
              'bg-red-400 hover:bg-red-400': deliveredRate >= 0,
              'bg-yellow-400 hover:bg-yellow-400': deliveredRate >= 50,
              'bg-green-400 hover:bg-green-400': deliveredRate >= 80,
            })}
          >
            {deliveredRate} %
          </Badge>
          <span className="text-card-foreground">
            {deliveredOrders}/{totalOrders}{' '}
            {totalOrders > 1 ? 'órdenes entregadas' : 'orden entregada'}
          </span>
        </div>
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
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        <ArrowUpDownIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
