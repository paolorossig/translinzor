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

export const getAvailabilityAction = authActionClient
  .schema(getAvailabilitySchema)
  .action(async ({ parsedInput: payload }) => {
    const { drivers, transportUnits } =
      await getDriversAndTransportAvailability(payload)

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
  .action(async ({ parsedInput: payload }) => {
    return await getOrderStatusOptions(payload.shipmentId)
  })
