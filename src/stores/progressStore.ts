import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Progress, Badge, Level } from '@/types'
import { MODULES_FOR_CERTIFICATE, XP_LEVELS } from '@/utils/constants'
import { analytics } from '@/services/analytics'

interface ProgressState {
  progress: Progress
  bonusXP: number

  // Computed getters
  totalXP: number
  level: number

  // Actions
  markModuleProgress: (moduleId: string, percent: number) => void
  getModuleProgress: (moduleId: string) => number
  getTotalProgress: () => number
  getCompletedModules: () => string[]
  hasCompletedAllForCertificate: () => boolean
  getBadges: () => Badge[]
  calculateXP: () => number
  getLevel: () => Level
  setLastVisited: (moduleId: string) => void
  addXP: (amount: number) => void
  toggleMilestone: (milestoneId: string) => void
  isMilestoneCompleted: (milestoneId: string) => boolean
  getMilestoneCompletionCount: () => number
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: {
        modules: {},
        completed: [],
        milestones: {},
        milestoneXpAwarded: [],
        lastVisited: null,
        totalTime: 0,
      },
      bonusXP: 0,

      get totalXP() {
        return get().calculateXP()
      },

      get level() {
        return get().getLevel().level
      },

      markModuleProgress: (moduleId: string, percent: number) => {
        set((state) => {
          const newProgress = { ...state.progress }
          const previousPercent = newProgress.modules[moduleId] || 0
          const reachedCompletionNow = previousPercent < 100 && percent >= 100
          newProgress.modules[moduleId] = percent

          if (percent >= 100 && !newProgress.completed.includes(moduleId)) {
            newProgress.completed = [...newProgress.completed, moduleId]
          }
          newProgress.lastVisited = moduleId

          if (reachedCompletionNow) {
            analytics.track('module_complete', { moduleId })
          }

          return { progress: newProgress }
        })
      },

      getModuleProgress: (moduleId: string) => {
        return get().progress.modules[moduleId] || 0
      },

      getTotalProgress: () => {
        const { modules } = get().progress
        const values = Object.values(modules)
        if (values.length === 0) return 0
        const total = values.reduce((sum, p) => sum + p, 0)
        return Math.round(total / values.length)
      },

      getCompletedModules: () => {
        return get().progress.completed
      },

      hasCompletedAllForCertificate: () => {
        const { modules } = get().progress
        return MODULES_FOR_CERTIFICATE.every((id) => (modules[id] || 0) >= 100)
      },

      getBadges: () => {
        const { completed } = get().progress
        const badges: Badge[] = []

        if (completed.length >= 1) {
          badges.push({ id: 'first_module', label: 'Premier module', icon: '🌱' })
        }
        if (completed.length >= 2) {
          badges.push({ id: 'two_modules', label: 'En progression', icon: '📈' })
        }
        if (completed.length >= 4) {
          badges.push({ id: 'four_modules', label: 'En action', icon: '🔥' })
        }
        if (get().hasCompletedAllForCertificate()) {
          badges.push({ id: 'cert_ready', label: 'Prêt pour le certificat', icon: '🏆' })
        }

        return badges
      },

      calculateXP: () => {
        let xp = 0
        const { completed } = get().progress

        // XP for completed modules
        xp += completed.length * 100

        // Add bonus XP from quizzes, etc.
        xp += get().bonusXP

        return xp
      },

      addXP: (amount: number) => {
        set((state) => ({
          bonusXP: state.bonusXP + amount,
        }))
      },

      getLevel: () => {
        const xp = get().calculateXP()

        for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
          if (xp >= XP_LEVELS[i].minXP) {
            return { ...XP_LEVELS[i], xp }
          }
        }
        return { ...XP_LEVELS[0], xp }
      },

      setLastVisited: (moduleId: string) => {
        set((state) => ({
          progress: { ...state.progress, lastVisited: moduleId },
        }))
      },

      toggleMilestone: (milestoneId: string) => {
        set((state) => {
          const progress = { ...state.progress }
          const currentMilestones = progress.milestones || {}
          const currentlyCompleted = !!currentMilestones[milestoneId]
          const nextCompleted = !currentlyCompleted
          progress.milestones = { ...currentMilestones, [milestoneId]: nextCompleted }

          let bonusXP = state.bonusXP
          const awardedMilestones = progress.milestoneXpAwarded || []
          const alreadyAwarded = awardedMilestones.includes(milestoneId)

          if (nextCompleted) {
            analytics.track('module_complete', { moduleId: `milestone:${milestoneId}` })
            if (!alreadyAwarded) {
              progress.milestoneXpAwarded = [...awardedMilestones, milestoneId]
              bonusXP += 25
            }
          }

          return { progress, bonusXP }
        })
      },

      isMilestoneCompleted: (milestoneId: string) => {
        return !!get().progress.milestones?.[milestoneId]
      },

      getMilestoneCompletionCount: () => {
        return Object.values(get().progress.milestones || {}).filter(Boolean).length
      },
    }),
    {
      name: 'jojo-progress',
    }
  )
)
