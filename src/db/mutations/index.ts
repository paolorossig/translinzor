import { eq, sql } from 'drizzle-orm'

import {
  isOrderFinalized,
  OrderStatus,
} from '@/components/modules/shipments/order-status'
import { db } from '@/db'
import { costumers, orders, shipments } from '@/db/schema'
import { groupBy } from '@/lib/utils'
import {
  mapUploadRowToCreateOrder,
  type ShipmentBulkUploadRow,
} from '@/lib/validations/shipments'

interface CreateBulkShipmentsParams {
  userId: string
  clientId: string
  deliveryDate: Date
  bundledOrders: ShipmentBulkUploadRow[]
}

export async function createBulkShipments({
  userId,
  clientId,
  deliveryDate,
  bundledOrders,
}: CreateBulkShipmentsParams) {
  const costumerValues = bundledOrders
    .map((o) => ({
      clientId,
      name: o.costumerName,
      internalCode: o.internalCode,
      channel: o.channel,
      createdBy: userId,
    }))
    .filter(
      (value, index, self) =>
        self.findIndex((c) => c.internalCode === value.internalCode) === index,
    )

  await db.transaction(async (tx) => {
    const upsertedCostumers = await tx
      .insert(costumers)
      .values(costumerValues)
      .onConflictDoUpdate({
        target: [costumers.clientId, costumers.internalCode],
        set: {
          name: sql`excluded.name`,
          channel: sql`excluded.channel`,
          updatedAt: new Date(),
        },
      })
      .returning({ id: costumers.id, internalCode: costumers.internalCode })
    console.log('# upserted costumers:', upsertedCostumers.length)

    const costumerMap = new Map<string, number>()
    upsertedCostumers.forEach((c) => costumerMap.set(c.internalCode, c.id))
    const ordersByRoute = groupBy(bundledOrders, (o) => o.route)

    for (const [route, groupedOrders] of Object.entries(ordersByRoute)) {
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
        groupedOrders.map((row) =>
          mapUploadRowToCreateOrder({
            row,
            costumerId: costumerMap.get(row.internalCode)!,
            shipmentId: createdShipment.id,
          }),
        ),
      )
      console.log('# created orders:', groupedOrders.length)
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

export async function updateOrderStatus(params: UpdateOrderStatusParams) {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, params.orderId),
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
      params.status === OrderStatus.REFUSED
        ? {
            refusedAt: new Date(),
            refusedReason: params.refusedReason,
          }
        : {
            deliveredAt: new Date(),
          },
    )
    .where(eq(orders.id, params.orderId))
}

interface CreateCostumerParams {
  userId: string
  clientId: string
  name: string
  internal_code: string
  channel?: string
}

export async function createCostumer(params: CreateCostumerParams) {
  const costumer = await db.query.costumers.findFirst({
    where: (costumers, { eq, or }) =>
      or(
        eq(costumers.internalCode, params.internal_code),
        eq(costumers.name, params.name),
      ),
  })

  if (costumer) {
    throw new Error('El cliente ya existe en la base de datos')
  }

  await db.insert(costumers).values({
    clientId: params.clientId,
    internalCode: params.internal_code,
    name: params.name,
    channel: params.channel,
    createdBy: params.userId,
  })
}
