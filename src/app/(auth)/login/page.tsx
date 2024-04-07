/* eslint-disable @next/next/no-img-element */
import { cookies } from 'next/headers'
import Link from 'next/link'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { ChevronRightIcon } from 'lucide-react'

import { LoginForm } from '@/components/auth/login-form'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'

export default async function LoginPage() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <section className="mx-auto flex w-full flex-col justify-center space-y-6 px-4 sm:w-[350px]">
      <div className="flex flex-col text-center">
        <picture className="lg:hidden">
          <img
            className="mx-auto h-16 w-16"
            src="/logo-square.png"
            alt="Logo of Translinzor"
          />
        </picture>
        <h1 className="text-2xl font-semibold tracking-tight text-primary">
          Iniciar sesión
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Inicia sesión en tu cuenta para acceder al dashboard.
        </p>
      </div>
      {user ? (
        <Button asChild className="group">
          <Link href="/">
            Ir al dashboard
            <ChevronRightIcon className="ml-2 h-4 w-4 group-hover:scale-125 group-hover:animate-pulse" />
          </Link>
        </Button>
      ) : (
        <LoginForm />
      )}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">O</span>
        </div>
      </div>
      <Button asChild className="bg-green-400 text-white hover:bg-green-400/90">
        <Link
          href="https://wa.link/ml2t11"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icons.whatsapp className="mr-2 h-4 w-4" />
          Contáctanos
        </Link>
      </Button>
      <p className="px-8 text-center text-sm text-muted-foreground">
        Al hacer clic en continuar, aceptas nuestros{' '}
        <Link
          href="/terms"
          className="underline underline-offset-4 hover:text-primary"
        >
          Términos de servicio
        </Link>{' '}
        y{' '}
        <Link
          href="/privacy"
          className="underline underline-offset-4 hover:text-primary"
        >
          Políticas de privacidad
        </Link>
        .
      </p>
    </section>
  )
}
