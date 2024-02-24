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

export function getOrderStatus(order: Order) {
  if (order.refusedAt) {
    return OrderStatus.REFUSED
  } else if (order.deliveredAt) {
    return OrderStatus.DELIVERED
  } else if (order.startedAt) {
    return OrderStatus.PENDING
  }

  return OrderStatus.SCHEDULED
}

export function isOrderFinalized(order: Order) {
  return !!order.deliveredAt || !!order.refusedAt
}

export function summarizeOrderStatus(orders: Order[]) {
  const orderStatusCount = orders.reduce(
    (acc, order) => {
      const status = getOrderStatus(order)
      acc[status] += 1
      return acc
    },
    {
      [OrderStatus.SCHEDULED]: 0,
      [OrderStatus.PENDING]: 0,
      [OrderStatus.DELIVERED]: 0,
      [OrderStatus.REFUSED]: 0,
    },
  )

  const total = orders.length

  const rates = {
    deliveryRate: Math.round((orderStatusCount.delivered / total) * 100),
    refusedRate: Math.round((orderStatusCount.refused / total) * 100),
    pendingRate: Math.round((orderStatusCount.pending / total) * 100),
  }

  return { ...orderStatusCount, total, ...rates }
}
