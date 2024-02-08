import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

import { db } from '@/db'

export async function useAuth() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) redirect('/login')

  const profile = await db.query.profiles.findFirst({
    where: (profiles, { eq }) => eq(profiles.id, session.user.id),
  })

  if (!profile) redirect('/login')

  const isAdmin = profile.role === 'admin'
  const isClient = profile.role === 'client'

  return { session, profile, isAdmin, isClient }
}
