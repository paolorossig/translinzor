'use server'

import { db } from '@/db'

export async function getCostumersByClientId(clientId: number) {
  return await db.query.costumers.findMany({
    columns: {
      internalCode: true,
      channel: true,
    },
    with: {
      company: true,
    },
    where: (costumers, { eq }) => eq(costumers.clientId, clientId),
  })
}

export type CostumersByClient = Awaited<
  ReturnType<typeof getCostumersByClientId>
>
