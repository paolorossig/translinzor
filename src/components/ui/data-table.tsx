'use client'

import { useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type Table as TableType,
} from '@tanstack/react-table'
import {
  ArrowUpDownIcon,
  CheckIcon,
  PlusCircleIcon,
  RotateCcwIcon,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { DatePicker } from '@/components/ui/date-picker'
import { Input, InputProps } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { createContext } from '@/lib/context'
import { cn } from '@/lib/utils'
import type { Option } from '@/types'

interface DataTableContext<TData, TValue> {
  table: TableType<TData>
  columns: ColumnDef<TData, TValue>[]
}

export const [DataTableProvider, useDataTableContext] = createContext<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DataTableContext<any, any>
>({
  name: 'DataTableContext',
  hookName: 'useDataTableContext',
  providerName: '<DataTableWrapper />',
})

interface DataTableWrapper<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  children?: React.ReactNode
}

export function DataTableWrapper<TData, TValue>({
  columns,
  data,
  children,
}: DataTableWrapper<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <DataTableProvider value={{ table, columns }}>{children}</DataTableProvider>
  )
}

interface DataTableHeaderProps {
  children: React.ReactNode
  className?: string
  actionArea?: React.ReactNode
}

export function DataTableHeader({
  children,
  className,
  actionArea,
}: DataTableHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className={cn('flex flex-1 flex-col gap-2 sm:flex-row', className)}>
        {children}
      </div>
      {actionArea && (
        <div className="flex items-center space-x-2">{actionArea}</div>
      )}
    </div>
  )
}

interface FilterInputProps extends InputProps {
  columnName: string
}

export function DataTableFilterInput({
  columnName,
  className,
  ...props
}: FilterInputProps) {
  const { table } = useDataTableContext()
  const column = table.getColumn(columnName)

  return (
    <Input
      value={(column?.getFilterValue() as string) ?? ''}
      onChange={(event) => column?.setFilterValue(event.target.value)}
      className={cn('h-8 sm:max-w-md', className)}
      {...props}
    />
  )
}

interface DataTableFacetedFilterProps {
  columnName: string
  title?: string
  options: Option[]
}

export function DataTableFacetedFilter({
  columnName,
  title,
  options,
}: DataTableFacetedFilterProps) {
  const { table } = useDataTableContext()
  const column = table.getColumn(columnName)

  const facets = column?.getFacetedUniqueValues()
  const selectedValues = new Set(column?.getFilterValue() as string[])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 border-dashed">
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} seleccionados
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No se han encontrado resultados.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value)
                      } else {
                        selectedValues.add(option.value)
                      }
                      const filterValues = Array.from(selectedValues)
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined,
                      )
                    }}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible',
                      )}
                    >
                      <CheckIcon className={cn('h-4 w-4')} />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Limpiar filtros
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

interface DataTableDateFilterProps {
  columnName: string
}

export function DataTableDateFilter({ columnName }: DataTableDateFilterProps) {
  const { table } = useDataTableContext()
  const column = table.getColumn(columnName)

  if (!column) return null

  return (
    <DatePicker
      date={column.getFilterValue() as Date | undefined}
      onSelect={column.setFilterValue}
    />
  )
}

export function DataTableResetFilter() {
  const { table } = useDataTableContext()
  const isFiltered = table.getState().columnFilters.length > 0

  if (!isFiltered) return null

  return (
    <Button
      variant="ghost"
      onClick={() => table.resetColumnFilters()}
      className="h-8 px-2 hover:bg-secondary hover:text-secondary-foreground lg:px-3"
    >
      Reiniciar
      <RotateCcwIcon className="ml-2 h-4 w-4" />
    </Button>
  )
}

export function DataTable({ className }: { className?: string }) {
  const { table, columns } = useDataTableContext()

  return (
    <div className={cn('overflow-hidden rounded-md border', className)}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-secondary/30">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No hay resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export function HeaderWithSorting<TData, TValue>({
  column,
  children,
}: {
  column: Column<TData, TValue>
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center space-x-2">
      <span>{children}</span>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        <ArrowUpDownIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
