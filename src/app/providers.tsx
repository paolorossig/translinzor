'use client'

import { ThemeProvider } from 'next-themes'

import { ThemeWatcher } from '@/components/layout/theme'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange>
      <ThemeWatcher />
      {children}
    </ThemeProvider>
  )
}
