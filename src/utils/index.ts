import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function removeAccents(str: string) {
  return str.normalize('NFD').replace(/\p{Diacritic}/gu, '')
}

export function roundNumber(num: number, dec = 0) {
  return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec)
}

export function toPercent(decimal: number, fixed = 0) {
  return `${roundNumber(decimal * 100, fixed)}%`
}

export function uniqueValues<T>(arr: T[]): T[]
export function uniqueValues<T, K>(arr: T[], mapFn: (value: T) => K): K[]
export function uniqueValues<T, K>(
  arr: T[],
  mapFn?: (value: T) => K,
): K[] | T[] {
  if (mapFn) {
    const mappedArr = arr.map(mapFn)
    return Array.from(new Set(mappedArr))
  }
  return Array.from(new Set(arr))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function groupBy<T>(arr: T[], fn: (item: T) => any) {
  return arr.reduce<Record<string, T[]>>((prev, curr) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const groupKey = fn(curr)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const group = prev[groupKey] ?? []
    group.push(curr)
    return { ...prev, [groupKey]: group }
  }, {})
}
