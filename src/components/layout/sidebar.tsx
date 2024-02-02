'use client'

/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { useRouter, useSelectedLayoutSegment } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { LogOutIcon, SettingsIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { dashboardConfig } from '@/config/dashboard'
import { cn } from '@/lib/utils'

export default function Sidebar() {
  const router = useRouter()
  const segment = useSelectedLayoutSegment()
  const supabase = createClientComponentClient()

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
              {dashboardConfig.navigation.map((item) => (
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
                    <item.icon
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
              ))}
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
              <img
                className="h-8 w-8 rounded-full bg-gray-50"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
              <span
                className="ml-4 text-sm font-semibold leading-6 text-primary"
                aria-hidden="true"
              >
                Tim Cook
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
