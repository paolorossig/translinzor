import NavBreadcrumb from '@/components/layout/nav-breadcrumb'
import Sidebar from '@/components/layout/sidebar'
import { ThemeToggle } from '@/components/layout/theme'

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
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 bg-card px-4 dark:border-b-transparent sm:gap-x-6 sm:px-6 lg:rounded-t-2xl dark:lg:border">
          <div className="flex flex-1 self-stretch">
            <NavBreadcrumb />
          </div>
          <ThemeToggle />
        </header>
        <main className="bg-card py-2 text-card-foreground dark:border-y-transparent dark:lg:border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
