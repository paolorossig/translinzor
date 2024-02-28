import * as z from 'zod'

export const searchParamsSchema = z.object({
  date: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
})
