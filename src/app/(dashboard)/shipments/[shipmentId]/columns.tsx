'use client'

import { type ColumnDef } from '@tanstack/react-table'

import {
  getOrderStatus,
  orderStatusOptions,
} from '@/components/modules/shipments/order-status'
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

      return (
        <div className="flex items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      )
    },
  },
]
