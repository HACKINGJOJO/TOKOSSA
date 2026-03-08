import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

/**
 * Middleware de protection des routes admin.
 *
 * - /dashboard/* : accessible uniquement aux utilisateurs avec role "admin"
 * - /login : redirige vers /dashboard si deja connecte en admin
 */
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdminRoute = req.nextUrl.pathname.startsWith('/dashboard')
    const isLoginPage = req.nextUrl.pathname === '/login'

    // Proteger les routes admin
    if (isAdminRoute && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Rediriger vers le dashboard si deja authentifie en admin
    if (isLoginPage && token?.role === 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Les routes dashboard necessitent un token valide
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          return !!token
        }
        // Les autres routes sont accessibles a tous
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}
