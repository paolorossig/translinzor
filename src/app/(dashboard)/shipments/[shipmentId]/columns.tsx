'use client'

import { ColumnDef } from '@tanstack/react-table'

import { ShipmentById } from '@/lib/actions'

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
]
