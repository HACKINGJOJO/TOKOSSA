import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type OnboardingObjective = 'premiere_vente' | 'doubler_ventes' | 'systeme'
export type OnboardingChannel = 'whatsapp' | 'facebook' | 'instagram'

interface OnboardingState {
  userId: string | null
  status: 'not_started' | 'in_progress' | 'completed'
  niche: string
  objective: OnboardingObjective | ''
  channel: OnboardingChannel | ''
  startedAt: number | null
  completedAt: number | null

  syncUser: (userId: string) => void
  start: () => void
  setNiche: (niche: string) => void
  setObjective: (objective: OnboardingObjective) => void
  setChannel: (channel: OnboardingChannel) => void
  complete: () => void
  reset: () => void
}

function getInitialState() {
  return {
    status: 'not_started' as const,
    niche: '',
    objective: '' as const,
    channel: '' as const,
    startedAt: null as number | null,
    completedAt: null as number | null,
  }
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      userId: null,
      ...getInitialState(),

      syncUser: (userId: string) => {
        const state = get()
        if (state.userId !== userId) {
          set({
            userId,
            ...getInitialState(),
          })
        }
      },

      start: () => {
        if (get().status === 'not_started') {
          set({ status: 'in_progress', startedAt: Date.now() })
        }
      },

      setNiche: (niche) => {
        const updates: Partial<OnboardingState> = { niche }
        if (get().status === 'not_started') {
          updates.status = 'in_progress'
          updates.startedAt = Date.now()
        }
        set(updates)
      },

      setObjective: (objective) => set({ objective }),
      setChannel: (channel) => set({ channel }),

      complete: () => {
        set({ status: 'completed', completedAt: Date.now() })
      },

      reset: () => {
        set({
          userId: get().userId,
          ...getInitialState(),
        })
      },
    }),
    { name: 'jojo-onboarding' }
  )
)
