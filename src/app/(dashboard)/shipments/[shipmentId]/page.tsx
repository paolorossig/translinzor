import { CalendarIcon, CarIcon, LayersIcon, UserRoundIcon } from 'lucide-react'

import {
  DataTable,
  DataTableFacetedFilter,
  DataTableFilterInput,
  DataTableHeader,
  DataTableResetFilter,
  DataTableWrapper,
} from '@/components/ui/data-table'
import { getShipmentById } from '@/lib/actions'
import { Option } from '@/types'

import { columns } from './columns'

interface ShipmentPageProps {
  params: { shipmentId: string }
}

export default async function ShipmentPage({
  params: { shipmentId },
}: ShipmentPageProps) {
  const shipment = await getShipmentById(Number(shipmentId))
  const { orders } = shipment

  const costumers = orders.reduce((acc, curr) => {
    const costumerName = curr.costumer.company.name

    if (!acc.some((c) => c.label === costumerName)) {
      acc.push({ value: costumerName, label: costumerName })
    }

    return acc
  }, [] as Option[])

  return (
    <>
      <h1 className="scroll-m-20 pb-2 text-2xl font-medium tracking-tight text-primary">
        Entrega # {shipmentId}
      </h1>
      <section className="space-y-4">
        <div>
          <h2 className="mb-2 text-lg font-medium text-primary/90">Resumen</h2>
          <div className="flex items-center space-x-1 text-card-foreground">
            <CalendarIcon className="h-4 w-4" />
            <span>{shipment.deliveryDate.toLocaleDateString('es')}</span>
          </div>
          <div className="flex items-center space-x-1 text-card-foreground">
            <CarIcon className="h-4 w-4" />
            <span>
              {shipment.transportUnit
                ? `${shipment.transportUnit.type} - ${shipment.transportUnit.licensePlate}`
                : 'No asignado'}
            </span>
          </div>
          <div className="flex items-center space-x-1 text-card-foreground">
            <UserRoundIcon className="h-4 w-4" />
            <span>{shipment.driverId ? 'Asignado' : 'No asignado'}</span>
          </div>
          <div className="flex items-center space-x-1 text-card-foreground">
            <LayersIcon className="h-4 w-4" />
            <span>
              {`${shipment.orders.length} ${shipment.orders.length > 1 ? 'órdenes' : 'orden'}`}
            </span>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-medium text-primary/90">Órdenes</h2>
          <DataTableWrapper columns={columns} data={orders}>
            <DataTableHeader>
              <DataTableFilterInput
                columnName="orderNumber"
                placeholder="Filtrar órdenes..."
              />
              <div className="flex w-full space-x-2 sm:w-fit">
                <DataTableFacetedFilter
                  columnName="costumer_company.name"
                  title="Cliente"
                  options={costumers}
                />
                <DataTableResetFilter />
              </div>
            </DataTableHeader>
            <DataTable />
          </DataTableWrapper>
        </div>
      </section>
    </>
  )
}
