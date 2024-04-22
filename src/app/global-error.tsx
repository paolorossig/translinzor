'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

import { Button } from '@/components/ui/button'

interface GlobalErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalErrorPage({
  error,
  reset,
}: GlobalErrorPageProps) {
  useEffect(() => {
    console.error(error)
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body>
        <h2>¡Algo salió mal!</h2>
        <pre>{JSON.stringify(error, null, 2)}</pre>
        <Button onClick={reset}>Intentar otra vez</Button>
      </body>
    </html>
  )
}
