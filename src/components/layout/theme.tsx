'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const otherTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Button
      aria-label={mounted ? `Switch to ${otherTheme} theme` : 'Toggle theme'}
      size="icon"
      variant="outline"
      className="group shadow-lg shadow-zinc-800/5 backdrop-blur transition"
      onClick={() => setTheme(otherTheme)}
    >
      <SunIcon
        className={clsx(
          'h-4 w-4 transition dark:hidden',
          'group-hover:fill-yellow-200 group-hover:stroke-yellow-700',
        )}
      />
      <MoonIcon
        className={clsx(
          'hidden h-4 w-4 transition dark:block',
          'group-hover:fill-zinc-700 group-hover:stroke-zinc-700',
        )}
      />
    </Button>
  )
}

export function ThemeWatcher() {
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    const onMediaChange = () => {
      const systemTheme = media.matches ? 'dark' : 'light'
      if (resolvedTheme === systemTheme) {
        setTheme('system')
      }
    }

    onMediaChange()
    media.addEventListener('change', onMediaChange)

    return () => {
      media.removeEventListener('change', onMediaChange)
    }
  }, [resolvedTheme, setTheme])

  return null
}
