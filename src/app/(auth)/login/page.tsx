/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'

import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <section className="mx-auto flex w-full flex-col justify-center space-y-6 px-4 sm:w-[350px] sm:px-0">
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
      <LoginForm />
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
