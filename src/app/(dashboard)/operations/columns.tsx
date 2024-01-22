'use client'

import type { ColumnDef } from '@tanstack/react-table'

import { HeaderWithSorting } from '@/components/ui/data-table'
import { type Driver, type TransportUnit } from '@/lib/data'

export const transportUnitsColumns: ColumnDef<TransportUnit>[] = [
  {
    accessorKey: 'licensePlate',
    header: ({ column }) => {
      return <HeaderWithSorting column={column}>Placa</HeaderWithSorting>
    },
    filterFn: (row, id, value) => {
      return (value as string).includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'type',
    header: ({ column }) => {
      return (
        <HeaderWithSorting column={column}>Tipo de vehículo</HeaderWithSorting>
      )
    },
    filterFn: (row, id, value) => {
      return (value as string).includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'brand',
    header: ({ column }) => {
      return <HeaderWithSorting column={column}>Marca</HeaderWithSorting>
    },
    filterFn: (row, id, value) => {
      return (value as string).includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'model',
    header: ({ column }) => {
      return <HeaderWithSorting column={column}>Modelo</HeaderWithSorting>
    },
    filterFn: (row, id, value) => {
      return (value as string).includes(row.getValue(id))
    },
  },
]

export const driversColumns: ColumnDef<Driver>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return <HeaderWithSorting column={column}>Nombres</HeaderWithSorting>
    },
    filterFn: (row, id, value) => {
      return (value as string).includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'lastName',
    header: ({ column }) => {
      return <HeaderWithSorting column={column}>Apellidos</HeaderWithSorting>
    },
    filterFn: (row, id, value) => {
      return (value as string).includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'dni',
    header: 'DNI',
  },
  {
    accessorKey: 'licenseNumber',
    header: 'Licencia',
  },
]
