'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { addDays, format } from 'date-fns'
import { DateRange } from 'react-day-picker'

import { DatePicker } from '@/components/ui/date-picker'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { useQueryString } from '@/lib/hooks/use-query-string'

export function DatePickerWithSearchParams() {
  const router = useRouter()
  const pathname = usePathname()
  const { searchParams, createQueryString } = useQueryString()

  const [date, setDate] = useState<Date | undefined>(() => {
    return searchParams.date
      ? new Date(`${searchParams.date}T05:00:00.000Z`)
      : new Date()
  })

  useEffect(() => {
    if (!date) return

    router.push(
      `${pathname}?${createQueryString({
        date: format(date, 'yyyy-MM-dd'),
      })}`,
      { scroll: false },
    )
  }, [createQueryString, date, pathname, router])

  return <DatePicker date={date} onSelect={setDate} />
}

export function DateRangeWithSearchParams() {
  const router = useRouter()
  const pathname = usePathname()
  const { searchParams, createQueryString } = useQueryString()

  const [date, setDate] = useState<DateRange | undefined>(() => {
    const to = searchParams.to
      ? new Date(`${searchParams.to}T05:00:00.000Z`)
      : new Date()
    const from = searchParams.from
      ? new Date(`${searchParams.from}T05:00:00.000Z`)
      : addDays(to, -5)

    return {
      from,
      to,
    }
  })

  useEffect(() => {
    const { from, to } = date ?? {}
    if (!from || !to) return

    router.push(
      `${pathname}?${createQueryString({
        from: format(from, 'yyyy-MM-dd'),
        to: format(to, 'yyyy-MM-dd'),
      })}`,
      { scroll: false },
    )
  }, [createQueryString, date, pathname, router])

  return <DateRangePicker date={date} onSelect={setDate} />
}
