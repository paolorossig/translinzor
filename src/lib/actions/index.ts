'use server'

import { unstable_noStore as noStore, revalidatePath } from 'next/cache'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { count, countDistinct, gte, lte } from 'drizzle-orm'

import {
  getOrderStatus,
  isOrderFinalized,
  summarizeOrderStatus,
} from '@/components/modules/shipments/order-status'
import { db } from '@/db'
import {
  assignShipment,
  createBulkShipments,
  createCostumer,
  deleteShipment,
  startShipment,
  updateOrderStatus,
} from '@/db/mutations'
import { orders, shipments } from '@/db/schema'
import type { Option } from '@/types'

import { authActionClient } from './safe-action'
import {
  assignShipmentSchema,
  createBulkShipmentsSchema,
  createCostumerSchema,
  modifyShipmentSchema,
  updateOrderStatusSchema,
} from './schema'

export const createBulkShipmentsAction = authActionClient
  .schema(createBulkShipmentsSchema)
  .action(async ({ parsedInput: payload }) => {
    await createBulkShipments(payload)

    revalidatePath('/shipments')
  })

export const assignShipmentAction = authActionClient
  .schema(assignShipmentSchema)
  .action(async ({ parsedInput: payload }) => {
    await assignShipment({
      driverId: Number(payload.driverId),
      transportUnitId: Number(payload.transportUnitId),
      shipmentId: Number(payload.shipmentId),
    })

    revalidatePath('/shipments')
  })

export const startShipmentAction = authActionClient
  .schema(modifyShipmentSchema)
  .action(async ({ parsedInput: payload }) => {
    await startShipment(payload)

    revalidatePath('/shipments')
  })

export const deleteShipmentAction = authActionClient
  .schema(modifyShipmentSchema)
  .action(async ({ parsedInput: payload }) => {
    await deleteShipment(payload)

    revalidatePath('/shipments')
  })

export const updateOrderStatusAction = authActionClient
  .schema(updateOrderStatusSchema)
  .action(async ({ parsedInput: payload }) => {
    await updateOrderStatus(payload)

    revalidatePath('/shipments')
  })

export const createCostumerAction = authActionClient
  .schema(createCostumerSchema)
  .action(async ({ parsedInput: payload }) => {
    await createCostumer(payload)

    revalidatePath('/shipments')
  })

export async function getCostumers({ clientId }: { clientId?: string | null }) {
  return await db.query.costumers.findMany({
    columns: {
      internalCode: true,
      name: true,
      channel: true,
    },
    where: (costumers, { eq }) =>
      clientId ? eq(costumers.clientId, clientId) : undefined,
  })
}

export type CostumersByClient = Awaited<ReturnType<typeof getCostumers>>

export async function getShipmentsByClientId(clientId: string | null) {
  noStore()

  console.log(
    clientId
      ? `getting shipments by client id: ${clientId}`
      : 'getting all shipments for admin user',
  )

  const shipments = await db.query.shipments.findMany({
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
    orderBy: (shipments, { desc, asc }) => [
      desc(shipments.deliveryDate),
      asc(shipments.id),
    ],
    ...(clientId
      ? { where: (shipments, { eq }) => eq(shipments.clientId, clientId) }
      : {}),
  })

  return shipments.map((shipment) => {
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

interface ShipmentMetricsInput {
  clientId?: string | null
  date: Date
}

export async function getShipmentMetrics(input: ShipmentMetricsInput) {
  noStore()

  console.log('getting shipment metrics for:', input)

  const shipments = await db.query.shipments.findMany({
    columns: {
      id: true,
      route: true,
    },
    with: {
      orders: true,
    },
    where: (shipments, { eq, and }) =>
      and(
        input.clientId ? eq(shipments.clientId, input.clientId) : undefined,
        eq(shipments.deliveryDate, input.date),
      ),
  })

  const orderStatusCountByShipment = shipments.map(({ id, route, orders }) => {
    const ordersSummary = summarizeOrderStatus(orders)

    return {
      id,
      route,
      ...ordersSummary,
    }
  })

  return orderStatusCountByShipment
}

export type ShipmentMetrics = Awaited<ReturnType<typeof getShipmentMetrics>>

interface HistoryShipmentMetricsInput {
  clientId?: string | null
  from: Date
  to: Date
}

export async function getHistoryShipmentMetrics(
  input: HistoryShipmentMetricsInput,
) {
  noStore()

  console.log('getting history shipments metrics for:', input)

  const shipments = await db.query.shipments.findMany({
    columns: {
      id: true,
      deliveryDate: true,
    },
    with: {
      orders: true,
    },
    where: (shipments, { eq, and }) =>
      and(
        input.clientId ? eq(shipments.clientId, input.clientId) : undefined,
        gte(shipments.deliveryDate, input.from),
        lte(shipments.deliveryDate, input.to),
      ),
  })

  const groupedByDeliveryDate = shipments.reduce(
    (acc, curr) => {
      const key = format(curr.deliveryDate, 'yyyy-MM-dd')

      if (acc[key]) {
        acc[key]?.orders.push(...curr.orders)
      } else {
        acc[key] = curr
      }

      return acc
    },
    {} as Record<string, (typeof shipments)[number]>,
  )

  const orderStatusCountByShipment = Object.values(groupedByDeliveryDate).map(
    ({ id, deliveryDate, orders }) => {
      const ordersSummary = summarizeOrderStatus(orders)

      return {
        id,
        deliveryDate: format(deliveryDate, 'dd/MM/yyyy'),
        ...ordersSummary,
      }
    },
  )

  return orderStatusCountByShipment
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
    where: (shipments, { eq }) => eq(shipments.id, shipmentId),
  })

  if (!shipment) {
    notFound()
  }

  return shipment
}

export type ShipmentById = Awaited<ReturnType<typeof getShipmentById>>

const respondError = (message: string) => {
  console.log('responding error ->', message)
  return {
    success: false as const,
    message,
  }
}

export async function getAvailableAssignmentOptions(date: Date) {
  console.log('getting available assignment options')
  console.log('date:', date)

  const drivers = await db.query.drivers.findMany({
    columns: {
      id: true,
      name: true,
      lastName: true,
    },
  })

  const transportUnits = await db.query.transportUnits.findMany({
    columns: {
      id: true,
      brand: true,
      licensePlate: true,
    },
  })

  const shipments = await db.query.shipments.findMany({
    columns: {
      id: true,
      driverId: true,
      transportUnitId: true,
    },
    where: (shipments, { eq }) => eq(shipments.deliveryDate, date),
  })

  const busyIds = shipments.reduce(
    (acc, shipment) => {
      if (shipment.driverId) {
        acc.drivers.push(shipment.driverId)
      }
      if (shipment.transportUnitId) {
        acc.transportUnits.push(shipment.transportUnitId)
      }
      return acc
    },
    { drivers: [] as number[], transportUnits: [] as number[] },
  )

  const driverOptions: Option[] = drivers.map((driver) => ({
    label: `${driver.lastName}, ${driver.name}`,
    value: driver.id.toString(),
    disabled: busyIds.drivers.includes(driver.id),
  }))

  const transportUnitOptions: Option[] = transportUnits.map((unit) => ({
    label: `${unit.brand} - ${unit.licensePlate}`,
    value: unit.id.toString(),
    disabled: busyIds.transportUnits.includes(unit.id),
  }))

  return { drivers: driverOptions, transportUnits: transportUnitOptions }
}

export type AssignmentInfo = Awaited<
  ReturnType<typeof getAvailableAssignmentOptions>
>

export async function getOrderStatusOptionsByShipmentId(shipmentId: number) {
  console.log('getting orders by shipment id:', shipmentId)

  const orders = await db.query.orders.findMany({
    where: (order, { eq }) => eq(order.shipmentId, shipmentId),
  })

  const orderStatusOptions: Option<number>[] = orders.map((order) => ({
    label: order.orderNumber,
    value: order.id,
    icon: getOrderStatus(order),
    disabled: isOrderFinalized(order),
  }))

  return orderStatusOptions
}

export type OrderStatusOptions = Awaited<
  ReturnType<typeof getOrderStatusOptionsByShipmentId>
>

export async function trackOrder(code: string) {
  const order = await db.query.orders.findFirst({
    where: (orders, { eq }) => eq(orders.clientOrderId, Number(code)),
  })

  if (!order) {
    return respondError('El pedido que está buscando no existe')
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
