import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WeeklyUpdate {
  id: string
  title: string
  description: string
  routeId: string
}

interface WeeklyFeedState {
  weekTag: string
  updates: WeeklyUpdate[]
  seenIds: string[]

  ensureCurrentWeek: () => void
  markSeen: (id: string) => void
  unseenCount: () => number
}

function getWeekTag(date = new Date()): string {
  const year = date.getFullYear()
  const oneJan = new Date(year, 0, 1)
  const dayOfYear = Math.floor((date.getTime() - oneJan.getTime()) / 86400000) + 1
  const week = Math.ceil(dayOfYear / 7)
  return `${year}-W${String(week).padStart(2, '0')}`
}

function createDefaultUpdates(weekTag: string): WeeklyUpdate[] {
  return [
    {
      id: `${weekTag}-focus-workspace`,
      title: 'Script WhatsApp de la semaine',
      description: 'Nouveau focus conversion: script court avec CTA clair.',
      routeId: 'workspace',
    },
    {
      id: `${weekTag}-focus-produits`,
      title: '3 produits à tester',
      description: 'Ajoute ces idées à ton sourcing pour accélérer.',
      routeId: 'produits-gagnants',
    },
    {
      id: `${weekTag}-focus-prompts`,
      title: 'Pack prompts closing',
      description: 'Prompts orientés objection prix et relance.',
      routeId: 'prompts',
    },
  ]
}

export const useWeeklyFeedStore = create<WeeklyFeedState>()(
  persist(
    (set, get) => ({
      weekTag: '',
      updates: [],
      seenIds: [],

      ensureCurrentWeek: () => {
        const current = getWeekTag()
        if (get().weekTag === current && get().updates.length > 0) return
        set({
          weekTag: current,
          updates: createDefaultUpdates(current),
          seenIds: [],
        })
      },

      markSeen: (id: string) => {
        const current = get().seenIds
        if (current.includes(id)) return
        set({ seenIds: [...current, id] })
      },

      unseenCount: () => {
        const state = get()
        return state.updates.filter((u) => !state.seenIds.includes(u.id)).length
      },
    }),
    { name: 'jojo-weekly-feed' }
  )
)
