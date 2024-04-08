'use client'

import { useEffect, useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { LinkIcon, UploadIcon, XIcon } from 'lucide-react'
import { defaultStyles, FileIcon } from 'react-file-icon'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as xlsx from 'xlsx'

import { Dropzone } from '@/components/dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { clientIds } from '@/config/clients'
import { createBulkShipments } from '@/lib/actions'
import {
  createBulkShipmentsSchema,
  headersMap,
  parseShipmentBulkUpload,
  type CreateBulkShipmentsInput,
} from '@/lib/validations/shipments'

const excelAcceptedMimeTypes = {
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
    '.xlsx',
  ],
}

// TODO: Send just the neccesary JS when disabled is true
export function ShipmentBulkUpload({ disabled }: { disabled: boolean }) {
  const [open, setOpen] = useState(false)
  const [excelFile, setExcelFile] = useState<ArrayBuffer | null>(null)
  const [isPending, startTransition] = useTransition()

  const defaultValues = {
    clientId: clientIds.laSirena,
    bundledOrders: [],
  }

  const form = useForm<CreateBulkShipmentsInput>({
    resolver: zodResolver(createBulkShipmentsSchema),
    defaultValues,
  })

  const areBundledOrdersValid = form.watch('bundledOrders').length > 0

  useEffect(() => {
    if (!excelFile) return

    const workbook = xlsx.read(excelFile, { type: 'buffer' })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]!]!
    const data = xlsx.utils.sheet_to_json(worksheet) as Record<
      string,
      string | number
    >[]

    if (!data?.length) {
      toast.error('El archivo no contiene datos válidos.')
      return
    }

    const parsedData = parseShipmentBulkUpload(data)
    if (!parsedData.length) {
      toast.error('El archivo no contiene datos válidos.')
      return
    }

    form.setValue('bundledOrders', parsedData)
    toast.success('El archivo se ha cargado correctamente.')
  }, [excelFile, form])

  const onDrop = (acceptedFiles: File[]) => {
    if (!acceptedFiles[0]) return

    const reader = new FileReader()
    reader.readAsArrayBuffer(acceptedFiles[0])
    reader.onload = (e) => setExcelFile(e.target?.result as ArrayBuffer | null)
    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')
  }

  const submitBulkData = (data: CreateBulkShipmentsInput) => {
    startTransition(() => {
      toast.promise(
        createBulkShipments(data).then((result) => {
          form.reset(defaultValues)

          if (!result.success) return Promise.reject(result.message)

          setOpen(false)
          return Promise.resolve(result)
        }),
        {
          loading: 'Cargando...',
          success: 'Carga masiva realizada exitosamente.',
          error: (err: string) => err,
        },
      )
    })
  }

  const downloadTemplate = () => {
    const worksheet = xlsx.utils.aoa_to_sheet([Object.keys(headersMap)])
    const workbook = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Entregas')
    xlsx.writeFile(workbook, 'template.xlsx')
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="h-8" disabled={disabled}>
          <UploadIcon className="h-4 w-4" />
          <span className="ml-2 hidden md:block">Carga masiva</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <Form {...form}>
          <form
            className="mx-auto w-full max-w-xl"
            onSubmit={form.handleSubmit(submitBulkData)}
          >
            <DrawerHeader>
              <DrawerTitle className="text-primary">Carga masiva</DrawerTitle>
              <DrawerDescription>
                Esta acción subirá las entregas programadas mediante un template
                de excel.
              </DrawerDescription>
            </DrawerHeader>
            <div>
              <Button
                variant="link"
                className="flex h-6 items-center text-gray-700"
                onClick={downloadTemplate}
              >
                <LinkIcon className="mr-1 h-4 w-4" />
                La Sirena - Template
              </Button>
            </div>

            {areBundledOrdersValid ? (
              <div className="flex flex-col justify-center gap-x-6 gap-y-4 p-4 sm:flex-row">
                <FormField
                  control={form.control}
                  name="deliveryDate"
                  render={({ field }) => (
                    <FormItem className="flex min-w-52 flex-col">
                      <FormLabel>Fecha de entrega</FormLabel>
                      <FormControl>
                        <div className="flex flex-col">
                          <DatePicker
                            date={field.value}
                            onSelect={field.onChange}
                            className="h-8"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bundledOrders"
                  render={({ field }) => {
                    const summary = field.value.reduce(
                      (acc, curr) => {
                        acc.shipments.add(curr.route)
                        acc.orders.add(curr.clientOrderId)
                        return acc
                      },
                      {
                        shipments: new Set<string>(),
                        orders: new Set<number>(),
                      },
                    )

                    return (
                      <Card className="relative flex-1 pt-6">
                        <div
                          onClick={() => {
                            form.reset(defaultValues)
                          }}
                          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                          <XIcon className="h-4 w-4" />
                          <span className="sr-only">Cerrar</span>
                        </div>
                        <CardContent className="flex flex-1 items-center justify-center">
                          <div className="w-20">
                            <FileIcon
                              extension="xlsx"
                              {...defaultStyles.xlsx}
                            />
                          </div>
                          <div className="px-10 text-sm">
                            <h3 className="font-semibold text-secondary-foreground">
                              Resumen:
                            </h3>
                            <ul className="ml-4">
                              <li>{summary.shipments.size} envíos</li>
                              <li>{summary.orders.size} órdenes</li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  }}
                />
              </div>
            ) : (
              <Dropzone
                maxFiles={1}
                accept={excelAcceptedMimeTypes}
                onDrop={onDrop}
              />
            )}

            <DrawerFooter>
              <Button
                type="submit"
                disabled={isPending || !areBundledOrdersValid}
              >
                Subir
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="w-full">
                  Cancelar
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  )
}
