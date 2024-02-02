'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2Icon } from 'lucide-react'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn, wait } from '@/lib/utils'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LoginForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    await wait(1000)

    setIsLoading(false)
    router.push('/')
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={(e) => void onSubmit(e)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
            Iniciar sesión con email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">O</span>
        </div>
      </div>
      <Button
        variant="default"
        type="button"
        disabled={isLoading}
        asChild
        className="bg-green-400 text-white hover:bg-green-400/90"
      >
        <Link
          href="https://wa.link/ml2t11"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icons.whatsapp className="mr-2 h-4 w-4" />
          Contáctanos
        </Link>
      </Button>
    </div>
  )
}
