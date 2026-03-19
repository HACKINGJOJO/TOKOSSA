import { authService as localAuthService } from '@/services/auth'
import { AuthResult, User } from '@/types'

type AuthProvider = 'local' | 'remote'

const provider = (import.meta.env.VITE_AUTH_PROVIDER as AuthProvider | undefined) || 'local'
const apiBase = import.meta.env.VITE_AUTH_API_BASE as string | undefined

type SessionResult = { valid: boolean; user?: User | null }

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  if (!apiBase) {
    throw new Error('VITE_AUTH_API_BASE is required for remote auth provider')
  }
  const response = await fetch(`${apiBase}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    ...init,
  })
  if (!response.ok) {
    throw new Error(`Auth API error: ${response.status}`)
  }
  return response.json() as Promise<T>
}

function createAuthClient() {
  if (provider === 'remote' && apiBase) {
    return {
      verifyPin: (pin: string) =>
        fetchJson<AuthResult>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ pin }),
        }),
      createPin: (pin: string) =>
        fetchJson<AuthResult>('/auth/create-pin', {
          method: 'POST',
          body: JSON.stringify({ pin }),
        }),
      checkSession: async () => {
        const result = await fetchJson<SessionResult>('/auth/session')
        return result.valid
      },
      getCurrentUser: async () => {
        const result = await fetchJson<SessionResult>('/auth/session')
        return result.user || null
      },
      hasPin: async () => {
        const result = await fetchJson<{ hasPin: boolean }>('/auth/has-pin')
        return result.hasPin
      },
      logout: () =>
        fetchJson<{ success: boolean }>('/auth/logout', {
          method: 'POST',
        }),
      getUsers: () => fetchJson<User[]>('/auth/users'),
      addMember: (name: string, expiresInMinutes = 43200) =>
        fetchJson<AuthResult & { member?: User }>('/auth/members', {
          method: 'POST',
          body: JSON.stringify({ name, expiresInMinutes }),
        }),
      removeMember: (memberId: string) =>
        fetchJson<AuthResult>(`/auth/members/${memberId}`, {
          method: 'DELETE',
        }),
      regenerateCode: (memberId: string) =>
        fetchJson<AuthResult & { code?: string }>(`/auth/members/${memberId}/regenerate`, {
          method: 'POST',
        }),
    }
  }

  if (provider === 'remote' && !apiBase) {
    console.warn('VITE_AUTH_PROVIDER=remote without VITE_AUTH_API_BASE. Falling back to local auth.')
  }

  return {
    verifyPin: async (pin: string) => localAuthService.verifyPin(pin),
    createPin: async (pin: string) => localAuthService.createPin(pin),
    checkSession: async () => localAuthService.checkSession(),
    getCurrentUser: async () => localAuthService.getCurrentUser(),
    hasPin: async () => localAuthService.hasPin(),
    logout: async () => localAuthService.logout(),
    getUsers: async () => localAuthService.getUsers(),
    addMember: async (name: string, expiresInMinutes = 43200) =>
      localAuthService.addMember(name, expiresInMinutes),
    removeMember: async (memberId: string) => localAuthService.removeMember(memberId),
    regenerateCode: async (memberId: string) => localAuthService.regenerateCode(memberId),
  }
}

export const authClient = createAuthClient()

// Backward-compatible alias while migrating imports.
export const authService = authClient
