import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

import { CreateCostumerForm } from './create-costumer-form'

export function CreateCostumerButton() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="h-8">Nuevo</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Nuevo Cliente</SheetTitle>
          <SheetDescription>
            Complete el siguiente formulario para crear un nuevo cliente. Por el
            momento solo se permite la creación para clientes de La Sirena.
          </SheetDescription>
        </SheetHeader>
        <CreateCostumerForm />
      </SheetContent>
    </Sheet>
  )
}
