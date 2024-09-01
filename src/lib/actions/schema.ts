import { z } from 'zod'

import { OrderStatus } from '@/components/modules/shipments/order-status'
import { shipmentBulkUploadSchema } from '@/lib/validations/shipments'

export const createBulkShipmentsSchema = z.object({
  clientId: z.string({ required_error: 'Requerido' }),
  deliveryDate: z.date({ required_error: 'Requerido' }),
  bundledOrders: z.array(shipmentBulkUploadSchema),
})

export const modifyShipmentSchema = z.object({
  shipmentId: z.number({ required_error: 'Requerido' }),
})

export const assignShipmentSchema = modifyShipmentSchema.extend({
  transportUnitId: z.string({ required_error: 'Requerido' }),
  driverId: z.string({ required_error: 'Requerido' }),
})

export const createOrderSchema = z.object({
  costumerId: z.string({ required_error: 'Requerido' }),
  shipmentId: z.number({ required_error: 'Requerido' }),
  clientOrderId: z.coerce.number({ required_error: 'Requerido' }),
  orderNumber: z.string({ required_error: 'Requerido' }),
  guideNumber: z.string({ required_error: 'Requerido' }),
  destinationAddress: z.string({ required_error: 'Requerido' }),
  destinationDistrict: z.string({ required_error: 'Requerido' }),
  totalValue: z.coerce.number({ required_error: 'Requerido' }),
})

export const updateOrderStatusSchema = z
  .object({
    orderId: z.number({ required_error: 'Requerido' }),
    status: z.enum([OrderStatus.DELIVERED, OrderStatus.REFUSED], {
      required_error: 'Requerido',
    }),
    refusedReason: z.string().optional(),
  })
  .superRefine(({ status, refusedReason }, refinementContext) => {
    if (status === OrderStatus.REFUSED && !refusedReason) {
      return refinementContext.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Requerido',
        path: ['refusedReason'],
      })
    }
    return true
  })

export const updateMultipleOrderStatusSchema = z.object({
  orderIds: z.array(z.number({ required_error: 'Requerido' })),
  status: z.enum(
    [OrderStatus.SCHEDULED, OrderStatus.ON_ROUTE, OrderStatus.DELIVERED],
    { required_error: 'Requerido' },
  ),
})

export const deleteOrdersSchema = z.object({
  orderIds: z.array(z.number({ required_error: 'Requerido' })),
})

export const createCostumerSchema = z.object({
  clientId: z.string({ required_error: 'Requerido' }),
  name: z.string({ required_error: 'Requerido' }),
  internal_code: z.string({ required_error: 'Requerido' }),
  channel: z.string().optional(),
})

export const getAvailabilitySchema = z.date()

export const getCostumersSchema = z
  .object({
    clientId: z.string().nullable().optional(),
    search: z.string().optional(),
    limit: z.number().optional(),
  })
  .optional()
