import {
  CheckCircle2Icon,
  CircleIcon,
  TimerIcon,
  XCircleIcon,
} from 'lucide-react'

import { type Order } from '@/db/schema'
import { type Option } from '@/types'

export enum OrderStatus {
  SCHEDULED = 'scheduled',
  PENDING = 'pending',
  DELIVERED = 'delivered',
  REFUSED = 'refused',
}

export const orderStatusOptions: Option<OrderStatus>[] = [
  { label: 'Agendado', value: OrderStatus.SCHEDULED, icon: CircleIcon },
  { label: 'Pendiente', value: OrderStatus.PENDING, icon: TimerIcon },
  { label: 'Entregado', value: OrderStatus.DELIVERED, icon: CheckCircle2Icon },
  { label: 'Rechazado', value: OrderStatus.REFUSED, icon: XCircleIcon },
]

export function getOrderStatus(order: Order): OrderStatus {
  if (order.refusedAt) {
    return OrderStatus.REFUSED
  } else if (order.deliveredAt) {
    return OrderStatus.DELIVERED
  } else if (order.startedAt) {
    return OrderStatus.PENDING
  }

  return OrderStatus.SCHEDULED
}
