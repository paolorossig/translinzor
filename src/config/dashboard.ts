import type { UserRole } from '@/db/schema'
import type { UserNavigation } from '@/types'

interface DashboardConfig {
  navigationByUserRole: Record<UserRole, UserNavigation>
}

export const dashboardConfig: DashboardConfig = {
  navigationByUserRole: {
    admin: [
      { name: 'Dashboard', href: '/', icon: 'home' },
      { name: 'Entregas', href: '/shipments', icon: 'baggageClaim' },
      { name: 'Maestros', separator: true },
      { name: 'Clientes', href: '/costumers', icon: 'contact' },
      { name: 'Operaciones', href: '/operations', icon: 'car' },
      { name: 'Usuarios', href: '/users', icon: 'users' },
    ],
    client: [
      { name: 'Dashboard', href: '/', icon: 'home' },
      { name: 'Entregas', href: '/shipments', icon: 'baggageClaim' },
      { name: 'Clientes', href: '/costumers', icon: 'contact' },
      { name: 'Reportes', href: '/reports', icon: 'pieChart' },
    ],
  },
}
