import { z } from 'zod'

import { OrderStatus } from '@/components/modules/shipments/order-status'
import { removeAccents } from '@/lib/utils'

const shipmentBulkUploadSchema = z.object({
  route: z.string(),
  internalCode: z.string(),
  clientOrderId: z.number(),
  orderNumber: z.string(),
  guideNumber: z.string(),
  destinationAddress: z.string().toUpperCase().transform(removeAccents),
  destinationDistrict: z.string().toUpperCase(),
  totalValue: z.number(),
})

export type ShipmentBulkUploadRow = z.infer<typeof shipmentBulkUploadSchema>

export const headersMap: Record<string, keyof ShipmentBulkUploadRow> = {
  CHOFER: 'route',
  'Cod. Cliente': 'internalCode',
  'NRO VALE': 'clientOrderId',
  'NRO PEDIDO': 'orderNumber',
  'NRO GUIA': 'guideNumber',
  DIRECCION: 'destinationAddress',
  DISTRITO: 'destinationDistrict',
  'VALOR TOT.': 'totalValue',
}

export const parseShipmentBulkUpload = (
  data: Record<string, string | number>[],
) => {
  return data
    .map((row) => {
      const mappedRow = Object.entries(row).reduce((acc, [key, value]) => {
        const mappedKey = headersMap[key.trim()]
        return mappedKey ? { ...acc, [mappedKey]: value } : acc
      }, {})

      const validation = shipmentBulkUploadSchema.safeParse(mappedRow)
      if (!validation.success) return null

      return validation.data
    })
    .filter(Boolean) as ShipmentBulkUploadRow[]
}

export const createBulkShipmentsSchema = z.object({
  clientId: z.string({ required_error: 'Requerido' }),
  deliveryDate: z.date({ required_error: 'Requerido' }),
  bundledOrders: z.array(shipmentBulkUploadSchema),
})

export type CreateBulkShipmentsInput = z.infer<typeof createBulkShipmentsSchema>

export const assignShipmentSchema = z.object({
  shipmentId: z.string({ required_error: 'Requerido' }),
  transportUnitId: z.string({ required_error: 'Requerido' }),
  driverId: z.string({ required_error: 'Requerido' }),
})

export type AssignShipmentInput = z.infer<typeof assignShipmentSchema>

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

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>
