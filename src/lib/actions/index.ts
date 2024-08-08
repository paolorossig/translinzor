'use server'

import { unstable_noStore as noStore, revalidatePath } from 'next/cache'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { count, countDistinct, eq, gte, lte } from 'drizzle-orm'

import {
  getOrderStatus,
  isOrderFinalized,
  OrderStatus,
  summarizeOrderStatus,
} from '@/components/modules/shipments/order-status'
import { clientIds } from '@/config/clients'
import { db } from '@/db'
import {
  companies,
  costumers,
  orders,
  shipments,
  type CreateOrder,
} from '@/db/schema'
import { catchError } from '@/lib/utils'
import type { CreateCostumerInput } from '@/lib/validations/costumers'
import type {
  AssignShipmentInput,
  CreateBulkShipmentsInput,
  UpdateOrderStatusInput,
} from '@/lib/validations/shipments'
import type { Option } from '@/types'

export async function getCostumers({ clientId }: { clientId?: string | null }) {
  return await db.query.costumers.findMany({
    columns: {
      internalCode: true,
      channel: true,
    },
    with: {
      company: true,
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
      orders: {
        with: {
          costumer: {
            with: { company: true },
          },
        },
      },
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

const minBundleSizeError = 'bundledOrders debe contener al menos un registro'
const costumerNotFoundError =
  'Al menos 1 cliente no ha sido encontrado en la base de datos'
const orderAlreadyExistsError =
  'Al menos 1 pedido ya existe en la base de datos'

const respondError = (message: string) => {
  console.log('responding error ->', message)
  return {
    success: false as const,
    message,
  }
}

export async function createBulkShipments(input: CreateBulkShipmentsInput) {
  console.log('creating bulk shipments')
  const { clientId, deliveryDate, bundledOrders } = input
  console.log('input:', {
    clientId,
    deliveryDate,
    bundledOrders: bundledOrders.length,
  })

  if (!bundledOrders.length) return respondError(minBundleSizeError)
  console.log('min bundle size passed')

  const uniqueInternalCodes = [
    ...new Set(bundledOrders.map((order) => order.internalCode)),
  ]

  const foundCostumers = await db.query.costumers.findMany({
    columns: {
      id: true,
      internalCode: true,
    },
    where: (costumers, { and, eq, inArray }) =>
      and(
        inArray(costumers.internalCode, uniqueInternalCodes),
        eq(costumers.clientId, clientId),
      ),
  })

  if (foundCostumers.length !== uniqueInternalCodes.length) {
    const missingCostumerIds = uniqueInternalCodes.filter(
      (code) =>
        !foundCostumers.some((costumer) => costumer.internalCode === code),
    )
    console.log('Missing costumer IDs:', missingCostumerIds)
    return respondError(costumerNotFoundError)
  }

  console.log('all costumers found')

  const uniqueClientOrderIds = bundledOrders.map((order) => order.clientOrderId)

  const existingOrders = await db.query.orders.findMany({
    columns: {
      id: true,
    },
    where: (orders, { and, inArray }) =>
      and(
        inArray(orders.clientOrderId, uniqueClientOrderIds),
        inArray(
          orders.costumerId,
          foundCostumers.map((costumer) => costumer.id),
        ),
      ),
  })

  if (existingOrders.length) return respondError(orderAlreadyExistsError)
  console.log('all orders in the file do not exist yet')

  const internalCodeToCostumerIdMap = foundCostumers.reduce(
    (acc, curr) => {
      acc[curr.internalCode] = curr.id
      return acc
    },
    {} as Record<string, number>,
  )

  const shipmentsOrdersMap = bundledOrders.reduce(
    (acc, curr) => {
      const { route, internalCode, clientOrderId, totalValue, ...rest } = curr
      const order = {
        clientOrderId,
        costumerId: internalCodeToCostumerIdMap[internalCode]!,
        totalValue: totalValue.toFixed(2),
        ...rest,
      }

      acc[route] = [...(acc[route] ?? []), order]
      return acc
    },
    {} as Record<string, Omit<CreateOrder, 'shipmentId'>[]>,
  )

  try {
    await db.transaction(async (tx) => {
      for (const [route, bundledOrders] of Object.entries(shipmentsOrdersMap)) {
        const [createdShipment] = await tx
          .insert(shipments)
          .values({
            clientId,
            deliveryDate,
            route,
          })
          .returning({ id: shipments.id })

        if (!createdShipment) {
          throw new Error('create shipment failed')
        }

        console.log('created shipment id:', createdShipment.id)

        await tx.insert(orders).values(
          bundledOrders.map((order) => ({
            ...order,
            shipmentId: createdShipment.id,
          })),
        )
        console.log('# created orders:', bundledOrders.length)
      }
    })
    console.log('transaction finished')

    revalidatePath('/shipments')

    return { success: true as const }
  } catch (error) {
    const err = catchError(error)
    return respondError(err)
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

export async function assignShipment(input: AssignShipmentInput) {
  console.log('assigning shipment')
  console.log('input:', input)

  const driverId = Number(input.driverId)
  const transportUnitId = Number(input.transportUnitId)
  const shipmentId = Number(input.shipmentId)

  const [shipment] = await db.query.shipments.findMany({
    columns: {
      id: true,
      driverId: true,
      transportUnitId: true,
    },
    where: (shipments, { eq }) => eq(shipments.id, shipmentId),
  })

  if (!shipment) {
    return respondError('El envío no existe')
  }

  try {
    await db
      .update(shipments)
      .set({ driverId, transportUnitId })
      .where(eq(shipments.id, shipmentId))

    revalidatePath('/shipments')

    return { success: true as const }
  } catch (error) {
    const err = catchError(error)
    return respondError(err)
  }
}

export async function startShipment(shipmentId: number) {
  console.log('starting shipment:', shipmentId)

  const [shipment] = await db.query.shipments.findMany({
    columns: {
      id: true,
      startedAt: true,
    },
    where: (shipments, { eq }) => eq(shipments.id, shipmentId),
  })

  if (!shipment) {
    return respondError('El envío no existe')
  }

  if (shipment.startedAt) {
    return respondError('El envío ya ha sido iniciado')
  }

  try {
    await db.transaction(async (tx) => {
      const startedAt = new Date()

      await tx
        .update(orders)
        .set({ startedAt })
        .where(eq(orders.shipmentId, shipmentId))

      await tx
        .update(shipments)
        .set({ startedAt })
        .where(eq(shipments.id, shipmentId))
    })

    revalidatePath('/shipments')

    return { success: true as const }
  } catch (error) {
    const err = catchError(error)
    return respondError(err)
  }
}

export async function deleteShipment(shipmentId: number) {
  console.log('deleting shipment:', shipmentId)

  const [shipment] = await db.query.shipments.findMany({
    columns: { id: true },
    where: (shipments, { eq }) => eq(shipments.id, shipmentId),
  })

  if (!shipment) {
    return respondError('El envío no existe')
  }

  try {
    await db.delete(shipments).where(eq(shipments.id, shipmentId))

    revalidatePath('/shipments')

    return { success: true as const }
  } catch (error) {
    const err = catchError(error)
    return respondError(err)
  }
}

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

export async function updateOrderStatus(input: UpdateOrderStatusInput) {
  console.log('updating order status')
  console.log('input:', input)

  const [order] = await db.query.orders.findMany({
    where: (orders, { eq }) => eq(orders.id, input.orderId),
  })

  if (!order) {
    return respondError('El pedido no existe')
  }

  if (isOrderFinalized(order)) {
    return respondError('El pedido ya ha sido finalizado')
  }

  try {
    await db.transaction(async (tx) => {
      await tx
        .update(orders)
        .set(
          input.status === OrderStatus.REFUSED
            ? {
                refusedAt: new Date(),
                refusedReason: input.refusedReason,
              }
            : {
                deliveredAt: new Date(),
              },
        )
        .where(eq(orders.id, input.orderId))
    })

    revalidatePath('/shipments')

    return { success: true as const }
  } catch (error) {
    const err = catchError(error)
    return respondError(err)
  }
}

export async function createLaSirenaCostumer(input: CreateCostumerInput) {
  const [company] = await db.query.companies.findMany({
    where: (companies, { eq, or }) =>
      or(
        eq(companies.name, input.company_name),
        input.company_ruc ? eq(companies.ruc, input.company_ruc) : undefined,
      ),
  })

  if (company) {
    return respondError('El cliente ya existe en la base de datos')
  }

  const [costumer] = await db.query.costumers.findMany({
    where: (costumers, { eq }) =>
      eq(costumers.internalCode, input.internal_code),
  })

  if (costumer) {
    return respondError('El cliente ya existe en la base de datos')
  }

  try {
    await db.transaction(async (tx) => {
      const [createdCompany] = await tx
        .insert(companies)
        .values({
          name: input.company_name,
          ruc: input.company_ruc,
        })
        .returning({ id: companies.id })

      if (!createdCompany) {
        throw new Error('create company failed')
      }

      await tx.insert(costumers).values({
        clientId: clientIds.laSirena,
        companyId: createdCompany.id,
        internalCode: input.internal_code,
        channel: input.channel,
      })
    })

    revalidatePath('/costumers')

    return { success: true as const }
  } catch (error) {
    const err = catchError(error)
    return respondError(err)
  }
}

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
