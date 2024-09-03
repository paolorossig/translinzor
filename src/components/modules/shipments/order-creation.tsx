'use client'

import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDebounce } from '@uidotdev/usehooks'
import { PlusIcon } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import Autocomplete from '@/components/autocomplete'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { createOrderAction, getCostumersAction } from '@/lib/actions'
import { createOrderSchema } from '@/lib/actions/schema'
import type { Option } from '@/types'

type CreateOrderInput = z.infer<typeof createOrderSchema>

interface OrderCreationProps {
  shipmentId: number
  costumers: Option[]
}

export function OrderCreation({ shipmentId, costumers }: OrderCreationProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState<Option[]>(costumers)

  const debouncedSearchTerm = useDebounce(searchQuery, 300)
  const defaultValues = { shipmentId }

  const form = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues,
  })

  const createOrder = useAction(createOrderAction, {
    onSuccess: () => {
      toast.success('Orden creada correctamente')
      form.reset(defaultValues)
      setOpen(false)
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? 'Error al crear la orden')
    },
  })

  const getCostumers = useAction(getCostumersAction, {
    onSuccess: ({ data }) => {
      if (data) {
        setOptions(data.map((c) => ({ value: c.id.toString(), label: c.name })))
      }
      setLoading(false)
    },
    onError: () => setLoading(false),
  })

  useEffect(() => {
    if (debouncedSearchTerm) {
      setLoading(true)
      getCostumers.execute({ search: debouncedSearchTerm, limit: 5 })
    } else {
      setOptions(costumers)
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [costumers, debouncedSearchTerm])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="h-8">
          <PlusIcon className="h-4 w-4" />
          <span className="ml-2 hidden md:block">Nuevo</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-primary">Nueva orden</SheetTitle>
          <SheetDescription>
            Esta acción creará una nueva orden de envío en la actual entrega.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(createOrder.execute)}
            className="my-6 space-y-4"
          >
            <FormField
              control={form.control}
              name="costumerId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-primary">Cliente</FormLabel>
                  <FormControl>
                    <Autocomplete
                      options={options}
                      placeholder="Selecciona un cliente"
                      isLoading={loading}
                      shouldFilter={false}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      value={field.value}
                      onValueChange={field.onChange}
                      defaultValue={
                        options.find((o) => o.value === String(field.value))
                          ?.label
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientOrderId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-primary">Número de vale</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="202014" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="orderNumber"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-primary">
                    Número de pedido
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="0090099090" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="guideNumber"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-primary">Número de guía</FormLabel>
                  <FormControl>
                    <Input placeholder="0090099090" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="destinationAddress"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-primary">Dirección</FormLabel>
                  <FormControl>
                    <Input placeholder="Av. Javier Prado 270" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="destinationDistrict"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-primary">Distrito</FormLabel>
                  <FormControl>
                    <Input placeholder="San Isidro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalValue"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-primary">Valor Total</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="100.14" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={createOrder.isExecuting}>
                Guardar
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
