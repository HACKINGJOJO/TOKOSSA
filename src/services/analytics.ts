import { STORAGE_KEYS } from '@/utils/constants'
import { storage } from '@/services/storage'

export type AnalyticsEventName =
  | 'login_success'
  | 'workspace_generate'
  | 'workspace_feedback'
  | 'module_complete'
  | 'pricing_cta_click'
  | 'upgrade_started'
  | 'upgrade_completed'
  | 'onboarding_started'
  | 'onboarding_completed'

export interface AnalyticsEvent {
  id: string
  name: AnalyticsEventName
  at: number
  userId?: string
  payload?: Record<string, unknown>
}

interface FunnelStats {
  logins: number
  workspaceGenerations: number
  moduleCompletions: number
  pricingClicks: number
  upgradesStarted: number
  upgradesCompleted: number
  onboardingStarted: number
  onboardingCompleted: number
}

interface AnalyticsOverview {
  totalEvents: number
  events7d: number
  events30d: number
  recent: AnalyticsEvent[]
  funnel7d: FunnelStats
  activationRate7d: number
  onboardingCompletionRate7d: number
}

const MAX_EVENTS = 2000

class AnalyticsService {
  private canUseStorage(): boolean {
    return typeof window !== 'undefined'
  }

  private getEvents(): AnalyticsEvent[] {
    if (!this.canUseStorage()) return []
    return storage.get<AnalyticsEvent[]>(STORAGE_KEYS.ANALYTICS_EVENTS, [])
  }

  private saveEvents(events: AnalyticsEvent[]): void {
    if (!this.canUseStorage()) return
    storage.set(STORAGE_KEYS.ANALYTICS_EVENTS, events.slice(-MAX_EVENTS))
  }

  track(name: AnalyticsEventName, payload: Record<string, unknown> = {}, userId?: string): void {
    const events = this.getEvents()
    const event: AnalyticsEvent = {
      id: `${name}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name,
      at: Date.now(),
      userId,
      payload,
    }
    events.push(event)
    this.saveEvents(events)
  }

  private countSince(events: AnalyticsEvent[], name: AnalyticsEventName, fromTs: number): number {
    return events.filter((e) => e.name === name && e.at >= fromTs).length
  }

  getOverview(nowTs = Date.now()): AnalyticsOverview {
    const events = this.getEvents()
    const ts7d = nowTs - 7 * 24 * 60 * 60 * 1000
    const ts30d = nowTs - 30 * 24 * 60 * 60 * 1000

    const recent = [...events].sort((a, b) => b.at - a.at).slice(0, 20)
    const in7d = events.filter((e) => e.at >= ts7d)
    const in30d = events.filter((e) => e.at >= ts30d)

    return {
      totalEvents: events.length,
      events7d: in7d.length,
      events30d: in30d.length,
      recent,
      funnel7d: {
        logins: this.countSince(events, 'login_success', ts7d),
        workspaceGenerations: this.countSince(events, 'workspace_generate', ts7d),
        moduleCompletions: this.countSince(events, 'module_complete', ts7d),
        pricingClicks: this.countSince(events, 'pricing_cta_click', ts7d),
        upgradesStarted: this.countSince(events, 'upgrade_started', ts7d),
        upgradesCompleted: this.countSince(events, 'upgrade_completed', ts7d),
        onboardingStarted: this.countSince(events, 'onboarding_started', ts7d),
        onboardingCompleted: this.countSince(events, 'onboarding_completed', ts7d),
      },
      activationRate7d:
        this.countSince(events, 'login_success', ts7d) > 0
          ? Math.round(
              (this.countSince(events, 'workspace_generate', ts7d) /
                this.countSince(events, 'login_success', ts7d)) *
                100
            )
          : 0,
      onboardingCompletionRate7d:
        this.countSince(events, 'onboarding_started', ts7d) > 0
          ? Math.round(
              (this.countSince(events, 'onboarding_completed', ts7d) /
                this.countSince(events, 'onboarding_started', ts7d)) *
                100
            )
          : 0,
    }
  }
}

export const analytics = new AnalyticsService()
