import { UserRole } from '@/db/schema'
import type { NavItem } from '@/types'

interface DashboardConfig {
  navigationByUserRole: Record<UserRole, NavItem[]>
}

export const dashboardConfig: DashboardConfig = {
  navigationByUserRole: {
    admin: [
      { name: 'Dashboard', href: '/', icon: 'home' },
      { name: 'Entregas', href: '/shipments', icon: 'baggageClaim' },
      { name: 'Clientes', href: '/costumers', icon: 'contact' },
      { name: 'Operaciones', href: '/operations', icon: 'car' },
      { name: 'Usuarios', href: '#', icon: 'users' },
    ],
    client: [
      { name: 'Dashboard', href: '/', icon: 'home' },
      { name: 'Clientes', href: '/costumers', icon: 'contact' },
      { name: 'Entregas', href: '/shipments', icon: 'baggageClaim' },
      { name: 'Reportes', href: '#', icon: 'pieChart' },
    ],
  },
}
