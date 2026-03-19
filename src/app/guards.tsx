import { Navigate, Outlet } from 'react-router-dom'
import { getRoutePath } from '@/app/routes'
import { useAuthStore } from '@/features/auth'

export function RedirectIfAuthenticated() {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <Navigate to={getRoutePath('dashboard')} replace /> : <Outlet />
}

export function RequireAuth() {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <Outlet /> : <Navigate to={getRoutePath('login')} replace />
}

export function RequireAdmin() {
  const { isAdmin } = useAuthStore()
  return isAdmin ? <Outlet /> : <Navigate to={getRoutePath('dashboard')} replace />
}
