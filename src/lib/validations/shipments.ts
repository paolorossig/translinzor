import { z } from 'zod'

import { removeAccents } from '@/lib/utils'

export const shipmentBulkUploadSchema = z.object({
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
  'Suma de VALOR TOT.': 'totalValue',
}

export const parseShipmentBulkUpload = (
  data: Record<string, string | number>[],
) => {
  const rowsWithErrors: Record<string, string | number>[] = []

  const parsedData = data.flatMap((row) => {
    if (Object.values(row).includes('Total general')) return []

    const mappedRow = Object.entries(row).reduce((acc, [key, value]) => {
      const mappedKey = headersMap[key.trim()]
      return mappedKey ? { ...acc, [mappedKey]: value } : acc
    }, {})

    const validation = shipmentBulkUploadSchema.safeParse(mappedRow)
    if (!validation.success) {
      rowsWithErrors.push(row)
      return []
    }

    return validation.data
  })

  return { parsedData, rowsWithErrors }
}
