import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = req.nextUrl

  // Allow access to root and any path starting with /document/ if there's no session
  if (!session && pathname !== '/' && !pathname.startsWith('/document/') && !pathname.startsWith('/api/documents/')) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Redirect logged-in users from root to dashboard
  if (session && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}