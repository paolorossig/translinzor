/* eslint-disable @next/next/no-img-element */

import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <header>
      <div className="m-auto flex h-16 w-full max-w-7xl items-center justify-between bg-background px-6">
        <div className="flex items-center gap-x-4">
          <img
            className="h-16 w-auto"
            src="/assets/logo.png"
            alt="Logo of Translinzor"
          />
          <span className="font-sans text-2xl font-semibold tracking-tight text-primary">
            Translinzor
          </span>
        </div>
        <div className="flex items-center gap-x-4">
          <Link href="/">
            <Button>Ir al Dashboard</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
