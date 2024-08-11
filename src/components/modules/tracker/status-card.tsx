import { Icons } from '@/components/icons'
import {
  OrderStatus,
  orderStatusOptions,
} from '@/components/modules/shipments/order-status'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { trackOrder } from '@/db/queries'
import { cn } from '@/lib/utils'

interface StatusCardProps {
  code: string
}

export default async function StatusCard({ code }: StatusCardProps) {
  const response = await trackOrder(code)

  if (!response.success) {
    return (
      <div className="text-center text-red-500">
        <p className="text-lg font-bold">Error</p>
        <p>{response.message}</p>
      </div>
    )
  }

  const order = response.order
  const status = orderStatusOptions.find(
    (option) => option.value === order.status,
  )!
  const Icon = status.icon && Icons[status.icon]
  const deliveryDate = order.deliveredAt?.toLocaleString('es', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado del envío</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 [&_h5]:text-sm [&_h5]:font-medium [&_h5]:text-muted-foreground [&_span]:text-lg [&_span]:font-medium">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h5>Número de orden</h5>
            <span>{order.orderNumber}</span>
          </div>
          <div>
            <h5>Fecha de entrega</h5>
            <span>{deliveryDate}</span>
          </div>
        </div>
        <div>
          <h5>Current Location</h5>
          <span className="text-balance">
            {order.destinationAddress}, {order.destinationDistrict}
          </span>
        </div>
        <div
          className={cn(
            'flex items-center justify-end',
            order.status === OrderStatus.DELIVERED
              ? 'text-green-600'
              : 'text-muted-foreground',
          )}
        >
          {Icon && <Icon className="mr-2 h-4 w-4 shrink-0" />}
          <p className="text-nowrap">{status.label}</p>
        </div>
      </CardContent>
    </Card>
  )
}
