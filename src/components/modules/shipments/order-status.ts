import type { Order } from '@/db/schema'
import { getRates } from '@/lib/utils'
import type { Option } from '@/types'

export enum OrderStatus {
  SCHEDULED = 'scheduled',
  ON_ROUTE = 'on_route',
  DELIVERED = 'delivered',
  REFUSED = 'refused',
}

export const orderStatusOptions: Option<OrderStatus>[] = [
  { label: 'Agendado', value: OrderStatus.SCHEDULED, icon: 'scheduled' },
  { label: 'En ruta', value: OrderStatus.ON_ROUTE, icon: 'on_route' },
  { label: 'Entregado', value: OrderStatus.DELIVERED, icon: 'delivered' },
  { label: 'Rechazado', value: OrderStatus.REFUSED, icon: 'refused' },
]

export function getOrderStatus(order: Order) {
  if (order.refusedAt) {
    return OrderStatus.REFUSED
  } else if (order.deliveredAt) {
    return OrderStatus.DELIVERED
  } else if (order.startedAt) {
    return OrderStatus.ON_ROUTE
  }

  return OrderStatus.SCHEDULED
}

export function isOrderFinalized(order: Order) {
  return !!order.deliveredAt || !!order.refusedAt
}

export function summarizeOrderStatus(orders: Order[]) {
  const total = orders.length
  const orderStatusCount = orders.reduce(
    (acc, order) => {
      const status = getOrderStatus(order)
      acc[status] += 1
      return acc
    },
    {
      [OrderStatus.SCHEDULED]: 0,
      [OrderStatus.ON_ROUTE]: 0,
      [OrderStatus.DELIVERED]: 0,
      [OrderStatus.REFUSED]: 0,
    },
  )

  const [scheduledRate, onRouteRate, deliveryRate, refusedRate] = getRates(
    orderStatusCount.scheduled,
    orderStatusCount.on_route,
    orderStatusCount.delivered,
    orderStatusCount.refused,
  )

  const rates = {
    deliveryRate,
    refusedRate,
    onRouteRate,
    scheduledRate,
  }

  return { ...orderStatusCount, total, ...rates }
}
