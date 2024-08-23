import { db } from '@/db'
import { createClient } from '@/lib/supabase/server'

export async function getSession() {
  const supabase = createClient()
  return supabase.auth.getSession()
}

export async function getUser() {
  const { data } = await getSession()

  const userId = data.session?.user?.id
  if (!userId) return null

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  })
  if (!user) {
    const supabase = createClient()
    await supabase.auth.signOut()
    return null
  }

  const isAdmin = user?.role === 'admin'

  return { ...user, isAdmin }
}
