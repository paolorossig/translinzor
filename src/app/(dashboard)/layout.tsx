import { MenuIcon } from 'lucide-react'

import NavBreadcrumb from '@/components/layout/nav-breadcrumb'
import Sidebar from '@/components/layout/sidebar'
import { ThemeToggle } from '@/components/layout/theme'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { dashboardConfig } from '@/config/dashboard'
import { useAuth } from '@/lib/auth'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile } = await useAuth()
  const { displayName, role } = profile
  const userNavigation = dashboardConfig.navigationByUserRole[role]

  return (
    <div className="h-full bg-background text-foreground">
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <Sidebar displayName={displayName} userNavigation={userNavigation} />
      </div>
      <div className="fixed inset-x-0 top-0 h-full bg-card lg:ml-72 lg:mr-4 lg:mt-4 lg:rounded-t-2xl lg:border-x lg:border-t">
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 bg-card px-4 sm:gap-x-6 sm:px-6 lg:rounded-t-2xl">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="p-2.5 lg:hidden">
                <span className="sr-only">Abrir menu lateral</span>
                <MenuIcon className="h-6 w-6" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 px-0">
              <Sidebar
                displayName={displayName}
                userNavigation={userNavigation}
              />
            </SheetContent>
          </Sheet>
          <div className="h-6 w-px bg-border lg:hidden" aria-hidden="true" />
          <div className="flex flex-1 self-stretch">
            <NavBreadcrumb />
          </div>
          <ThemeToggle />
        </header>
        <main className="h-[calc(100%-5rem)] bg-card py-2 text-card-foreground">
          <div className="mx-auto h-full max-w-7xl overflow-y-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
