'use client'

import { useEffect, useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckIcon, ChevronsUpDownIcon, Loader2Icon } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { Icons } from '@/components/icons'
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
  getOrderStatusOptionsByShipmentId,
  type OrderStatusOptions,
} from '@/lib/actions'
import { catchError, cn } from '@/lib/utils'
import {
  updateOrderStatusSchema,
  type UpdateOrderStatusInput,
} from '@/lib/validations/shipments'

function OptionsSkeleton() {
  return (
    <div className="space-y-1 overflow-hidden px-1 py-2">
      <Skeleton className="h-8 rounded-sm" />
      <Skeleton className="h-8 rounded-sm" />
      <Skeleton className="h-8 rounded-sm" />
    </div>
  )
}

interface OrderStatusFormProps {
  shipmentId: string
}

export function OrderStatusForm({ shipmentId }: OrderStatusFormProps) {
  const [isPending, startTransition] = useTransition()
  const [options, setOptions] = useState<OrderStatusOptions | null>(null)

  const form = useForm<UpdateOrderStatusInput>({
    resolver: zodResolver(updateOrderStatusSchema),
    defaultValues: {
      shipmentId,
      orderId: undefined,
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getOrderStatusOptionsByShipmentId(Number(shipmentId))
        setOptions(data)
      } catch (err) {
        catchError(err)
      }
    }

    startTransition(fetchData)

    return () => setOptions(null)
  }, [shipmentId])

  const onSubmit = (data: UpdateOrderStatusInput) => {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="my-6 space-y-4">
        <FormField
          control={form.control}
          name="orderId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-primary">Número de orden</FormLabel>
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
                        ? options?.find(
                            (option) => option.value === field.value,
                          )?.label
                        : 'Selecciona la orden...'}
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
                      placeholder="Busca la orden..."
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
                        options?.map((order) => {
                          const Icon = order.icon ? Icons[order.icon] : null

                          return (
                            <CommandItem
                              key={order.value}
                              value={order.label}
                              disabled={order.disabled}
                              onSelect={() => {
                                form.setValue('orderId', order.value)
                              }}
                            >
                              <CheckIcon
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  order.value === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                              {Icon && <Icon className="mr-2 h-4 w-4" />}
                              <span className="overflow-x-clip whitespace-nowrap">
                                {order.label}
                              </span>
                            </CommandItem>
                          )
                        })
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
