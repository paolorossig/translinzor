'use client'

import { useEffect, useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  BadgeMinusIcon,
  CheckIcon,
  ChevronsUpDownIcon,
  Loader2Icon,
} from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import {
  assignShipmentAction,
  getAvailableAssignmentOptions,
  type AssignmentInfo,
} from '@/lib/actions'
import { assignShipmentSchema } from '@/lib/actions/schema'
import { catchError, cn } from '@/lib/utils'

type AssignShipmentInput = z.infer<typeof assignShipmentSchema>

function OptionsSkeleton() {
  return (
    <div className="space-y-1 overflow-hidden px-1 py-2">
      <Skeleton className="h-8 rounded-sm" />
      <Skeleton className="h-8 rounded-sm" />
      <Skeleton className="h-8 rounded-sm" />
    </div>
  )
}

interface AssignmentFormProps {
  deliveryDate: Date
  shipmentId: number
  driverId?: string
  transportUnitId?: string
  closeSheet: () => void
}

export function AssignmentForm({
  deliveryDate,
  closeSheet,
  ...defaultValues
}: AssignmentFormProps) {
  const [isPending, startTransition] = useTransition()
  const [data, setData] = useState<AssignmentInfo | null>(null)

  const form = useForm<AssignShipmentInput>({
    resolver: zodResolver(assignShipmentSchema),
    defaultValues,
  })

  useEffect(() => {
    startTransition(async () => {
      try {
        const data = await getAvailableAssignmentOptions(deliveryDate)
        setData(data)
      } catch (err) {
        catchError(err)
      }
    })

    return () => setData(null)
  }, [deliveryDate])

  const assignShipment = useAction(assignShipmentAction, {
    onSuccess: () => {
      toast.success('Asignación realizada exitosamente.')
      form.reset(defaultValues)
      closeSheet()
    },
    onError: ({ error }) => void toast.error(error.serverError),
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(assignShipment.execute)}
        className="my-6 space-y-4"
      >
        <FormField
          control={form.control}
          name="transportUnitId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-primary">
                Unidad de transporte
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'justify-between',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value
                        ? data?.transportUnits.find(
                            (unit) => unit.value === field.value,
                          )?.label
                        : 'Selecciona la unidad...'}
                      {isPending ? (
                        <Loader2Icon className="ml-2 h-4 w-4 shrink-0 animate-spin opacity-50" />
                      ) : (
                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput
                      placeholder="Busca la unidad..."
                      disabled={isPending}
                    />
                    {!isPending && (
                      <CommandEmpty>
                        No se han encontrado resultados.
                      </CommandEmpty>
                    )}
                    <CommandGroup>
                      {isPending ? (
                        <OptionsSkeleton />
                      ) : (
                        data?.transportUnits.map((unit) => (
                          <CommandItem
                            key={unit.value}
                            value={unit.label}
                            disabled={unit.disabled}
                            onSelect={() => {
                              form.setValue('transportUnitId', unit.value)
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                'mr-2 h-4 w-4 shrink-0',
                                unit.value === field.value
                                  ? 'opacity-100'
                                  : 'opacity-0',
                              )}
                            />
                            <span className="overflow-x-clip whitespace-nowrap">
                              {unit.label}
                            </span>
                            <BadgeMinusIcon
                              className={cn(
                                'ml-2 h-4 w-4 text-destructive/50',
                                unit.disabled && unit.value !== field.value
                                  ? 'opacity-100'
                                  : 'opacity-0',
                              )}
                            />
                          </CommandItem>
                        ))
                      )}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="driverId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-primary">Conductor</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'justify-between',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value
                        ? data?.drivers.find(
                            (driver) => driver.value === field.value,
                          )?.label
                        : 'Selecciona el conductor...'}
                      {isPending ? (
                        <Loader2Icon className="ml-2 h-4 w-4 shrink-0 animate-spin opacity-50" />
                      ) : (
                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput
                      placeholder="Busca el conductor..."
                      disabled={isPending}
                    />
                    {!isPending && (
                      <CommandEmpty>
                        No se han encontrado resultados.
                      </CommandEmpty>
                    )}
                    <CommandGroup>
                      {isPending ? (
                        <OptionsSkeleton />
                      ) : (
                        data?.drivers.map((driver) => (
                          <CommandItem
                            key={driver.value}
                            value={driver.label}
                            disabled={driver.disabled}
                            onSelect={() => {
                              form.setValue('driverId', driver.value)
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                'mr-2 h-4 w-4 shrink-0',
                                driver.value === field.value
                                  ? 'opacity-100'
                                  : 'opacity-0',
                              )}
                            />
                            <span className="overflow-x-clip whitespace-nowrap">
                              {driver.label}
                            </span>
                            <BadgeMinusIcon
                              className={cn(
                                'ml-2 h-4 w-4 text-destructive/50',
                                driver.disabled && driver.value !== field.value
                                  ? 'opacity-100'
                                  : 'opacity-0',
                              )}
                            />
                          </CommandItem>
                        ))
                      )}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            Guardar
          </Button>
        </div>
      </form>
    </Form>
  )
}
