import { describe, expect, it } from 'vitest'
import { authClient, authService } from './authClient'

describe('authClient', () => {
  it('exposes async auth methods', async () => {
    const result = await authClient.checkSession()
    expect(typeof result).toBe('boolean')
  })

  it('keeps backward-compatible alias', () => {
    expect(authService).toBe(authClient)
  })
})
