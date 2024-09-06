import type { UserRole } from '@/db/schema'
import type { UserNavigation } from '@/types'

export const navigationByUserRole: Record<UserRole, UserNavigation> = {
  admin: [
    { name: 'Dashboard', href: '/', icon: 'home' },
    { name: 'Entregas', href: '/shipments', icon: 'baggageClaim' },
    { name: 'Reportes', href: '/reports', icon: 'pieChart' },
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
}

export const segmentLabelMap: Record<string, string> = {
  costumers: 'Clientes',
  shipments: 'Entregas',
  operations: 'Operaciones',
  reports: 'Reportes',
  users: 'Usuarios',
}
