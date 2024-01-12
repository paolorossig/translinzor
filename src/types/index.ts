import type { LucideIcon } from 'lucide-react'

interface Icon extends LucideIcon {}

export interface NavItem {
  name: string
  href: string
  icon: Icon
}
