import * as z from 'zod'

const shipmentBulkUploadSchema = z.object({
  route: z.string(),
  costumerCode: z.string(),
  businessName: z.string(),
  voucher: z.number(),
  orderNumber: z.string(),
  guideNumber: z.string(),
  address: z.string(),
  district: z.string(),
  totalValue: z.number(),
})

export type ShipmentBulkUploadRow = z.infer<typeof shipmentBulkUploadSchema>

const headersMap: Record<string, keyof ShipmentBulkUploadRow> = {
  CHOFER: 'route',
  'Cod. Cliente': 'costumerCode',
  'Razón Social': 'businessName',
  'NRO VALE': 'voucher',
  'NRO PEDIDO': 'orderNumber',
  'NRO GUIA': 'guideNumber',
  DIRECCION: 'address',
  DISTRITO: 'district',
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
