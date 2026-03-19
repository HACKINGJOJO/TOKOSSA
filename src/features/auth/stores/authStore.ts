import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'
import { authClient } from '@/features/auth/services/authClient'
import { analytics } from '@/services/analytics'

interface AuthState {
  user: User | null
  currentUser: User | null  // Alias for user
  isAuthenticated: boolean
  isAdmin: boolean

  // Actions
  login: (pin: string) => Promise<{ success: boolean; message: string }>
  logout: () => Promise<void>
  createPin: (pin: string) => Promise<{ success: boolean; message: string }>
  checkSession: () => Promise<boolean>
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      get currentUser() {
        return get().user
      },
      isAuthenticated: false,
      isAdmin: false,

      login: async (pin: string) => {
        const result = await authClient.verifyPin(pin)
        if (result.success && result.user) {
          analytics.track(
            'login_success',
            { role: result.user.role, source: 'pin' },
            result.user.id
          )
          set({
            user: result.user,
            isAuthenticated: true,
            isAdmin: result.user.role === 'admin',
          })
        }
        return { success: result.success, message: result.message }
      },

      logout: async () => {
        await authClient.logout()
        set({
          user: null,
          isAuthenticated: false,
          isAdmin: false,
        })
      },

      createPin: async (pin: string) => {
        const result = await authClient.createPin(pin)
        if (result.success && result.user) {
          analytics.track(
            'login_success',
            { role: result.user.role, source: 'create_pin' },
            result.user.id
          )
          set({
            user: result.user,
            isAuthenticated: true,
            isAdmin: result.user.role === 'admin',
          })
        }
        return { success: result.success, message: result.message }
      },

      checkSession: async () => {
        const valid = await authClient.checkSession()
        if (!valid) {
          set({
            user: null,
            isAuthenticated: false,
            isAdmin: false,
          })
        } else {
          const user = await authClient.getCurrentUser()
          if (user) {
            set({
              user,
              isAuthenticated: true,
              isAdmin: user.role === 'admin',
            })
          }
        }
        return valid
      },

      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
          isAdmin: user?.role === 'admin',
        })
      },
    }),
    {
      name: 'jojo-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
    }
  )
)
