'use server'

import { revalidatePath } from 'next/cache'

import {
  assignShipment,
  createBulkShipments,
  createCostumer,
  deleteOrders,
  deleteShipment,
  startShipment,
  updateOrderStatus,
} from '@/db/mutations'
import {
  getDriversAndTransportAvailability,
  getOrderStatusOptions,
} from '@/db/queries'
import { Option } from '@/types'

import { adminActionClient } from './safe-action'
import {
  assignShipmentSchema,
  createBulkShipmentsSchema,
  createCostumerSchema,
  deleteOrdersSchema,
  getAvailabilitySchema,
  modifyShipmentSchema,
  updateMultipleOrderStatusSchema,
  updateOrderStatusSchema,
} from './schema'

export const createBulkShipmentsAction = adminActionClient
  .schema(createBulkShipmentsSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    await createBulkShipments({ userId: user.id, ...parsedInput })

    revalidatePath('/shipments')
  })

export const assignShipmentAction = adminActionClient
  .schema(assignShipmentSchema)
  .action(async ({ parsedInput }) => {
    await assignShipment({
      driverId: Number(parsedInput.driverId),
      transportUnitId: Number(parsedInput.transportUnitId),
      shipmentId: Number(parsedInput.shipmentId),
    })

    revalidatePath('/shipments')
  })

export const startShipmentAction = adminActionClient
  .schema(modifyShipmentSchema)
  .action(async ({ parsedInput }) => {
    await startShipment(parsedInput)

    revalidatePath('/shipments')
  })

export const deleteShipmentAction = adminActionClient
  .schema(modifyShipmentSchema)
  .action(async ({ parsedInput }) => {
    await deleteShipment(parsedInput)

    revalidatePath('/shipments')
  })

export const updateOrderStatusAction = adminActionClient
  .schema(updateOrderStatusSchema)
  .action(async ({ parsedInput }) => {
    await updateOrderStatus(parsedInput)

    revalidatePath('/shipments')
  })

export const updateMultipleOrderStatusAction = adminActionClient
  .schema(updateMultipleOrderStatusSchema)
  .action(async ({ parsedInput }) => {
    for (const orderId of parsedInput.orderIds) {
      await updateOrderStatus({ orderId, status: parsedInput.status })
    }

    revalidatePath('/shipments')
  })

export const deleteOrdersAction = adminActionClient
  .schema(deleteOrdersSchema)
  .action(async ({ parsedInput }) => {
    await deleteOrders(parsedInput)

    revalidatePath('/shipments')
  })

export const createCostumerAction = adminActionClient
  .schema(createCostumerSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    await createCostumer({ userId: user.id, ...parsedInput })

    revalidatePath('/shipments')
  })

export const getAvailabilityAction = adminActionClient
  .schema(getAvailabilitySchema)
  .action(async ({ parsedInput }) => {
    const { drivers, transportUnits } =
      await getDriversAndTransportAvailability(parsedInput)

    const driverOptions: Option[] = drivers.map((driver) => ({
      label: `${driver.lastName}, ${driver.name}`,
      value: driver.id.toString(),
      disabled: !driver.available,
    }))

    const transportUnitOptions: Option[] = transportUnits.map((unit) => ({
      label: `${unit.brand} - ${unit.licensePlate}`,
      value: unit.id.toString(),
      disabled: !unit.available,
    }))

    return { drivers: driverOptions, transportUnits: transportUnitOptions }
  })

export const getOrderStatusOptionsAction = adminActionClient
  .schema(modifyShipmentSchema)
  .action(async ({ parsedInput }) => {
    return await getOrderStatusOptions(parsedInput.shipmentId)
  })
