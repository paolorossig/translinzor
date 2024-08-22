/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next'

import { ThemeToggle } from '@/components/layout/theme'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Inicie sesión en su cuenta para acceder al dashboard.',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full bg-background text-foreground">
      <div className="flex h-full items-center justify-center">
        <div className="relative grid h-full max-h-[800px] max-w-6xl flex-col items-center justify-center overflow-hidden rounded-lg border-0 lg:grid-cols-2 lg:border lg:bg-card lg:px-0">
          <div className="absolute right-4 top-4 md:right-8 md:top-8">
            <ThemeToggle />
          </div>
          <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
            <div className="absolute inset-0 bg-[url(/assets/trucks.jpg)] bg-cover">
              <div className="flex h-full w-full items-center justify-center backdrop-brightness-95 dark:backdrop-brightness-50" />
            </div>
            <div className="relative z-20 flex items-center">
              <img
                className="h-16 w-auto"
                src="/assets/logo.png"
                alt="Logo of Translinzor"
              />
              <span className="font-sans text-2xl font-semibold tracking-tight text-white">
                Translinzor
              </span>
            </div>
            <div className="relative z-20 mt-auto">
              <blockquote>
                <p className="text-lg">
                  &ldquo;Contamos con una amplia experiencia laboral orientada
                  al servicio de recepción y distribución de mercadería a
                  almacenes mineros, empresas corporativas y
                  distribuidoras.&rdquo;
                </p>
              </blockquote>
            </div>
          </div>
          <main className="lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
