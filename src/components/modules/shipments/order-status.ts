import type { Order } from '@/db/schema'
import type { Option } from '@/types'

export enum OrderStatus {
  SCHEDULED = 'scheduled',
  PENDING = 'pending',
  DELIVERED = 'delivered',
  REFUSED = 'refused',
}

export const orderStatusOptions: Option<OrderStatus>[] = [
  { label: 'Agendado', value: OrderStatus.SCHEDULED, icon: 'scheduled' },
  { label: 'Pendiente', value: OrderStatus.PENDING, icon: 'pending' },
  { label: 'Entregado', value: OrderStatus.DELIVERED, icon: 'delivered' },
  { label: 'Rechazado', value: OrderStatus.REFUSED, icon: 'refused' },
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

export function isOrderFinalized(order: Order): boolean {
  return !!order.deliveredAt || !!order.refusedAt
}
