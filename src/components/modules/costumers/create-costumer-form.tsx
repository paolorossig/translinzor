'use client'

import { useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

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
import { createLaSirenaCostumer } from '@/lib/actions'
import {
  createCostumerSchema,
  type CreateCostumerInput,
} from '@/lib/validations/costumers'

export function CreateCostumerForm() {
  const [isPending, startTransition] = useTransition()

  const form = useForm<CreateCostumerInput>({
    resolver: zodResolver(createCostumerSchema),
  })

  const createCostumer = (input: CreateCostumerInput) => {
    startTransition(async () => {
      const response = await createLaSirenaCostumer(input)
      if (response.success) {
        toast.success('Cliente creado exitosamente')
      } else {
        toast.error(response.message)
      }
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(createCostumer)}
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
                  disabled={isPending}
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
                  disabled={isPending}
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
                  disabled={isPending}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending} className="mt-4 self-end">
          Crear
        </Button>
      </form>
    </Form>
  )
}
