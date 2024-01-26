'use server'

import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { companies, costumers } from '@/db/schema'

export async function getCostumersByClientId(clientId: number) {
  return db
    .select({
      companyId: companies.id,
      internalCode: costumers.internalCode,
      channel: costumers.channel,
      name: companies.name,
      ruc: companies.ruc,
    })
    .from(costumers)
    .rightJoin(companies, eq(costumers.companyId, companies.id))
    .where(eq(costumers.clientId, clientId))
}

export type CostumersByClient = Awaited<
  ReturnType<typeof getCostumersByClientId>
>
