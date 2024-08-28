'use server'

import { revalidatePath } from 'next/cache'

import {
  assignShipment,
  createBulkShipments,
  createCostumer,
  deleteShipment,
  startShipment,
  updateOrderStatus,
} from '@/db/mutations'
import {
  getDriversAndTransportAvailability,
  getOrderStatusOptions,
} from '@/db/queries'
import { Option } from '@/types'

import { authActionClient } from './safe-action'
import {
  assignShipmentSchema,
  createBulkShipmentsSchema,
  createCostumerSchema,
  getAvailabilitySchema,
  modifyShipmentSchema,
  updateOrderStatusSchema,
} from './schema'

export const createBulkShipmentsAction = authActionClient
  .schema(createBulkShipmentsSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    await createBulkShipments({ userId: user.id, ...parsedInput })

    revalidatePath('/shipments')
  })

export const assignShipmentAction = authActionClient
  .schema(assignShipmentSchema)
  .action(async ({ parsedInput }) => {
    await assignShipment({
      driverId: Number(parsedInput.driverId),
      transportUnitId: Number(parsedInput.transportUnitId),
      shipmentId: Number(parsedInput.shipmentId),
    })

    revalidatePath('/shipments')
  })

export const startShipmentAction = authActionClient
  .schema(modifyShipmentSchema)
  .action(async ({ parsedInput }) => {
    await startShipment(parsedInput)

    revalidatePath('/shipments')
  })

export const deleteShipmentAction = authActionClient
  .schema(modifyShipmentSchema)
  .action(async ({ parsedInput }) => {
    await deleteShipment(parsedInput)

    revalidatePath('/shipments')
  })

export const updateOrderStatusAction = authActionClient
  .schema(updateOrderStatusSchema)
  .action(async ({ parsedInput }) => {
    await updateOrderStatus(parsedInput)

    revalidatePath('/shipments')
  })

export const createCostumerAction = authActionClient
  .schema(createCostumerSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    await createCostumer({ userId: user.id, ...parsedInput })

    revalidatePath('/shipments')
  })

export const getAvailabilityAction = authActionClient
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

export const getOrderStatusOptionsAction = authActionClient
  .schema(modifyShipmentSchema)
  .action(async ({ parsedInput }) => {
    return await getOrderStatusOptions(parsedInput.shipmentId)
  })
