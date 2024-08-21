'use client'

import * as React from 'react'
import { es } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { DateRange, type SelectRangeEventHandler } from 'react-day-picker'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn, formatDate, formatDateRange } from '@/lib/utils'

interface DateRangePickerProps {
  date: DateRange | undefined
  onSelect: SelectRangeEventHandler
  className?: string
}

export function DateRangePicker({
  date,
  onSelect,
  className,
}: DateRangePickerProps) {
  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'justify-start text-left font-normal',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 capitalize" />
            {date?.from
              ? date.to
                ? formatDateRange(date.from, date.to)
                : formatDate(date.from)
              : 'Elija una fecha'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onSelect}
            numberOfMonths={2}
            locale={es}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
