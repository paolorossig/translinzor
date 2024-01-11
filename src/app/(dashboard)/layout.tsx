import { ChevronRightIcon, HomeIcon } from 'lucide-react'

import Sidebar from '@/components/layout/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full bg-background text-foreground lg:pt-4">
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <Sidebar />
      </div>
      <div className="h-full bg-card lg:ml-72 lg:mr-4 lg:rounded-t-2xl">
        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-x-4 bg-card px-4 sm:gap-x-6 sm:px-6 lg:rounded-t-2xl lg:px-8">
          <div className="flex flex-1 self-stretch">
            <nav
              className="flex items-center space-x-4 text-muted-foreground"
              aria-label="breadcrumb"
            >
              <HomeIcon className="h-4 w-4 font-semibold" />
              <ChevronRightIcon className="h-4 w-4 font-semibold" />
              <span>Dashboard</span>
            </nav>
          </div>
        </header>
        <main className="bg-card py-4 text-card-foreground">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
