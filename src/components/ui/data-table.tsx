'use client'

import { useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type Table as TableType,
} from '@tanstack/react-table'

import { Input, InputProps } from '@/components/ui/input'
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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  children?: React.ReactNode
}

interface FilterInputProps extends InputProps {
  columnName: string
}

interface DataTableContext<TData, TValue> {
  table: TableType<TData>
  columns: ColumnDef<TData, TValue>[]
}

const [DataTableProvider, useDataTableContext] = createContext<
  DataTableContext<any, any>
>({
  name: 'DataTableContext',
  hookName: 'useDataTableContext',
  providerName: '<DataTableWrapper />',
})

export function DataTableWrapper<TData, TValue>({
  columns,
  data,
  children,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <DataTableProvider value={{ table, columns }}>{children}</DataTableProvider>
  )
}

export function DataTableHeader({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center py-4">{children}</div>
}

export function DataTableFilterInput({
  columnName,
  className,
  ...props
}: FilterInputProps) {
  const { table } = useDataTableContext()

  return (
    <Input
      value={(table.getColumn(columnName)?.getFilterValue() as string) ?? ''}
      onChange={(event) =>
        table.getColumn(columnName)?.setFilterValue(event.target.value)
      }
      className={cn('max-w-sm', className)}
      {...props}
    />
  )
}

export function DataTable() {
  const { table, columns } = useDataTableContext()

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
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
