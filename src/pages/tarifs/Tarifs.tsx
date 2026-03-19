import { useState } from 'react'
import { Card, Badge, Button, Input, Select, Modal, useToast } from '@/components/ui'
import { Check, MessageSquare } from 'lucide-react'
import { analytics } from '@/services/analytics'
import { cn } from '@/utils/helpers'
import { PlanName, useSubscriptionStore } from '@/stores/subscriptionStore'

const PLANS = [
  {
    name: 'Starter',
    price: 'Gratuit',
    period: '',
    description: 'Pour découvrir la plateforme',
    icon: '🌱',
    color: 'from-gray-500 to-gray-400',
    features: [
      'Accès aux 2 premiers modules',
      'Workspace limité (5 générations/jour)',
      'Quiz de base',
      'Communauté Discord',
    ],
    notIncluded: [
      'Modules avancés',
      'Workspace illimité',
      'Certificat',
      'Support prioritaire',
    ],
    cta: 'Commencer gratuitement',
    popular: false
  },
  {
    name: 'Pro',
    price: '15 000',
    period: '/mois',
    description: 'Pour les entrepreneurs sérieux',
    icon: '⚡',
    color: 'from-gold to-gold-light',
    features: [
      'Accès à TOUS les modules',
      'Workspace illimité',
      'Tous les quiz',
      'Certificat personnalisé',
      'Produits gagnants mis à jour',
      'Prompts IA premium',
      'Support WhatsApp',
    ],
    notIncluded: [
      'Coaching individuel',
    ],
    cta: 'Commencer Pro',
    popular: true
  },
  {
    name: 'Empire',
    price: '50 000',
    period: '/mois',
    description: 'Pour scaler son business',
    icon: '👑',
    color: 'from-purple-500 to-purple-400',
    features: [
      'Tout le plan Pro',
      '2 sessions coaching/mois',
      'Groupe VIP privé',
      'Accès avant-première',
      'Templates exclusifs',
      'Audit de ta boutique',
      'Support prioritaire 24/7',
    ],
    notIncluded: [],
    cta: 'Devenir VIP',
    popular: false
  },
]

const FEATURES_COMPARISON = [
  { feature: 'Modules de formation', starter: '2', pro: 'Tous', empire: 'Tous' },
  { feature: 'Workspace IA', starter: '5/jour', pro: 'Illimité', empire: 'Illimité' },
  { feature: 'Produits gagnants', starter: '❌', pro: '✅', empire: '✅' },
  { feature: 'Certificat', starter: '❌', pro: '✅', empire: '✅' },
  { feature: 'Support', starter: 'Communauté', pro: 'WhatsApp', empire: 'Prioritaire' },
  { feature: 'Coaching', starter: '❌', pro: '❌', empire: '2x/mois' },
]

export function Tarifs() {
  const toast = useToast()
  const { plan: activePlan, status, startCheckout, confirmUpgrade } = useSubscriptionStore()
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<PlanName>('Pro')
  const [form, setForm] = useState({
    businessName: '',
    phone: '',
    paymentMethod: 'Mobile Money',
  })
  const mobileSuggestedPlan: PlanName = activePlan === 'Starter' ? 'Pro' : 'Empire'

  const handlePlanCta = (planName: PlanName) => {
    analytics.track('pricing_cta_click', { plan: planName })
    if (planName === 'Starter') {
      toast.success('Tu es déjà sur le plan de base. Passe au Pro pour débloquer la puissance.')
      return
    }
    analytics.track('upgrade_started', { plan: planName })
    setSelectedPlan(planName)
    setCheckoutOpen(true)
  }

  const handleConfirmCheckout = () => {
    if (!form.businessName.trim() || !form.phone.trim()) {
      toast.error('Renseigne ton nom business et ton WhatsApp')
      return
    }
    startCheckout(selectedPlan, form)
    confirmUpgrade()
    analytics.track('upgrade_completed', { plan: selectedPlan, paymentMethod: form.paymentMethod })
    setCheckoutOpen(false)
    toast.success(`Upgrade ${selectedPlan} enregistré`)
    const message = encodeURIComponent(
      `Bonjour JOJO, j'ai lancé mon upgrade ${selectedPlan}. Business: ${form.businessName}. Tel: ${form.phone}.`
    )
    window.open(`https://wa.me/22900000000?text=${message}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <Badge variant="gold" className="mb-2">Tarifs</Badge>
        <h1 className="text-3xl font-bold font-playfair">
          <span className="gradient-text">Choisis ton plan</span>
        </h1>
        <p className="text-gray-500 mt-2">
          Investis dans ton succès. Résiliable à tout moment.
        </p>
        <div className="mt-3">
          <Badge variant={status === 'active' ? 'success' : 'default'}>
            Plan actif: {activePlan}
          </Badge>
        </div>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-6">
        {PLANS.map((plan, i) => (
          <Card
            key={i}
            hover={false}
            className={cn(
              'relative overflow-hidden',
              plan.popular && 'ring-2 ring-gold'
            )}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-gold text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                POPULAIRE
              </div>
            )}
            {status === 'active' && activePlan === plan.name && (
              <div className="absolute top-0 left-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg">
                ACTIF
              </div>
            )}

            <div className={cn(
              'w-16 h-16 rounded-xl flex items-center justify-center text-3xl text-white mb-4 bg-gradient-to-br',
              plan.color
            )}>
              {plan.icon}
            </div>

            <h3 className="text-xl font-bold">{plan.name}</h3>
            <p className="text-gray-500 text-sm mb-4">{plan.description}</p>

            <div className="mb-6">
              <span className="text-3xl font-bold">{plan.price}</span>
              <span className="text-gray-500">{plan.period} FCFA</span>
            </div>

            <Button
              variant={plan.popular ? 'gold' : 'outline'}
              className="w-full mb-6"
              onClick={() => handlePlanCta(plan.name as PlanName)}
            >
              {plan.cta}
            </Button>

            <div className="space-y-3">
              {plan.features.map((feature, j) => (
                <div key={j} className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500 shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
              {plan.notIncluded.map((feature, j) => (
                <div key={j} className="flex items-center gap-2 opacity-50">
                  <span className="w-5 h-5 text-center">-</span>
                  <span className="text-sm line-through">{feature}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Comparison Table */}
      <Card hover={false}>
        <h3 className="font-bold text-lg mb-6 text-center">Comparaison détaillée</h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-3 px-4 text-left font-bold">Fonctionnalité</th>
                <th className="py-3 px-4 text-center font-bold">Starter</th>
                <th className="py-3 px-4 text-center font-bold text-gold-dark">Pro</th>
                <th className="py-3 px-4 text-center font-bold">Empire</th>
              </tr>
            </thead>
            <tbody>
              {FEATURES_COMPARISON.map((row, i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 px-4 font-medium">{row.feature}</td>
                  <td className="py-3 px-4 text-center">{row.starter}</td>
                  <td className="py-3 px-4 text-center bg-gold-pale dark:bg-gold/10">{row.pro}</td>
                  <td className="py-3 px-4 text-center">{row.empire}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* FAQ */}
      <Card variant="gold" hover={false}>
        <h3 className="font-bold font-playfair text-lg mb-4">Questions fréquentes</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-dark-card p-4 rounded-xl">
            <h4 className="font-semibold mb-1">Puis-je changer de plan?</h4>
            <p className="text-sm text-gray-500">Oui, tu peux upgrader ou downgrader à tout moment.</p>
          </div>
          <div className="bg-white dark:bg-dark-card p-4 rounded-xl">
            <h4 className="font-semibold mb-1">Comment payer?</h4>
            <p className="text-sm text-gray-500">Mobile Money, Wave, Orange Money ou virement.</p>
          </div>
          <div className="bg-white dark:bg-dark-card p-4 rounded-xl">
            <h4 className="font-semibold mb-1">Y a-t-il une garantie?</h4>
            <p className="text-sm text-gray-500">Oui, satisfait ou remboursé sous 7 jours.</p>
          </div>
          <div className="bg-white dark:bg-dark-card p-4 rounded-xl">
            <h4 className="font-semibold mb-1">Une question?</h4>
            <p className="text-sm text-gray-500">Contacte-nous sur WhatsApp!</p>
          </div>
        </div>
      </Card>

      {/* Contact */}
      <div className="text-center">
        <a
          href="https://wa.me/22900000000"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => analytics.track('pricing_cta_click', { plan: 'contact' })}
          className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
        >
          <MessageSquare className="w-5 h-5" />
          Contacter pour s'abonner
        </a>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-dark-card/95 backdrop-blur px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-gray-500">Plan actif: {activePlan}</p>
            <p className="font-semibold">Passer au plan {mobileSuggestedPlan}</p>
          </div>
          <Button size="sm" onClick={() => handlePlanCta(mobileSuggestedPlan)}>
            Upgrade
          </Button>
        </div>
      </div>

      <Modal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} title={`Finaliser le plan ${selectedPlan}`} size="lg">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Renseigne tes infos, puis confirme. Tu seras ensuite redirigé sur WhatsApp pour finaliser le paiement.
          </p>
          <Input
            label="Nom business"
            value={form.businessName}
            onChange={(e) => setForm((prev) => ({ ...prev, businessName: e.target.value }))}
            placeholder="Ex: Kemi Shop"
          />
          <Input
            label="WhatsApp"
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            placeholder="+229..."
          />
          <Select
            label="Méthode de paiement"
            value={form.paymentMethod}
            onChange={(e) => setForm((prev) => ({ ...prev, paymentMethod: e.target.value }))}
            options={[
              { value: 'Mobile Money', label: 'Mobile Money' },
              { value: 'Wave', label: 'Wave' },
              { value: 'Orange Money', label: 'Orange Money' },
              { value: 'Virement', label: 'Virement' },
            ]}
          />
          <div className="flex gap-3 pt-2">
            <Button className="flex-1" onClick={handleConfirmCheckout}>
              Confirmer l'upgrade
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setCheckoutOpen(false)}>
              Annuler
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
