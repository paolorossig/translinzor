import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              cookieStore.set(name, value, options)
            })
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  )
}

// Ignore warnings about using supabase.auth.getSession(),
// since we're using supabase.auth.getUser() in the middleware.

const conWarn = console.warn
const conLog = console.log

const IGNORE_WARNINGS = [
  'Using the user object as returned from supabase.auth.getSession()',
]

console.warn = (...args) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const match = args.find((arg) =>
    typeof arg === 'string'
      ? IGNORE_WARNINGS.find((warning) => arg.includes(warning))
      : false,
  )
  if (!match) {
    conWarn(...args)
  }
}

console.log = (...args) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const match = args.find((arg) =>
    typeof arg === 'string'
      ? IGNORE_WARNINGS.find((warning) => arg.includes(warning))
      : false,
  )
  if (!match) {
    conLog(...args)
  }
}
