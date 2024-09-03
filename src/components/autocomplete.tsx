import { useState } from 'react'
import { CheckIcon, ChevronsUpDownIcon, Loader2Icon } from 'lucide-react'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { Option } from '@/types'

interface AutocompleteProps {
  options?: Option[]
  value?: string | number
  onValueChange?: (value: string | number) => void
  defaultValue?: string
  placeholder?: string
  isLoading?: boolean
  shouldFilter?: boolean
  searchQuery?: string
  setSearchQuery?: (value: string) => void
}

export default function Autocomplete({
  value,
  onValueChange,
  searchQuery,
  setSearchQuery,
  placeholder,
  defaultValue,
  options = [],
  isLoading = false,
  shouldFilter = true,
}: AutocompleteProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(
    defaultValue ?? options.find((option) => option.value === value)?.label,
  )

  const handleOnSelect = (option: Option) => {
    setInputValue(option.label)
    onValueChange?.(option.value)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn('justify-between', !value && 'text-muted-foreground')}
        >
          {inputValue ?? placeholder}
          {isLoading ? (
            <Loader2Icon className="ml-2 h-4 w-4 shrink-0 animate-spin opacity-50" />
          ) : (
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command shouldFilter={shouldFilter}>
          <CommandInput
            placeholder="Buscar..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          {!isLoading && (
            <CommandEmpty>No se han encontrado resultados.</CommandEmpty>
          )}
          <CommandList>
            {isLoading ? (
              <div className="space-y-1 overflow-hidden px-1 py-2">
                <Skeleton className="h-8 rounded-sm" />
                <Skeleton className="h-8 rounded-sm" />
                <Skeleton className="h-8 rounded-sm" />
              </div>
            ) : (
              options.map((option) => {
                const Icon = option.icon ? Icons[option.icon] : null
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    onSelect={() => handleOnSelect(option)}
                  >
                    <CheckIcon
                      className={cn(
                        'mr-2 h-4 w-4 flex-shrink-0',
                        option.value === value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {Icon && <Icon className="mr-2 h-4 w-4" />}
                    <span className="overflow-x-clip whitespace-nowrap">
                      {option.label}
                    </span>
                  </CommandItem>
                )
              })
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
