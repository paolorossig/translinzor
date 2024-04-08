import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

import { db } from '@/db'

export async function useAuth() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const profile = await db.query.profiles.findFirst({
    where: (profiles, { eq }) => eq(profiles.id, user.id),
  })

  if (!profile) {
    console.log('Profile not found')
    await supabase.auth.signOut()
    redirect('/login')
  }

  const isAdmin = profile.role === 'admin'
  const isClient = profile.role === 'client'

  return { user, profile, isAdmin, isClient }
}
