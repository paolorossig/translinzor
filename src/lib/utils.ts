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
