'use server'

import { unstable_noStore as noStore, revalidatePath } from 'next/cache'
import { notFound } from 'next/navigation'
import { eq } from 'drizzle-orm'

import {
  getOrderStatus,
  isOrderFinalized,
  OrderStatus,
} from '@/components/modules/shipments/order-status'
import { db } from '@/db'
import {
  drivers,
  orders,
  shipments,
  transportUnits,
  type CreateOrder,
} from '@/db/schema'
import { catchError } from '@/lib/utils'
import {
  type AssignShipmentInput,
  type CreateBulkShipmentsInput,
  type UpdateOrderStatusInput,
} from '@/lib/validations/shipments'
import { type Option } from '@/types'

export async function getCostumersByClientId(clientId: string) {
  return await db.query.costumers.findMany({
    columns: {
      internalCode: true,
      channel: true,
    },
    with: {
      company: true,
    },
    where: (costumers, { eq }) => eq(costumers.clientId, clientId),
  })
}

export type CostumersByClient = Awaited<
  ReturnType<typeof getCostumersByClientId>
>

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

  const costumersIds = await db.query.costumers.findMany({
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

  if (costumersIds.length !== uniqueInternalCodes.length)
    return respondError(costumerNotFoundError)
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
          costumersIds.map((costumer) => costumer.id),
        ),
      ),
  })

  if (existingOrders.length) return respondError(orderAlreadyExistsError)
  console.log('all orders in the file do not exist yet')

  const internalCodeToCostumerIdMap = costumersIds.reduce(
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
    {} as Record<string, CreateOrder[]>,
  )

  try {
    await db.transaction(async (tx) => {
      for (const bundledOrders of Object.values(shipmentsOrdersMap)) {
        const [createdShipment] = await tx
          .insert(shipments)
          .values({
            clientId,
            deliveryDate,
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

export async function getAssignmentOptions() {
  const drivers = await db.query.drivers.findMany({
    columns: {
      id: true,
      name: true,
      lastName: true,
      isActive: true,
    },
    orderBy: (drivers, { desc }) => desc(drivers.isActive),
  })

  const transportUnits = await db.query.transportUnits.findMany({
    columns: {
      id: true,
      brand: true,
      licensePlate: true,
      isActive: true,
    },
    orderBy: (drivers, { desc }) => desc(drivers.isActive),
  })

  const driverOptions: Option[] = drivers.map((driver) => ({
    label: `${driver.lastName}, ${driver.name}`,
    value: driver.id.toString(),
    disabled: !driver.isActive,
  }))

  const transportUnitOptions: Option[] = transportUnits.map((unit) => ({
    label: `${unit.brand} - ${unit.licensePlate}`,
    value: unit.id.toString(),
    disabled: !unit.isActive,
  }))

  return { drivers: driverOptions, transportUnits: transportUnitOptions }
}

export type AssignmentInfo = Awaited<ReturnType<typeof getAssignmentOptions>>

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
    await db.transaction(async (tx) => {
      if (shipment.driverId && shipment.driverId !== driverId) {
        await tx
          .update(drivers)
          .set({ isActive: true })
          .where(eq(drivers.id, shipment.driverId))
      }

      if (
        shipment.transportUnitId &&
        shipment.transportUnitId !== transportUnitId
      ) {
        await tx
          .update(transportUnits)
          .set({ isActive: true })
          .where(eq(transportUnits.id, shipment.transportUnitId))
      }

      await tx
        .update(drivers)
        .set({ isActive: false })
        .where(eq(drivers.id, driverId))

      await tx
        .update(transportUnits)
        .set({ isActive: false })
        .where(eq(transportUnits.id, transportUnitId))

      await tx
        .update(shipments)
        .set({ driverId, transportUnitId })
        .where(eq(shipments.id, shipmentId))
    })

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
