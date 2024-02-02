'use server'

import { unstable_noStore as noStore, revalidatePath } from 'next/cache'
import { notFound } from 'next/navigation'

import { db } from '@/db'
import { orders, shipments, type CreateOrder } from '@/db/schema'
import { catchError } from '@/lib/utils'
import { type CreateBulkShipmentsInput } from '@/lib/validations/shipment-upload'

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
  noStore()

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
