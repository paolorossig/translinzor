import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

import { db } from '@/db'

export async function auth() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser()

  if (!supabaseUser) redirect('/login')

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, supabaseUser.id),
  })

  if (!user) {
    console.log('User not found')
    await supabase.auth.signOut()
    redirect('/login')
  }

  const isAdmin = user.role === 'admin'
  const isClient = user.role === 'client'

  return { supabaseUser, user, isAdmin, isClient }
}

export async function getAllUsers() {
  const users = await db.query.users.findMany({
    with: { client: true },
    orderBy: (users, { asc }) => asc(users.role),
  })
  return users
}

export type Users = Awaited<ReturnType<typeof getAllUsers>>
