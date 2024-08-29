'use client'

import { ChartNoAxesColumnIncreasingIcon, TrashIcon, XIcon } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'

import { Icons } from '@/components/icons'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import {
  deleteOrdersAction,
  updateMultipleOrderStatusAction,
} from '@/lib/actions'
import type { Option } from '@/types'

import { OrderStatus, orderStatusOptions } from './order-status'

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

  const updateOrdersStatus = useAction(updateMultipleOrderStatusAction, {
    onSuccess: () => {
      resetRowsSelection()
      needsToResetFilters && table.resetColumnFilters()
    },
  })

  const handleUpdateOrders = (value: Option<OrderStatus>) =>
    toast.promise(
      updateOrdersStatus.executeAsync({ orderIds, status: value.value as any }),
      {
        loading: 'Actualizando órdenes...',
        success: 'Órdenes actualizadas correctamente',
        error: 'No se pudo actualizar las órdenes',
      },
    )

  const deleteOrders = useAction(deleteOrdersAction, {
    onSuccess: () => {
      resetRowsSelection()
      needsToResetFilters && table.resetColumnFilters()
    },
  })

  const handleDeleteOrders = () =>
    toast.promise(deleteOrders.executeAsync({ orderIds }), {
      loading: 'Eliminando órdenes...',
      success: 'Órdenes eliminadas correctamente',
      error: 'No se pudo eliminar las órdenes',
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="secondary" className="h-8">
            <ChartNoAxesColumnIncreasingIcon className="mr-1 h-4 w-4" />
            Cambiar estado
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            {orderStatusOptions.map((status) => {
              if (status.value !== OrderStatus.DELIVERED) return null
              const Icon = status.icon && Icons[status.icon]
              return (
                <DropdownMenuItem
                  key={status.value}
                  onClick={() => handleUpdateOrders(status)}
                >
                  {Icon && <Icon className="mr-2 h-4 w-4" />}
                  {status.label}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
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
            <AlertDialogAction onClick={handleDeleteOrders}>
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
