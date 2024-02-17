'use server'

import { db } from '@/db'

export async function getAllUsers() {
  const profiles = await db.query.profiles.findMany({
    with: { client: true },
    orderBy: (profiles, { asc }) => asc(profiles.role),
  })
  return profiles
}

export type Users = Awaited<ReturnType<typeof getAllUsers>>
