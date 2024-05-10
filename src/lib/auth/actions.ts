'use server'

import { db } from '@/db'

export async function getAllUsers() {
  const users = await db.query.users.findMany({
    with: { client: true },
    orderBy: (users, { asc }) => asc(users.role),
  })
  return users
}

export type Users = Awaited<ReturnType<typeof getAllUsers>>
