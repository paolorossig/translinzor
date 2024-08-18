import { useState } from 'react'
import { CheckIcon, ChevronsUpDownIcon, Loader2Icon } from 'lucide-react'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
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
  options: Option[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  isLoading?: boolean
}

export default function Autocomplete({
  options,
  value,
  onValueChange,
  placeholder,
  isLoading = false,
}: AutocompleteProps) {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn('justify-between', !value && 'text-muted-foreground')}
        >
          {value
            ? options?.find((option) => option.value === value)?.label
            : placeholder}
          {isLoading ? (
            <Loader2Icon className="ml-2 h-4 w-4 shrink-0 animate-spin opacity-50" />
          ) : (
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Buscar..." disabled={isLoading} />
          {!isLoading && (
            <CommandEmpty>No se han encontrado resultados.</CommandEmpty>
          )}
          <CommandGroup>
            <CommandList>
              {isLoading ? (
                <div className="space-y-1 overflow-hidden px-1 py-2">
                  <Skeleton className="h-8 rounded-sm" />
                  <Skeleton className="h-8 rounded-sm" />
                  <Skeleton className="h-8 rounded-sm" />
                </div>
              ) : (
                options?.map((option) => {
                  const Icon = option.icon ? Icons[option.icon] : null
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      disabled={option.disabled}
                      onSelect={() => {
                        onValueChange?.(option.value)
                        setOpen(false)
                      }}
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
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
