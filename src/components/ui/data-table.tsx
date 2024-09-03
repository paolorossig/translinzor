/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
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
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  PlusCircleIcon,
  RotateCcwIcon,
} from 'lucide-react'

import { Icons } from '@/components/icons'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getPaginationRowModel: getPaginationRowModel(),
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
                const Icon = option.icon ? Icons[option.icon] : null

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
                    {Icon && (
                      <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                    {facets?.has(Number(option.value) || option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(Number(option.value) || option.value)}
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
      className="h-8"
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

export type SelectionHeader = {
  table: TableType<any>
  selectedRows: any[]
  totalSelectedRows: number
}

interface DataTableProps {
  className?: string
  selectionHeader?: (params: SelectionHeader) => React.ReactNode
}

export function DataTable({ className, selectionHeader }: DataTableProps) {
  const { table, columns } = useDataTableContext()
  const isRowSelected =
    table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected()
  const selectedRows = table
    .getSelectedRowModel()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    .rows.map((row) => row.original)
  const totalSelectedRows = Object.keys(table.getState().rowSelection).length

  return (
    <div className={cn('overflow-hidden rounded-md border', className)}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="relative bg-secondary/30">
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
              {isRowSelected && selectionHeader && (
                <TableHead className="absolute inset-0 left-8 items-center bg-[#FBFBFC] dark:bg-[#0C0F13]">
                  {selectionHeader({ table, selectedRows, totalSelectedRows })}
                </TableHead>
              )}
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

export function DataTablePagination() {
  const { table } = useDataTableContext()

  return (
    <div className="my-4 flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredRowModel().rows.length} fila(s) encontrada(s)
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="hidden text-sm font-medium md:block">
            Filas por página
          </p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="hidden w-[100px] items-center justify-center text-sm font-medium md:flex">
          Página {table.getState().pagination.pageIndex + 1} de{' '}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Ir a la primera página</span>
            <ChevronsLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Regresar a la pagina anterior</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Ir a la página siguiente</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Ir a la última página</span>
            <ChevronsRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
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
