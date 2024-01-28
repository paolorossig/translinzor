'use server'

import { db } from '@/db'

export async function getCostumersByClientId(clientId: number) {
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

export async function getShipmentsByClientId(clientId: number) {
  const shipments = await db.query.shipments.findMany({
    columns: {
      id: true,
      deliveryDate: true,
      createdAt: true,
    },
    with: {
      orders: true,
      driver: true,
      transportUnit: true,
    },
    where: (shipments, { eq }) => eq(shipments.clientId, clientId),
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
