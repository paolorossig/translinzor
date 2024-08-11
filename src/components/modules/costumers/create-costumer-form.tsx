'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useAction } from 'next-safe-action/hooks'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

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
import { clientIds } from '@/config/clients'
import { createCostumerAction } from '@/lib/actions'
import { createCostumerSchema } from '@/lib/actions/schema'

type CreateCostumerInput = z.infer<typeof createCostumerSchema>

export function CreateCostumerForm() {
  const createCostumer = useAction(createCostumerAction, {
    onSuccess: () => void toast.success('Cliente creado exitosamente'),
    onError: ({ error }) => void toast.error(error.serverError),
  })

  const form = useForm<CreateCostumerInput>({
    resolver: zodResolver(createCostumerSchema),
    defaultValues: {
      clientId: clientIds.laSirena,
    },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(createCostumer.execute)}
        className="my-4 flex flex-col gap-y-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre*</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Ej. Empresa SAC"
                  disabled={createCostumer.isExecuting}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="internal_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código interno*</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Ej. 0123456"
                  disabled={createCostumer.isExecuting}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="channel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Canal</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Ej. VCORP"
                  disabled={createCostumer.isExecuting}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={createCostumer.isExecuting} className="mt-4 self-end">
          Crear
        </Button>
      </form>
    </Form>
  )
}
