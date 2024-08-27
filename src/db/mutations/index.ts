import { and, eq, inArray } from 'drizzle-orm'

import {
  isOrderFinalized,
  OrderStatus,
} from '@/components/modules/shipments/order-status'
import { db } from '@/db'
import { costumers, orders, shipments, type CreateOrder } from '@/db/schema'
import { uniqueValues } from '@/lib/utils'
import type { ShipmentBulkUploadRow } from '@/lib/validations/shipments'

interface CreateBulkShipmentsParams {
  clientId: string
  deliveryDate: Date
  bundledOrders: ShipmentBulkUploadRow[]
}

export async function createBulkShipments({
  clientId,
  deliveryDate,
  bundledOrders,
}: CreateBulkShipmentsParams) {
  const internalCodes = uniqueValues(bundledOrders, (o) => o.internalCode)
  const foundCostumers = await db.query.costumers.findMany({
    columns: {
      id: true,
      internalCode: true,
    },
    where: and(
      inArray(costumers.internalCode, internalCodes),
      eq(costumers.clientId, clientId),
    ),
  })

  if (foundCostumers.length !== internalCodes.length) {
    const missingCostumerIds = internalCodes.filter(
      (code) =>
        !foundCostumers.some((costumer) => costumer.internalCode === code),
    )
    console.log('Missing costumer IDs:', missingCostumerIds)
    throw new Error(
      'Al menos 1 cliente no ha sido encontrado en la base de datos',
    )
  }

  console.log('all costumers found')

  const clientOrderIds = bundledOrders.map((order) => order.clientOrderId)

  const existingOrders = await db.query.orders.findMany({
    columns: {
      id: true,
    },
    where: and(
      inArray(orders.clientOrderId, clientOrderIds),
      inArray(
        orders.costumerId,
        foundCostumers.map((costumer) => costumer.id),
      ),
    ),
  })

  if (existingOrders.length) {
    throw new Error('Al menos 1 pedido ya existe en la base de datos')
  }
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
}

interface AssignShipmentParams {
  shipmentId: number
  transportUnitId: number
  driverId: number
}

export async function assignShipment({
  shipmentId,
  driverId,
  transportUnitId,
}: AssignShipmentParams) {
  await db
    .update(shipments)
    .set({ driverId, transportUnitId })
    .where(eq(shipments.id, shipmentId))
}

export async function startShipment({ shipmentId }: { shipmentId: number }) {
  const shipment = await db.query.shipments.findFirst({
    where: eq(shipments.id, shipmentId),
  })

  if (!shipment) {
    throw new Error('El envío no existe')
  } else if (shipment.startedAt) {
    throw new Error('El envío ya ha sido iniciado')
  }

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
}

export async function deleteShipment({ shipmentId }: { shipmentId: number }) {
  await db.delete(shipments).where(eq(shipments.id, shipmentId))
}

interface UpdateOrderStatusParams {
  orderId: number
  status: OrderStatus
  refusedReason?: string
}

export async function updateOrderStatus(input: UpdateOrderStatusParams) {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, input.orderId),
  })

  if (!order) {
    throw new Error('El pedido no existe')
  }

  if (isOrderFinalized(order)) {
    throw new Error('El pedido ya ha sido finalizado')
  }

  await db
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
}

interface CreateCostumerParams {
  clientId: string
  name: string
  internal_code: string
  channel?: string
}

export async function createCostumer(input: CreateCostumerParams) {
  const costumer = await db.query.costumers.findFirst({
    where: (costumers, { eq, or }) =>
      or(
        eq(costumers.internalCode, input.internal_code),
        eq(costumers.name, input.name),
      ),
  })

  if (costumer) {
    throw new Error('El cliente ya existe en la base de datos')
  }

  await db.insert(costumers).values({
    clientId: input.clientId,
    internalCode: input.internal_code,
    name: input.name,
    channel: input.channel,
  })
}
