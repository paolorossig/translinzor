import {
  CalendarIcon,
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
    { name: 'Equipo', href: '#', icon: UsersIcon },
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
