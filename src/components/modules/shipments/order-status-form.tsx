'use client'

import { useEffect, useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  getOrderStatusOptionsAction,
  updateOrderStatusAction,
} from '@/lib/actions'
import { updateOrderStatusSchema } from '@/lib/actions/schema'
import { catchError } from '@/lib/utils'
import type { Option } from '@/types'

import { OrderStatus } from './order-status'

type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>

interface OrderStatusFormProps {
  shipmentId: string
  closeSheet: () => void
}

export function OrderStatusForm({
  shipmentId,
  closeSheet,
}: OrderStatusFormProps) {
  const [isPending, startTransition] = useTransition()
  const [options, setOptions] = useState<Option[] | null>(null)
  const updateOrderStatus = useAction(updateOrderStatusAction, {
    onSuccess: () => {
      toast.success('Orden actualizada exitosamente.')
      form.reset(defaultValues)
      closeSheet()
    },
    onError: ({ error }) => void toast.error(error.serverError),
  })

  const defaultValues = {
    orderId: undefined,
    refusedReason: '',
  }

  const form = useForm<UpdateOrderStatusInput>({
    resolver: zodResolver(updateOrderStatusSchema),
    defaultValues,
  })

  useEffect(() => {
    startTransition(async () => {
      try {
        const response = await getOrderStatusOptionsAction({
          shipmentId: Number(shipmentId),
        })
        if (response?.data) setOptions(response.data)
      } catch (err) {
        catchError(err)
      }
    })

    return () => setOptions(null)
  }, [shipmentId])

  const isOrderSelected = Boolean(form.watch('orderId'))
  const isRefusedStatusSelected = Boolean(
    form.watch('status') === OrderStatus.REFUSED,
  )

  useEffect(() => {
    if (form.getValues('refusedReason') && !isRefusedStatusSelected) {
      form.setValue('refusedReason', '')
    }
  }, [form, isRefusedStatusSelected])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(updateOrderStatus.execute)}
        className="my-6 space-y-4"
      >
        <FormField
          control={form.control}
          name="orderId"
          render={({ field }) => (
            <FormItem className="flex flex-col text-secondary-foreground">
              <FormLabel>Número de orden</FormLabel>
              <FormControl>
                <Autocomplete
                  options={options ?? []}
                  isLoading={isPending}
                  placeholder="Selecciona la orden..."
                  value={field.value?.toString()}
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isOrderSelected && (
          <>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="space-y-3 text-secondary-foreground">
                  <FormLabel>Elige un estado:</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={OrderStatus.DELIVERED} />
                        </FormControl>
                        <FormLabel className="font-normal">Entregado</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={OrderStatus.REFUSED} />
                        </FormControl>
                        <FormLabel className="font-normal">Rechazado</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            {isRefusedStatusSelected && (
              <FormField
                control={form.control}
                name="refusedReason"
                render={({ field }) => (
                  <FormItem className="mt-0 pl-7 text-secondary-foreground">
                    <FormControl>
                      <Input
                        placeholder="Escribe la razón del rechazo..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isPending || updateOrderStatus.isExecuting}
              >
                Guardar
              </Button>
            </div>
          </>
        )}
      </form>
    </Form>
  )
}
