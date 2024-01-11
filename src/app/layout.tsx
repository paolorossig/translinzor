import type { Metadata } from 'next'

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
      <body className="h-full antialiased">{children}</body>
    </html>
  )
}
