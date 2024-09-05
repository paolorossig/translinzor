'use client'

/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { useRouter, useSelectedLayoutSegment } from 'next/navigation'
import { ArrowUpRightIcon, LogOutIcon } from 'lucide-react'

import { Icons } from '@/components/icons'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import type { UserNavigation } from '@/types'

interface SidebarProps {
  displayName: string
  userNavigation: UserNavigation
}

export default function Sidebar({ displayName, userNavigation }: SidebarProps) {
  const router = useRouter()
  const segment = useSelectedLayoutSegment()
  const supabase = createClient()

  const firstLetters = displayName
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')

  const isTabSelected = (href: string) =>
    href.includes(String(segment)) || (href === '/' && !segment)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <div className="flex h-full grow flex-col gap-y-2 overflow-y-auto bg-background px-6 pb-4">
      <Link href="/" className="flex h-16 shrink-0 items-center">
        <img
          className="h-16 w-auto"
          src="/assets/logo.png"
          alt="Logo of Translinzor"
        />
        <span className="font-sans text-2xl font-semibold tracking-tight text-primary">
          Translinzor
        </span>
      </Link>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="flex flex-col gap-y-1">
              {userNavigation.map((item) => {
                if (item.separator) {
                  return (
                    <li
                      key={item.name}
                      className="mt-8 p-2 font-semibold tracking-tight text-gray-700"
                    >
                      {item.name}
                    </li>
                  )
                }

                const Icon = Icons[item.icon]
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        isTabSelected(item.href)
                          ? 'bg-white text-primary dark:border-zinc-700 dark:bg-zinc-800'
                          : 'border-transparent text-gray-400 hover:text-primary',
                        'group flex items-center gap-x-3 rounded-md border p-2 text-sm font-semibold leading-6',
                      )}
                    >
                      <Icon
                        className={cn(
                          isTabSelected(item.href)
                            ? 'text-primary'
                            : 'text-gray-400 group-hover:text-primary',
                          'h-5 w-5 shrink-0',
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>
          <li className="mt-auto">
            <Link
              href="/tracker"
              className="group flex items-center justify-center gap-x-3 rounded-md border bg-white p-2 text-sm font-semibold leading-6 text-gray-400 text-primary hover:border-primary hover:text-primary dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="relative">
                Ir al Tracker
                <ArrowUpRightIcon className="absolute -right-4 top-0 h-3 w-3" />
              </span>
            </Link>
            <div className="mt-4 flex items-center border-t p-1 pt-4">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-[#2B65AD] text-sm text-white">
                  {firstLetters}
                </AvatarFallback>
              </Avatar>
              <span
                className="ml-2 text-sm font-semibold leading-6 text-primary"
                aria-hidden="true"
              >
                {displayName}
              </span>
              <Button
                size="icon"
                variant="outline"
                className="ml-auto"
                onClick={handleSignOut}
              >
                <LogOutIcon className="h-4 w-4" />
                <span className="sr-only">Cerrar sesión</span>
              </Button>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  )
}
