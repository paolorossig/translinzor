import { z } from 'zod'

export const createCostumerSchema = z.object({
  name: z.string({ required_error: 'Requerido' }),
  internal_code: z.string({ required_error: 'Requerido' }),
  channel: z.string().optional(),
})

export type CreateCostumerInput = z.infer<typeof createCostumerSchema>
