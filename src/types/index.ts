import { IconName } from '@/components/icons'

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

export type SearchParams = Record<string, string | string[] | undefined>

export interface Option<T = string> {
  label: string
  value: T
  icon?: IconName
  disabled?: boolean
}

export type ServerActionResponse =
  | { success: true }
  | { success: false; message: string }
