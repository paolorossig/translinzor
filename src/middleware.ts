import { NextResponse, type NextRequest } from 'next/server'

import { updateSession } from '@/lib/supabase/middleware'
import { createClient } from '@/lib/supabase/server'

export async function middleware(request: NextRequest) {
  const response = await updateSession(request, NextResponse.next({ request }))

  const supabase = createClient()
  const nextUrl = request.nextUrl

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session && nextUrl.pathname !== '/login') {
    const url = new URL('/login', request.url)

    const encodedSearchParams = nextUrl.pathname.substring(1) + nextUrl.search
    if (encodedSearchParams) {
      url.searchParams.append('return_to', encodedSearchParams)
    }

    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets|api).*)'],
}
