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
  range: DateRange | undefined
  onSelect: SelectRangeEventHandler
  className?: string
}

export function DateRangePicker({
  range,
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
              !range && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 capitalize" />
            {range?.from
              ? range.to
                ? formatDateRange(range.from, range.to)
                : formatDate(range.from)
              : 'Elija una fecha'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={range?.from}
            selected={range}
            onSelect={onSelect}
            numberOfMonths={2}
            locale={es}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
