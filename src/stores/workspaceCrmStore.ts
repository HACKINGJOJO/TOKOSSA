import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type LeadStatus = 'new' | 'hot' | 'warm' | 'cold' | 'won' | 'lost'

export interface WorkspaceLead {
  id: string
  name: string
  phone: string
  product: string
  amount?: number
  status: LeadStatus
  notes?: string
  createdAt: number
  lastContactAt?: number
}

interface WorkspaceCrmState {
  leads: WorkspaceLead[]
  addLead: (payload: Omit<WorkspaceLead, 'id' | 'createdAt' | 'status'> & { status?: LeadStatus }) => void
  removeLead: (id: string) => void
  updateLeadStatus: (id: string, status: LeadStatus) => void
  updateLeadNotes: (id: string, notes: string) => void
  touchLead: (id: string) => void
}

export const useWorkspaceCrmStore = create<WorkspaceCrmState>()(
  persist(
    (set) => ({
      leads: [],

      addLead: (payload) => {
        set((state) => ({
          leads: [
            {
              id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
              createdAt: Date.now(),
              status: payload.status || 'new',
              ...payload,
            },
            ...state.leads,
          ],
        }))
      },

      removeLead: (id) => {
        set((state) => ({
          leads: state.leads.filter((lead) => lead.id !== id),
        }))
      },

      updateLeadStatus: (id, status) => {
        set((state) => ({
          leads: state.leads.map((lead) => (lead.id === id ? { ...lead, status } : lead)),
        }))
      },

      updateLeadNotes: (id, notes) => {
        set((state) => ({
          leads: state.leads.map((lead) => (lead.id === id ? { ...lead, notes } : lead)),
        }))
      },

      touchLead: (id) => {
        set((state) => ({
          leads: state.leads.map((lead) =>
            lead.id === id ? { ...lead, lastContactAt: Date.now() } : lead
          ),
        }))
      },
    }),
    { name: 'jojo-workspace-crm' }
  )
)
