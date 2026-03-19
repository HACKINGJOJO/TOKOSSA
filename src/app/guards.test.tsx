import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { RedirectIfAuthenticated, RequireAdmin, RequireAuth } from './guards'

vi.mock('@/features/auth', () => ({
  useAuthStore: vi.fn(),
}))

import { useAuthStore } from '@/features/auth'

const mockedUseAuthStore = vi.mocked(useAuthStore)

describe('route guards', () => {
  it('RequireAuth redirects to login when unauthenticated', () => {
    mockedUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      isAdmin: false,
    } as never)

    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route element={<RequireAuth />}>
            <Route path="/private" element={<div>private</div>} />
          </Route>
          <Route path="/login" element={<div>login</div>} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('login')).toBeInTheDocument()
  })

  it('RequireAdmin allows admin users', () => {
    mockedUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      isAdmin: true,
    } as never)

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<div>admin</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('admin')).toBeInTheDocument()
  })

  it('RedirectIfAuthenticated sends authenticated users to dashboard', () => {
    mockedUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      isAdmin: false,
    } as never)

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<RedirectIfAuthenticated />}>
            <Route path="/login" element={<div>login</div>} />
          </Route>
          <Route path="/" element={<div>dashboard</div>} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('dashboard')).toBeInTheDocument()
  })
})
