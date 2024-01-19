import { UploadIcon } from 'lucide-react'

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

export function ShipmentBulkUpload() {
  return (
    <Drawer>
      <DrawerTrigger>
        <Button className="h-8">
          <UploadIcon className="mr-2 h-4 w-4" />
          <span>Carga masiva</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-xl">
          <DrawerHeader>
            <DrawerTitle className="text-card-foreground">
              Carga masiva
            </DrawerTitle>
            <DrawerDescription>
              Esta acción subirá las entregas programadas mediante un template
              de excel.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button>Subir</Button>
            <DrawerClose>
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
