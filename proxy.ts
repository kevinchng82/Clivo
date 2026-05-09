import { NextRequest, NextResponse } from 'next/server'
import { getSessionForProxy } from '@/lib/session'

const SESSION_COOKIE = 'clivo_session'

const protectedRoutes = ['/dashboard']
const publicRoutes = ['/login', '/signup', '/']

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(r => path === r || path.startsWith(r + '/'))
  const isPublicRoute = publicRoutes.includes(path)

  const token = req.cookies.get(SESSION_COOKIE)?.value
  const session = await getSessionForProxy(token)

  // Unauthenticated user hitting a protected route → send to login
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // Authenticated user hitting /login → send to dashboard
  if (isPublicRoute && session && path === '/login') {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  const res = NextResponse.next()
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  res.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co"
  )
  return res
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}
