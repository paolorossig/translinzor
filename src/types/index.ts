import { type LucideIcon } from 'lucide-react'

import { IconName } from '@/components/icons'

export type Icon = LucideIcon

export interface NavItem {
  name: string
  href: string
  icon: IconName
  separator?: false
}

export interface NavGroupSeparator {
  name: string
  separator: true
}

export type UserNavigation = (NavItem | NavGroupSeparator)[]

export interface Option<T = string> {
  label: string
  value: T
  icon?: Icon
}
