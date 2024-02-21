/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import {
  CalendarIcon,
  EyeIcon,
  MoreHorizontalIcon,
  TrashIcon,
} from 'lucide-react'
import { toast } from 'sonner'

import { AssignmentForm } from '@/components/modules/shipments'
import { OrderStatusForm } from '@/components/modules/shipments/order-status-form'
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  deleteShipment,
  startShipment,
  type ShipmentsByClient,
} from '@/lib/actions'
import { catchError, cn, handleServerActionResponse } from '@/lib/utils'

type ShipmentColumns = ColumnDef<ShipmentsByClient[number]>[]

const columns: ShipmentColumns = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleccionar todo"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Seleccionar fila"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'deliveryDate',
    header: 'Fecha de entrega',
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-1 text-card-foreground">
          <CalendarIcon className="h-4 w-4" />
          <span>
            {new Date(row.getValue('deliveryDate')).toLocaleDateString('es')}
          </span>
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
    accessorKey: 'transportUnit',
    header: 'Unidad de transporte',
    cell: ({ row }) => {
      const transportUnit = row.original.transportUnit
      return <span>{transportUnit ? transportUnit.licensePlate : '-'}</span>
    },
  },
  {
    accessorKey: 'driver',
    header: 'Conductor',
    cell: ({ row }) => {
      const driver = row.original.driver
      return <span>{driver ? driver.name : '-'}</span>
    },
  },
  {
    id: 'summary',
    header: 'Resumen',
    cell: ({ row }) => {
      const { delivered, refused, total } = row.original.ordersSummary
      const finalized = delivered + refused
      const finalizedRate = Math.round((finalized / total) * 100)

      return (
        <div className="flex items-center space-x-2">
          <Badge
            className={cn('text-nowrap', {
              'bg-red-400 hover:bg-red-400': finalizedRate >= 0,
              'bg-yellow-400 hover:bg-yellow-400': finalizedRate >= 50,
              'bg-green-400 hover:bg-green-400': finalizedRate >= 80,
            })}
          >
            {finalizedRate} %
          </Badge>
          <span className="text-nowrap text-card-foreground">
            {finalized}/{total}{' '}
            {total > 1 ? 'órdenes finalizadas' : 'orden finzalizada'}
          </span>
        </div>
      )
    },
  },
]

enum AdminDialog {
  EDIT = 'edit',
  ASSIGNMENT = 'assignment',
}

export const adminColumns: ShipmentColumns = [
  ...columns,
  {
    id: 'admin-actions',
    cell: ({ row }) => {
      const [open, setOpen] = useState(false)
      const [dialog, setDialog] = useState<AdminDialog>()
      const [isPending, startTransition] = useTransition()

      const { id, deliveryDate, driverId, transportUnitId, startedAt } =
        row.original

      const closeSheet = () => setOpen(false)
      const openEditDialog = () => {
        setDialog(AdminDialog.EDIT)
        setOpen(true)
      }
      const openAssignmentDialog = () => {
        setDialog(AdminDialog.ASSIGNMENT)
        setOpen(true)
      }
      const onStartClick = () => {
        startTransition(async () => {
          const response = await startShipment(id)
          if (response.success) {
            toast.success('Envío iniciado')
          } else {
            toast.error(response.message)
          }
        })
      }
      const onDeleteClick = () => {
        startTransition(() => {
          toast.promise(deleteShipment(id).then(handleServerActionResponse), {
            loading: 'Eliminando...',
            success: 'Envío eliminado',
            error: (err: unknown) =>
              catchError(err, 'No se pudo eliminar el envío'),
          })
        })
      }

      return (
        <Sheet open={open} onOpenChange={setOpen}>
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  disabled={isPending}
                  variant="ghost"
                  className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                >
                  <MoreHorizontalIcon className="h-4 w-4" />
                  <span className="sr-only">Abrir el menú</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem asChild>
                  <Link href={`/shipments/${row.original.id}`}>Ver</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={openEditDialog}>
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={openAssignmentDialog}>
                  Asignar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="text-destructive focus:bg-destructive/20 focus:text-destructive">
                    Eliminar
                    <DropdownMenuShortcut>
                      <TrashIcon className="h-4 w-4" />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  ¿Estás absolutamente seguro?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Esto eliminará el envío y
                  sus respectivas órdenes permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={onDeleteClick}>
                  Continuar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <SheetContent>
            {dialog === AdminDialog.EDIT ? (
              <>
                <SheetHeader>
                  <SheetTitle className="text-primary">
                    Editar órdenes
                  </SheetTitle>
                  <SheetDescription>
                    Actualiza el estatus de las órdenes, podrás marcarlas como
                    entregadas o rechazadas, así como adjuntar una constancia.
                  </SheetDescription>
                </SheetHeader>
                {!startedAt ? (
                  <div className="my-6 flex justify-end">
                    <Button onClick={onStartClick} disabled={isPending}>
                      Iniciar entrega
                    </Button>
                  </div>
                ) : (
                  <OrderStatusForm
                    shipmentId={id.toString()}
                    closeSheet={closeSheet}
                  />
                )}
              </>
            ) : dialog === AdminDialog.ASSIGNMENT ? (
              <>
                <SheetHeader>
                  <SheetTitle className="text-primary">Asignación</SheetTitle>
                  <SheetDescription>
                    Realiza la asignación de conductor y unidad de transporte
                    para la entrega seleccionada.
                  </SheetDescription>
                </SheetHeader>
                <AssignmentForm
                  shipmentId={id.toString()}
                  deliveryDate={deliveryDate}
                  driverId={driverId?.toString()}
                  transportUnitId={transportUnitId?.toString()}
                  closeSheet={closeSheet}
                />
              </>
            ) : null}
          </SheetContent>
        </Sheet>
      )
    },
  },
]

export const clientColumns: ShipmentColumns = [
  ...columns,
  {
    id: 'client-actions',
    cell: ({ row }) => {
      return (
        <Button asChild variant="ghost" className="flex h-8 w-8 p-0">
          <Link href={`/shipments/${row.original.id}`}>
            <EyeIcon className="h-4 w-4" />
          </Link>
        </Button>
      )
    },
  },
]
