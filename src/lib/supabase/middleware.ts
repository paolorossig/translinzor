import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function updateSession(
  request: NextRequest,
  response: NextResponse,
) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            request.cookies.set({ name, value, ...options })
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            response.cookies.set({ name, value, ...options })
          })
        },
      },
    },
  )

  await supabase.auth.getUser()

  return response
}
