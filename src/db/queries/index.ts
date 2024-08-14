import { unstable_noStore as noStore } from 'next/cache'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import {
  and,
  asc,
  count,
  countDistinct,
  desc,
  eq,
  gte,
  isNull,
  lte,
} from 'drizzle-orm'

import {
  getOrderStatus,
  isOrderFinalized,
  summarizeOrderStatus,
} from '@/components/modules/shipments/order-status'
import { db } from '@/db'
import {
  costumers,
  drivers,
  orders,
  shipments,
  transportUnits,
} from '@/db/schema'
import type { Option } from '@/types'

export async function getCostumers({ clientId }: { clientId?: string | null }) {
  return await db.query.costumers.findMany({
    columns: {
      internalCode: true,
      name: true,
      channel: true,
    },
    where: clientId ? eq(costumers.clientId, clientId) : undefined,
  })
}

export type CostumersByClient = Awaited<ReturnType<typeof getCostumers>>

export async function getShipmentsByClientId(clientId: string | null) {
  noStore()

  const _shipments = await db.query.shipments.findMany({
    columns: {
      id: true,
      clientId: true,
      deliveryDate: true,
      route: true,
      createdAt: true,
      startedAt: true,
      driverId: true,
      transportUnitId: true,
    },
    with: {
      orders: true,
      driver: true,
      transportUnit: true,
    },
    orderBy: [desc(shipments.deliveryDate), asc(shipments.id)],
    where: clientId ? eq(shipments.clientId, clientId) : undefined,
  })

  return _shipments.map((shipment) => {
    const { orders, ...restShipment } = shipment

    const ordersSummary = {
      delivered: orders.filter((order) => order.deliveredAt).length,
      refused: orders.filter((order) => order.refusedAt).length,
      total: orders.length,
    }

    return { ...restShipment, ordersSummary }
  })
}

export type ShipmentsByClient = Awaited<
  ReturnType<typeof getShipmentsByClientId>
>

export async function getShipmentMetrics({
  date,
  clientId,
}: {
  date: Date
  clientId?: string | null
}) {
  noStore()

  const _shipments = await db.query.shipments.findMany({
    columns: { id: true, route: true },
    with: { orders: true },
    where: and(
      eq(shipments.deliveryDate, date),
      clientId ? eq(shipments.clientId, clientId) : undefined,
    ),
    orderBy: asc(shipments.route),
  })

  return _shipments.map(({ id, route, orders }) => {
    return { id, route, ...summarizeOrderStatus(orders) }
  })
}

export type ShipmentMetrics = Awaited<ReturnType<typeof getShipmentMetrics>>

export async function getHistoryShipmentMetrics({
  from,
  to,
  clientId,
}: {
  from: Date
  to: Date
  clientId?: string | null
}) {
  noStore()

  const _shipments = await db.query.shipments.findMany({
    columns: { id: true, deliveryDate: true },
    with: { orders: true },
    where: and(
      clientId ? eq(shipments.clientId, clientId) : undefined,
      gte(shipments.deliveryDate, from),
      lte(shipments.deliveryDate, to),
    ),
  })

  const groupedByDeliveryDate = _shipments.reduce(
    (acc, curr) => {
      const key = format(curr.deliveryDate, 'yyyy-MM-dd')

      if (acc[key]) {
        acc[key]?.orders.push(...curr.orders)
      } else {
        acc[key] = curr
      }

      return acc
    },
    {} as Record<string, (typeof _shipments)[number]>,
  )

  return Object.values(groupedByDeliveryDate).map(
    ({ id, deliveryDate, orders }) => ({
      id,
      deliveryDate: format(deliveryDate, 'dd/MM/yyyy'),
      ...summarizeOrderStatus(orders),
    }),
  )
}

export type HistoryShipmentMetrics = Awaited<
  ReturnType<typeof getHistoryShipmentMetrics>
>

export async function getShipmentById(shipmentId: number) {
  const shipment = await db.query.shipments.findFirst({
    with: {
      orders: { with: { costumer: true } },
      driver: true,
      transportUnit: true,
    },
    where: eq(shipments.id, shipmentId),
  })

  if (!shipment) {
    notFound()
  }

  return shipment
}

export type ShipmentById = Awaited<ReturnType<typeof getShipmentById>>

export async function getDriversAndTransportAvailability(date: Date) {
  const driversAvailability = await db
    .select({
      id: drivers.id,
      name: drivers.name,
      lastName: drivers.lastName,
      available: isNull(shipments.id),
    })
    .from(drivers)
    .leftJoin(
      shipments,
      and(eq(drivers.id, shipments.driverId), eq(shipments.deliveryDate, date)),
    )
    .orderBy(drivers.lastName)

  const transportUnitsAvailability = await db
    .select({
      id: transportUnits.id,
      brand: transportUnits.brand,
      licensePlate: transportUnits.licensePlate,
      available: isNull(shipments.id),
    })
    .from(transportUnits)
    .leftJoin(
      shipments,
      and(
        eq(transportUnits.id, shipments.transportUnitId),
        eq(shipments.deliveryDate, date),
      ),
    )
    .orderBy(transportUnits.brand)

  return {
    drivers: driversAvailability,
    transportUnits: transportUnitsAvailability,
  }
}

export async function getOrderStatusOptions(shipmentId: number) {
  const orders = await db.query.orders.findMany({
    where: (order, { eq }) => eq(order.shipmentId, shipmentId),
    orderBy: (order, { asc }) => asc(order.orderNumber),
  })

  const orderStatusOptions: Option[] = orders.map((order) => ({
    label: order.orderNumber,
    value: order.id.toString(),
    icon: getOrderStatus(order),
    disabled: isOrderFinalized(order),
  }))

  return orderStatusOptions
}

export async function trackOrder(code: string) {
  const order = await db.query.orders.findFirst({
    where: eq(orders.clientOrderId, Number(code)),
  })

  if (!order) {
    return {
      success: false as const,
      message: 'El pedido que está buscando no existe',
    }
  }

  return {
    success: true as const,
    order: { ...order, status: getOrderStatus(order) },
  }
}

export async function getMetrics() {
  const totalShipments = await db
    .select({ count: count(shipments.id) })
    .from(shipments)

  const totalOrders = await db.select({ count: count(orders.id) }).from(orders)

  const totalDaysWithShipments = await db
    .select({ count: countDistinct(shipments.deliveryDate) })
    .from(shipments)

  return {
    totalShipments: totalShipments[0]?.count ?? 0,
    totalOrders: totalOrders[0]?.count ?? 0,
    totalDaysWithShipments: totalDaysWithShipments[0]?.count ?? 0,
  }
}
