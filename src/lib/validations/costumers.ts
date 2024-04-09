import { z } from 'zod'

export const createCostumerSchema = z.object({
  company_name: z.string({ required_error: 'Requerido' }),
  company_ruc: z.coerce.number().optional(),
  internal_code: z.string({ required_error: 'Requerido' }),
  channel: z.string().optional(),
})

export type CreateCostumerInput = z.infer<typeof createCostumerSchema>
