'use client'

import { TrashIcon, XIcon } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  DataTable,
  DataTableFacetedFilter,
  DataTableFilterInput,
  DataTableHeader,
  DataTablePagination,
  DataTableResetFilter,
  SelectionHeader,
} from '@/components/ui/data-table'
import { Separator } from '@/components/ui/separator'
import { deleteOrdersAction } from '@/lib/actions'
import type { Option } from '@/types'

import { orderStatusOptions } from './order-status'

interface OrdersTableProps {
  costumers: Option[]
}

export function OrdersTable({ costumers }: OrdersTableProps) {
  return (
    <>
      <DataTableHeader>
        <DataTableFilterInput
          columnName="orderNumber"
          placeholder="Filtrar órdenes..."
        />
        <div className="flex w-full space-x-2 sm:w-fit">
          <DataTableFacetedFilter
            columnName="costumer_name"
            title="Cliente"
            options={costumers}
          />
          <DataTableFacetedFilter
            columnName="status"
            title="Estado"
            options={orderStatusOptions}
          />
          <DataTableResetFilter />
        </div>
      </DataTableHeader>
      <DataTable
        selectionHeader={(params) => <OrdersTableSelectionHeader {...params} />}
      />
      <DataTablePagination />
    </>
  )
}

function OrdersTableSelectionHeader({
  table,
  selectedRows,
  totalSelectedRows,
}: SelectionHeader) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  const orderIds = selectedRows.map((row) => Number(row.id))
  const needsToResetFilters =
    table.getState().columnFilters.length > 0 &&
    table.getIsAllPageRowsSelected()
  const resetRowsSelection = () => table.toggleAllPageRowsSelected(false)

  const deleteOrders = useAction(deleteOrdersAction, {
    onSuccess: () => {
      toast.success('Órdenes eliminadas correctamente')
      resetRowsSelection()
      needsToResetFilters && table.resetColumnFilters()
    },
    onError: ({ error }) =>
      void toast.error(error.serverError ?? 'No se pudo eliminar las órdenes'),
  })

  return (
    <div className="flex h-full items-center justify-center gap-4">
      <Button
        size="sm"
        variant="outline"
        className="h-8 border-dashed"
        onClick={resetRowsSelection}
      >
        {`${totalSelectedRows} seleccionado${totalSelectedRows > 1 ? 's' : ''}`}
        <XIcon className="ml-1 h-4 w-4" />
      </Button>
      <Separator orientation="vertical" className="h-8" />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="destructive" className="h-8">
            <TrashIcon className="mr-1 h-4 w-4" />
            Eliminar
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteOrders.execute({ orderIds })}
            >
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
