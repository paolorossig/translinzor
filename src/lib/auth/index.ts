import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

import { db } from '@/db'

export async function useAuth() {
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
