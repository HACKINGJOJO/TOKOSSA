import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type PlanName = 'Starter' | 'Pro' | 'Empire'
export type SubscriptionStatus = 'inactive' | 'pending' | 'active'

interface SubscriptionState {
  plan: PlanName
  status: SubscriptionStatus
  pendingPlan: PlanName | null
  businessName: string
  phone: string
  paymentMethod: string
  updatedAt: number | null

  startCheckout: (plan: PlanName, details: { businessName: string; phone: string; paymentMethod: string }) => void
  confirmUpgrade: () => void
  cancelPending: () => void
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      plan: 'Starter',
      status: 'inactive',
      pendingPlan: null,
      businessName: '',
      phone: '',
      paymentMethod: 'Mobile Money',
      updatedAt: null,

      startCheckout: (plan, details) => {
        set({
          pendingPlan: plan,
          status: 'pending',
          businessName: details.businessName,
          phone: details.phone,
          paymentMethod: details.paymentMethod,
          updatedAt: Date.now(),
        })
      },

      confirmUpgrade: () => {
        const state = get()
        if (!state.pendingPlan) return
        set({
          plan: state.pendingPlan,
          pendingPlan: null,
          status: 'active',
          updatedAt: Date.now(),
        })
      },

      cancelPending: () => {
        set({ pendingPlan: null, status: 'inactive', updatedAt: Date.now() })
      },
    }),
    { name: 'jojo-subscription' }
  )
)
