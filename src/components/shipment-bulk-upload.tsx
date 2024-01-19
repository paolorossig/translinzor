'use client'

import { useEffect, useState } from 'react'
import { UploadIcon } from 'lucide-react'
import * as xlsx from 'xlsx'

import { Dropzone } from '@/components/dropzone'
import { Button } from '@/components/ui/button'
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

const excelAcceptedMimeTypes = {
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
    '.xlsx',
  ],
}

export function ShipmentBulkUpload() {
  const [excelFile, setExcelFile] = useState<ArrayBuffer | null>(null)

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
    const data = xlsx.utils.sheet_to_json(worksheet)

    console.log(data)
  }, [excelFile])

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
          <Dropzone
            maxFiles={1}
            accept={excelAcceptedMimeTypes}
            onDrop={onDrop}
          />
          <DrawerFooter>
            <Button>Subir</Button>
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
