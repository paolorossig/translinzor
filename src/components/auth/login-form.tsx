'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { AuthError } from '@supabase/supabase-js'
import { Loader2Icon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

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
import { Label } from '@/components/ui/label'

const supabaseKnownErrors: Record<string, string> = {
  'Invalid login credentials': 'Credenciales de acceso inválidos',
}
const defaultErrorMessage = 'Ocurrió un error inesperado'

const getUserErrorMessage = (error: AuthError) => {
  const message = error.message
  return supabaseKnownErrors[message] ?? defaultErrorMessage
}

export const authSignInSchema = z.object({
  email: z
    .string({ required_error: 'Requerido' })
    .email({ message: 'Email inválido' }),
  password: z.string({ required_error: 'Requerido' }),
})

type AuthSignInInput = z.infer<typeof authSignInSchema>

export function LoginForm() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isPending, startTransition] = useTransition()

  const form = useForm<AuthSignInInput>({
    resolver: zodResolver(authSignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const userSignIn = (input: AuthSignInInput) => {
    startTransition(async () => {
      const { data, error } = await supabase.auth.signInWithPassword(input)

      if (error) {
        form.setError('password', { message: getUserErrorMessage(error) })
        return
      }

      if (data.session) router.push('/')
    })
  }

  return (
    <Form {...form}>
      <form className="grid gap-2" onSubmit={form.handleSubmit(userSignIn)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <Label className="sr-only">Email</Label>
              <FormControl>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Contraseña</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="password"
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  disabled={isPending}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="mt-2">
          {isPending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
          Iniciar sesión
        </Button>
      </form>
    </Form>
  )
}
