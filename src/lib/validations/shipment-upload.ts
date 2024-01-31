import * as z from 'zod'

import { removeAccents } from '@/lib/utils'

const shipmentBulkUploadSchema = z.object({
  route: z.string(),
  internalCode: z.string(),
  clientOrderId: z.number(),
  orderNumber: z.string(),
  guideNumber: z.string(),
  destinationAddress: z.string().toUpperCase().transform(removeAccents),
  destinationDistrict: z.string().toUpperCase(),
  totalValue: z.number().transform((value) => value.toFixed(2)),
})

export type ShipmentBulkUploadRow = z.infer<typeof shipmentBulkUploadSchema>

const headersMap: Record<string, keyof ShipmentBulkUploadRow> = {
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
