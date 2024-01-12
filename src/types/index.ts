import type { LucideIcon } from 'lucide-react'

export type Icon = LucideIcon

export interface NavItem {
  name: string
  href: string
  icon: Icon
}

export interface Option<T = string> {
  label: string
  value: T
  icon?: Icon
}
