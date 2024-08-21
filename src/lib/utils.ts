import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function removeAccents(str: string) {
  return str.normalize('NFD').replace(/\p{Diacritic}/gu, '')
}

export function getToday() {
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  return startOfToday
}

export function getPastMonday(date: Date): Date {
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(date.setDate(diff))
}

export function roundNumber(num: number, dec = 0) {
  return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec)
}

export function toPercent(decimal: number, fixed = 0) {
  return `${roundNumber(decimal * 100, fixed)}%`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObject = Record<string, any>

export function flattenObject(ob: AnyObject): AnyObject {
  const toReturn: AnyObject = {}
  for (const i in ob) {
    if (!ob.hasOwnProperty(i)) continue
    if (typeof ob[i] === 'object' && ob[i] !== null) {
      const flatObject = flattenObject(ob[i] as AnyObject)
      for (const x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        toReturn[i + '.' + x] = flatObject[x]
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      toReturn[i] = ob[i]
    }
  }
  return toReturn
}
