import { describe, expect, it } from 'vitest'
import { APP_ROUTES, getNavItemsBySection, getRoutePath } from './routes'

describe('routes config', () => {
  it('returns expected path for known route ids', () => {
    expect(getRoutePath('dashboard')).toBe('/')
    expect(getRoutePath('login')).toBe('/login')
  })

  it('returns fallback for unknown route ids', () => {
    expect(getRoutePath('unknown-id', '/fallback')).toBe('/fallback')
  })

  it('contains core routes and navigation sections', () => {
    const routeIds = APP_ROUTES.map((route) => route.id)
    expect(routeIds).toContain('dashboard')
    expect(routeIds).toContain('workspace')
    expect(routeIds).toContain('admin')

    const formationItems = getNavItemsBySection('formation')
    expect(formationItems.length).toBeGreaterThan(0)
    expect(formationItems.some((item) => item.id === 'fondations')).toBe(true)
  })
})
