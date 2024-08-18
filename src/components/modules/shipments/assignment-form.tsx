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
import { assignShipmentAction, getAvailabilityAction } from '@/lib/actions'
import { assignShipmentSchema } from '@/lib/actions/schema'
import { Option } from '@/types'

type AssignShipmentInput = z.infer<typeof assignShipmentSchema>

interface AssignmentFormProps {
  deliveryDate: Date
  shipmentId: number
  driverId?: string
  transportUnitId?: string
  closeSheet: () => void
}

interface Availability {
  drivers: Option[]
  transportUnits: Option[]
}

export function AssignmentForm({
  deliveryDate,
  closeSheet,
  ...defaultValues
}: AssignmentFormProps) {
  const [isPending, startTransition] = useTransition()
  const [data, setData] = useState<Availability | null>(null)

  const form = useForm<AssignShipmentInput>({
    resolver: zodResolver(assignShipmentSchema),
    defaultValues,
  })

  useEffect(() => {
    startTransition(async () => {
      const response = await getAvailabilityAction(deliveryDate)
      if (response?.data) setData(response.data)
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
              <FormControl>
                <Autocomplete
                  options={data?.transportUnits ?? []}
                  isLoading={isPending}
                  placeholder="Selecciona la unidad..."
                  value={field.value}
                  onValueChange={field.onChange}
                />
              </FormControl>
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
              <FormControl>
                <Autocomplete
                  options={data?.drivers ?? []}
                  isLoading={isPending}
                  placeholder="Selecciona la conductor..."
                  value={field.value}
                  onValueChange={field.onChange}
                />
              </FormControl>
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
