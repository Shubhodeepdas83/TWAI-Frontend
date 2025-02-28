import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  
  if (!session && req.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/', req.url))
  }
  
  if (session && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
