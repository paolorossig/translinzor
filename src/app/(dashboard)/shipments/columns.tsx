/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import {
  CalendarIcon,
  EyeIcon,
  MoreHorizontalIcon,
  PackageIcon,
  TrashIcon,
} from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { ShipmentsByClient } from '@/db/queries'
import { deleteShipmentAction, startShipmentAction } from '@/lib/actions'
import { cn } from '@/lib/utils'

type ShipmentColumns = ColumnDef<ShipmentsByClient[number]>[]

const columns: ShipmentColumns = [
  {
    accessorKey: 'deliveryDate',
    header: 'Fecha de entrega',
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-1">
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
    accessorKey: 'route',
    header: 'Ruta',
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
      return <span className="truncate">{driver ? driver.name : '-'}</span>
    },
  },
  {
    id: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const { delivered, refused, total } = row.original.ordersSummary
      const finalized = delivered + refused

      const status =
        finalized === 0
          ? 'Programada'
          : finalized < total
            ? 'En tránsito'
            : 'Finalizada'

      return (
        <Badge
          variant={
            status === 'Finalizada'
              ? 'default'
              : status === 'En tránsito'
                ? 'outline'
                : 'secondary'
          }
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'ordersSummary',
    header: 'Resumen',
    cell: ({ row }) => {
      const summary = row.original.ordersSummary
      return (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center truncate">
                <PackageIcon className="mr-2 h-4 w-4" />
                {summary.total} órdenes
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Entregadas: {summary.delivered}</p>
              <p>Rechazadas: {summary.refused}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
  },
  {
    id: 'effectiveness-rate',
    header: 'Efectividad',
    cell: ({ row }) => {
      const { delivered, total } = row.original.ordersSummary
      const effectivenessRate = Math.round((delivered / total) * 100)
      return (
        <div className="flex w-24 items-center justify-between">
          <Progress
            value={effectivenessRate}
            className="w-12"
            indicatorClassName={cn({
              'bg-red-400': effectivenessRate >= 0,
              'bg-yellow-400': effectivenessRate >= 50,
              'bg-green-400': effectivenessRate >= 80,
            })}
          />
          <span className="font-medium">{effectivenessRate}%</span>
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
      const startShipment = useAction(startShipmentAction, {
        onSuccess: () => void toast.success('Envío iniciado'),
        onError: ({ error }) =>
          void toast.error(error.serverError ?? 'No se pudo iniciar el envío'),
      })
      const deleteShipment = useAction(deleteShipmentAction, {
        onSuccess: () => void toast.success('Envío eliminado'),
        onError: ({ error }) =>
          void toast.error(error.serverError ?? 'No se pudo eliminar el envío'),
      })
      const isPending = startShipment.isExecuting || deleteShipment.isExecuting
      const shipmentId = row.original.id
      const { deliveryDate, driverId, transportUnitId, startedAt } =
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
                <AlertDialogAction
                  onClick={() => deleteShipment.execute({ shipmentId })}
                >
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
                    <Button
                      onClick={() => startShipment.execute({ shipmentId })}
                      disabled={isPending}
                    >
                      Iniciar entrega
                    </Button>
                  </div>
                ) : (
                  <OrderStatusForm
                    shipmentId={shipmentId.toString()}
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
                  shipmentId={shipmentId}
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
