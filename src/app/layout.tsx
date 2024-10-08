import type { Metadata } from 'next'

import { TailwindIndicator } from '@/components/tailwind-indicator'
import { Toaster } from '@/components/ui/sonner'

import Providers from './providers'

import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Translinzor',
    template: '%s - Translinzor',
  },
  description: 'Operador Logístico - Transportes Linzor',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning className="h-full">
      <body className="h-full antialiased">
        <Providers>
          {children}
          <Toaster />
          <TailwindIndicator />
        </Providers>
      </body>
    </html>
  )
}
