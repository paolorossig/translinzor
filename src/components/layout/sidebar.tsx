'use client'

/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { useRouter, useSelectedLayoutSegment } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { LogOutIcon, SettingsIcon } from 'lucide-react'

import { Icons } from '@/components/icons'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { NavItem } from '@/types'

interface SidebarProps {
  displayName: string
  userNavItems: NavItem[]
}

export default function Sidebar({ displayName, userNavItems }: SidebarProps) {
  const router = useRouter()
  const segment = useSelectedLayoutSegment()
  const supabase = createClientComponentClient()

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
    <div className="flex h-full grow flex-col gap-y-5 overflow-y-auto bg-background px-6 pb-4">
      <Link href="/" className="flex h-16 shrink-0 items-center">
        <img
          className="h-16 w-auto"
          src="/logo.png"
          alt="Logo of Translinzor"
        />
        <span className="font-sans text-2xl font-semibold tracking-tight text-primary">
          Translinzor
        </span>
      </Link>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {userNavItems.map((item) => {
                const Icon = Icons[item.icon]
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        isTabSelected(item.href)
                          ? 'bg-white text-primary dark:border-zinc-700 dark:bg-zinc-800'
                          : 'border-transparent hover:text-primary',
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
            <a
              href="#"
              className="group -mx-2 flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 hover:text-primary"
            >
              <SettingsIcon
                className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-primary"
                aria-hidden="true"
              />
              Ajustes
            </a>
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
