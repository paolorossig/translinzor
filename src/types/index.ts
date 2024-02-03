import type { LucideIcon } from 'lucide-react'

import { IconName } from '@/components/icons'

export type Icon = LucideIcon

export interface NavItem {
  name: string
  href: string
  icon: IconName
}

export interface Option<T = string> {
  label: string
  value: T
  icon?: Icon
}
