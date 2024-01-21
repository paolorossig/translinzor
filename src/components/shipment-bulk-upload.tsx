'use client'

import { useEffect, useState } from 'react'
import { UploadIcon, XIcon } from 'lucide-react'
import { defaultStyles, FileIcon } from 'react-file-icon'
import { toast } from 'sonner'
import * as xlsx from 'xlsx'

import { Dropzone } from '@/components/dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
  parseShipmentBulkUpload,
  type ShipmentBulkUploadRow,
} from '@/lib/validations/shipment-upload'

const excelAcceptedMimeTypes = {
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
    '.xlsx',
  ],
}

export function ShipmentBulkUpload() {
  const [excelFile, setExcelFile] = useState<ArrayBuffer | null>(null)
  const [bulkData, setBulkData] = useState<ShipmentBulkUploadRow[] | null>(null)

  const onDrop = (acceptedFiles: File[]) => {
    if (!acceptedFiles[0]) return

    const reader = new FileReader()
    reader.readAsArrayBuffer(acceptedFiles[0])
    reader.onload = (e) => setExcelFile(e.target?.result as ArrayBuffer | null)
    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')
  }

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

    toast.success('El archivo se ha cargado correctamente.')

    const parsedData = parseShipmentBulkUpload(data)
    setBulkData(parsedData)
  }, [excelFile])

  const defaultSummary = {
    routes: new Set<string>(),
    vouchers: new Set<number>(),
  }

  const summary =
    bulkData?.reduce((acc, curr) => {
      acc.routes.add(curr.route)
      acc.vouchers.add(curr.voucher)
      return acc
    }, defaultSummary) ?? defaultSummary

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="h-8">
          <UploadIcon className="h-4 w-4" />
          <span className="ml-2 hidden md:block">Carga masiva</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-xl">
          <DrawerHeader>
            <DrawerTitle className="text-primary">Carga masiva</DrawerTitle>
            <DrawerDescription>
              Esta acción subirá las entregas programadas mediante un template
              de excel.
            </DrawerDescription>
          </DrawerHeader>
          {bulkData ? (
            <div className="flex py-4">
              <Card className="relative mx-auto pt-6">
                <div
                  onClick={() => setBulkData(null)}
                  className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <XIcon className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </div>
                <CardContent className="flex items-center">
                  <div className="w-20">
                    <FileIcon extension="xlsx" {...defaultStyles.xlsx} />
                  </div>
                  <div className="px-10 text-sm">
                    <h3 className="font-semibold text-secondary-foreground">
                      Resumen:
                    </h3>
                    <ul className="ml-4">
                      <li>{summary.routes.size} envíos</li>
                      <li>{summary.vouchers.size} vales</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Dropzone
              maxFiles={1}
              accept={excelAcceptedMimeTypes}
              onDrop={onDrop}
            />
          )}
          <DrawerFooter>
            <Button disabled={!bulkData}>Subir</Button>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Cancelar
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
