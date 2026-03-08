/**
 * Tests unitaires pour le Rate Limiter (lib/rate-limit.ts)
 * Couvre : checkRateLimit, getClientIP, presets
 */

import { checkRateLimit, getClientIP, RATE_LIMIT_REVIEWS, RATE_LIMIT_ORDERS } from '@/lib/rate-limit'

// ============================================================
// checkRateLimit — Limitation de requetes par IP
// ============================================================
describe('checkRateLimit', () => {
  beforeEach(() => {
    // Reset le rate limiter entre les tests en attendant que la fenetre expire
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('autorise la premiere requete', () => {
    const result = checkRateLimit('192.168.1.1', 'test-route-1', { max: 3, windowMs: 60000 })
    expect(result).toBe(true)
  })

  it('autorise les requetes sous la limite', () => {
    const options = { max: 3, windowMs: 60000 }
    expect(checkRateLimit('10.0.0.1', 'test-route-2', options)).toBe(true)
    expect(checkRateLimit('10.0.0.1', 'test-route-2', options)).toBe(true)
    expect(checkRateLimit('10.0.0.1', 'test-route-2', options)).toBe(true)
  })

  it('bloque les requetes au-dessus de la limite', () => {
    const options = { max: 2, windowMs: 60000 }
    const ip = '10.0.0.2'
    const route = 'test-route-3'

    expect(checkRateLimit(ip, route, options)).toBe(true)  // 1ere
    expect(checkRateLimit(ip, route, options)).toBe(true)  // 2eme
    expect(checkRateLimit(ip, route, options)).toBe(false) // 3eme → bloque
    expect(checkRateLimit(ip, route, options)).toBe(false) // 4eme → toujours bloque
  })

  it('autorise a nouveau apres expiration de la fenetre', () => {
    const options = { max: 1, windowMs: 1000 } // 1 req / seconde
    const ip = '10.0.0.3'
    const route = 'test-route-4'

    expect(checkRateLimit(ip, route, options)).toBe(true)
    expect(checkRateLimit(ip, route, options)).toBe(false)

    // Avancer le temps de 2 secondes
    jest.advanceTimersByTime(2000)

    expect(checkRateLimit(ip, route, options)).toBe(true)
  })

  it('separe les limites par IP', () => {
    const options = { max: 1, windowMs: 60000 }
    const route = 'test-route-5'

    expect(checkRateLimit('ip-a', route, options)).toBe(true)
    expect(checkRateLimit('ip-b', route, options)).toBe(true)
    expect(checkRateLimit('ip-a', route, options)).toBe(false) // IP A bloquee
    expect(checkRateLimit('ip-b', route, options)).toBe(false) // IP B bloquee
  })

  it('separe les limites par route', () => {
    const options = { max: 1, windowMs: 60000 }
    const ip = '10.0.0.4'

    expect(checkRateLimit(ip, 'route-x', options)).toBe(true)
    expect(checkRateLimit(ip, 'route-y', options)).toBe(true) // Route differente = OK
    expect(checkRateLimit(ip, 'route-x', options)).toBe(false) // Meme route = bloque
  })
})

// ============================================================
// getClientIP — Extraction IP
// ============================================================
describe('getClientIP', () => {
  // Mock Request pour jsdom (Request n'existe pas dans jsdom)
  function createMockRequest(headers: Record<string, string>) {
    return {
      headers: {
        get: (name: string) => headers[name.toLowerCase()] || null,
      },
    } as unknown as Request
  }

  it('retourne IP du header x-forwarded-for', () => {
    const req = createMockRequest({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8' })
    expect(getClientIP(req)).toBe('1.2.3.4')
  })

  it('retourne IP du header x-real-ip', () => {
    const req = createMockRequest({ 'x-real-ip': '9.8.7.6' })
    expect(getClientIP(req)).toBe('9.8.7.6')
  })

  it('retourne "unknown" si pas de header IP', () => {
    const req = createMockRequest({})
    expect(getClientIP(req)).toBe('unknown')
  })

  it('prefere x-forwarded-for a x-real-ip', () => {
    const req = createMockRequest({
      'x-forwarded-for': '1.1.1.1',
      'x-real-ip': '2.2.2.2',
    })
    expect(getClientIP(req)).toBe('1.1.1.1')
  })

  it('trim les espaces dans x-forwarded-for', () => {
    const req = createMockRequest({ 'x-forwarded-for': '  3.3.3.3  , 4.4.4.4' })
    expect(getClientIP(req)).toBe('3.3.3.3')
  })
})

// ============================================================
// Presets — Verification des presets
// ============================================================
describe('Rate limit presets', () => {
  it('RATE_LIMIT_REVIEWS = 3 req/min', () => {
    expect(RATE_LIMIT_REVIEWS.max).toBe(3)
    expect(RATE_LIMIT_REVIEWS.windowMs).toBe(60000)
  })

  it('RATE_LIMIT_ORDERS = 5 req/min', () => {
    expect(RATE_LIMIT_ORDERS.max).toBe(5)
    expect(RATE_LIMIT_ORDERS.windowMs).toBe(60000)
  })
})
