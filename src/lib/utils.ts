import { clsx, type ClassValue } from 'clsx'
import {
  endOfMonth,
  endOfQuarter,
  endOfYear,
  getQuarter,
  isSameDay,
  isSameMonth,
  isSameYear,
  startOfMonth,
  startOfQuarter,
  startOfYear,
} from 'date-fns'
import { formatWithOptions } from 'date-fns/fp'
import { es } from 'date-fns/locale'
import { twMerge } from 'tailwind-merge'
import * as xlsx from 'xlsx'

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

export function downloadExcel(data: AnyObject[], fileName: string) {
  const worksheet = xlsx.utils.json_to_sheet(data)
  const workbook = xlsx.utils.book_new()
  xlsx.utils.book_append_sheet(workbook, worksheet)
  xlsx.writeFile(workbook, fileName)
}

export function formatDate(date: Date) {
  const format = formatWithOptions({ locale: es })
  const today = new Date()
  const thisYear = isSameYear(date, today)
  const yearSuffix = thisYear ? '' : `, ${format('yyyy', date)}`
  return `${capitalize(format('eee, LLL d', date))}${yearSuffix}`
}

/**
 * Format a date range into a human-readable string.
 * Adapted from [little-date](https://github.com/vercel/little-date).
 */
export function formatDateRange(
  from: Date,
  to: Date,
  { today = new Date(), separator = '-' } = {},
) {
  const format = formatWithOptions({ locale: es })

  const sameYear = isSameYear(from, to)
  const sameMonth = isSameMonth(from, to)
  const sameDay = isSameDay(from, to)
  const thisYear = isSameYear(from, today)
  const yearSuffix = thisYear ? '' : `, ${format('yyyy', to)}`

  // Check if the range is the entire year
  // Example: 2023
  if (isSameDay(startOfYear(from), from) && isSameDay(endOfYear(to), to)) {
    return `${format('yyyy', from)}`
  }

  // Check if the range is an entire quarter
  // Example: Q1 2023
  if (
    isSameDay(startOfQuarter(from), from) &&
    isSameDay(endOfQuarter(to), to) &&
    getQuarter(from) === getQuarter(to)
  ) {
    return `Q${getQuarter(from)} ${format('yyyy', from)}`
  }

  // Check if the range is across entire month
  if (isSameDay(startOfMonth(from), from) && isSameDay(endOfMonth(to), to)) {
    if (sameMonth && sameYear) {
      // Example: January 2023
      return `${capitalize(format('LLLL yyyy', from))}`
    }
    // Example: Jan - Feb 2023
    return `${capitalize(format('LLL', from))} ${separator} ${capitalize(format('LLL yyyy', to))}`
  }

  // Range across years
  // Example: Jan 1 '23 - Feb 12 '24
  if (!sameYear) {
    return `${capitalize(format("LLL d ''yy", from))} ${separator} ${capitalize(
      format("LLL d ''yy", to),
    )}`
  }

  // Range across months
  // Example: Jan 1 - Feb 12[, 2023]
  if (!sameMonth) {
    return `${capitalize(format('LLL d', from))} ${separator} ${capitalize(
      format('LLL d', to),
    )}${yearSuffix}`
  }

  // Range across days
  if (!sameDay) {
    // Example: Jan 1 - 12[, 2023]
    return `${capitalize(format('LLL d', from))} ${separator} ${format(
      'd',
      to,
    )}${yearSuffix}`
  }

  // Full day
  // Example: Fri, Jan 1[, 2023]
  return `${capitalize(format('eee, LLL d', from))}${yearSuffix}`
}
