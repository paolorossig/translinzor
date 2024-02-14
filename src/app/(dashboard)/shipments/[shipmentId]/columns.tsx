'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { InfoIcon } from 'lucide-react'

import { Icons } from '@/components/icons'
import {
  getOrderStatus,
  OrderStatus,
  orderStatusOptions,
} from '@/components/modules/shipments/order-status'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { type ShipmentById } from '@/lib/actions'

export const columns: ColumnDef<ShipmentById['orders'][number]>[] = [
  {
    accessorKey: 'costumer.company.name',
    header: 'Cliente',
    filterFn: (row, id, value) => {
      return (value as string).includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'orderNumber',
    header: 'Número de pedido',
  },
  {
    accessorKey: 'guideNumber',
    header: 'Número de guía',
  },
  {
    accessorKey: 'destinationAddress',
    header: 'Dirección',
  },
  {
    accessorKey: 'destinationDistrict',
    header: 'Distrito',
  },
  {
    id: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const status = orderStatusOptions.find(
        (option) => option.value === getOrderStatus(row.original),
      )
      if (!status) return null
      const Icon = status.icon ? Icons[status.icon] : null

      return (
        <div className="flex items-center">
          {Icon && <Icon className="mr-2 h-4 w-4 text-muted-foreground" />}
          <p>{status.label}</p>
          {status.value === OrderStatus.REFUSED && (
            <Popover>
              <PopoverTrigger asChild>
                <Button size="icon" variant="outline" className="ml-2">
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="space-y-2">
                <h4 className="text-sm font-medium leading-none">Razón</h4>
                <p className="text-sm text-muted-foreground">
                  {row.original.refusedReason}
                </p>
              </PopoverContent>
            </Popover>
          )}
        </div>
      )
    },
    accessorFn: (row) => getOrderStatus(row),
    filterFn: (row, id, value) => {
      return (value as string).includes(getOrderStatus(row.original))
    },
  },
]
