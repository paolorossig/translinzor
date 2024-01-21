import {
  BaggageClaimIcon,
  CalendarIcon,
  ContactIcon,
  FilesIcon,
  FolderIcon,
  HomeIcon,
  PieChartIcon,
  UsersIcon,
} from 'lucide-react'

import type { NavItem } from '@/types'

interface DashboardConfig {
  navigation: NavItem[]
}

export const dashboardConfig: DashboardConfig = {
  navigation: [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Clientes', href: '/costumers', icon: ContactIcon },
    { name: 'Entregas', href: '/shipments', icon: BaggageClaimIcon },
    { name: 'Usuarios', href: '#', icon: UsersIcon },
    { name: 'Proyectos', href: '#', icon: FolderIcon },
    { name: 'Calendario', href: '#', icon: CalendarIcon },
    {
      name: 'Documentos',
      href: '#',
      icon: FilesIcon,
    },
    { name: 'Reportes', href: '#', icon: PieChartIcon },
  ],
}
