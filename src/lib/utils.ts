import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import type { ServerActionResponse } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function removeAccents(str: string) {
  return str.normalize('NFD').replace(/\p{Diacritic}/gu, '')
}

export function catchError(err: unknown, defaultMessage?: string) {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err

  return defaultMessage ?? 'Algo salió mal, inténtalo de nuevo más tarde.'
}

export function handleServerActionResponse(response: ServerActionResponse) {
  if (!response.success) return Promise.reject(response.message)

  return Promise.resolve(response)
}

/**
 * The `keyMirror` function in TypeScript creates an object with keys that have the same value as their
 * names.
 */
export function keyMirror<T extends Record<string, unknown>>(
  obj: T,
): { [K in keyof T]: K } {
  const result: Partial<{ [K in keyof T]: K }> = {}

  for (const key in obj) {
    result[key] = key
  }

  return result as { [K in keyof T]: K }
}

export function getPastMonday(date: Date): Date {
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(date.setDate(diff))
}
