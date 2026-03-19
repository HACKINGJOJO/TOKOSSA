import { storage } from '@/services/storage'
import { STORAGE_KEYS } from '@/utils/constants'

export interface WorkspaceFeedbackRecord {
  id: string
  at: number
  userId?: string
  niche: string
  channel: string
  objective: string
  success: boolean
  messageIndex?: number
}

interface ContextSummary {
  total: number
  successRate: number
  priorityOrder: number[]
}

interface LearningContextRow {
  niche: string
  channel: string
  total: number
  successRate: number
  priorityOrder: number[]
}

const MESSAGE_COUNT = 5

class WorkspaceLearningService {
  private getRecords(): WorkspaceFeedbackRecord[] {
    return storage.get<WorkspaceFeedbackRecord[]>(STORAGE_KEYS.WORKSPACE_FEEDBACKS, [])
  }

  private saveRecords(records: WorkspaceFeedbackRecord[]): void {
    storage.set(STORAGE_KEYS.WORKSPACE_FEEDBACKS, records.slice(-3000))
  }

  recordFeedback(input: Omit<WorkspaceFeedbackRecord, 'id' | 'at'>): void {
    const records = this.getRecords()
    records.push({
      ...input,
      id: `wf_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      at: Date.now(),
    })
    this.saveRecords(records)
  }

  private scoreRecords(records: WorkspaceFeedbackRecord[]): number[] {
    const scores = Array.from({ length: MESSAGE_COUNT }, () => 0)

    for (const record of records) {
      if (record.messageIndex && record.messageIndex >= 1 && record.messageIndex <= MESSAGE_COUNT) {
        const idx = record.messageIndex - 1
        scores[idx] += record.success ? 2 : -1
      } else {
        for (let i = 0; i < MESSAGE_COUNT; i++) {
          scores[i] += record.success ? 0.2 : -0.2
        }
      }
    }

    return scores
  }

  getPriorityOrder(niche: string, channel: string): number[] {
    const records = this.getRecords()
    const contextRecords = records.filter((r) => r.niche === niche && r.channel === channel)
    const fallbackRecords = records.filter((r) => r.channel === channel)
    const source = contextRecords.length >= 3 ? contextRecords : fallbackRecords
    const scores = this.scoreRecords(source)

    return [0, 1, 2, 3, 4].sort((a, b) => {
      if (scores[b] === scores[a]) return a - b
      return scores[b] - scores[a]
    })
  }

  getContextSummary(niche: string, channel: string): ContextSummary {
    const records = this.getRecords().filter((r) => r.niche === niche && r.channel === channel)
    const total = records.length
    const success = records.filter((r) => r.success).length
    return {
      total,
      successRate: total > 0 ? Math.round((success / total) * 100) : 0,
      priorityOrder: this.getPriorityOrder(niche, channel).map((i) => i + 1),
    }
  }

  getContextLeaderboard(limit = 10): LearningContextRow[] {
    const records = this.getRecords()
    const byContext = new Map<string, WorkspaceFeedbackRecord[]>()

    for (const record of records) {
      const key = `${record.niche}__${record.channel}`
      const arr = byContext.get(key) || []
      arr.push(record)
      byContext.set(key, arr)
    }

    return [...byContext.entries()]
      .map(([key, recs]) => {
        const [niche, channel] = key.split('__')
        const success = recs.filter((r) => r.success).length
        return {
          niche,
          channel,
          total: recs.length,
          successRate: Math.round((success / recs.length) * 100),
          priorityOrder: this.getPriorityOrder(niche, channel).map((i) => i + 1),
        }
      })
      .sort((a, b) => {
        if (b.total === a.total) return b.successRate - a.successRate
        return b.total - a.total
      })
      .slice(0, limit)
  }
}

export const workspaceLearning = new WorkspaceLearningService()
