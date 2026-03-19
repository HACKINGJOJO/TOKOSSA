import { useState } from 'react'
import { Card, Badge, Progress } from '@/components/ui'
import { Calendar, Check, Clock, BookOpen, Target } from 'lucide-react'
import { cn } from '@/utils/helpers'
import { useProgressStore } from '@/stores/progressStore'

const STUDY_PLANS = [
  {
    id: 'intensive',
    name: 'Intensif',
    duration: '1 semaine',
    hoursPerDay: '3-4h/jour',
    description: 'Pour ceux qui veulent avancer vite',
    icon: '🚀',
    schedule: [
      { day: 'Jour 1', modules: ['Fondations (Niches, Pricing)'], duration: '3h' },
      { day: 'Jour 2', modules: ['Fondations (Stack, Gestion)'], duration: '3h' },
      { day: 'Jour 3', modules: ['Sourcing complet'], duration: '4h' },
      { day: 'Jour 4', modules: ['Marketing (AIDA, Contenu)'], duration: '3h' },
      { day: 'Jour 5', modules: ['Marketing (WhatsApp, Livraison)'], duration: '3h' },
      { day: 'Jour 6', modules: ['Facebook Ads'], duration: '4h' },
      { day: 'Jour 7', modules: ['Shopify + Révision'], duration: '4h' },
    ]
  },
  {
    id: 'standard',
    name: 'Standard',
    duration: '2 semaines',
    hoursPerDay: '1-2h/jour',
    description: 'Rythme équilibré recommandé',
    icon: '📚',
    schedule: [
      { day: 'Semaine 1 - Lun', modules: ['Fondations: Niches'], duration: '1.5h' },
      { day: 'Semaine 1 - Mar', modules: ['Fondations: Pricing'], duration: '1.5h' },
      { day: 'Semaine 1 - Mer', modules: ['Fondations: Stack Digital'], duration: '1h' },
      { day: 'Semaine 1 - Jeu', modules: ['Fondations: Gestion Stock'], duration: '1h' },
      { day: 'Semaine 1 - Ven', modules: ['Sourcing: Local vs Chine'], duration: '1.5h' },
      { day: 'Semaine 1 - Sam', modules: ['Sourcing: Négociation'], duration: '1.5h' },
      { day: 'Semaine 1 - Dim', modules: ['Révision + Quiz'], duration: '1h' },
      { day: 'Semaine 2 - Lun', modules: ['Marketing: AIDA'], duration: '1.5h' },
      { day: 'Semaine 2 - Mar', modules: ['Marketing: Contenu'], duration: '1.5h' },
      { day: 'Semaine 2 - Mer', modules: ['Marketing: WhatsApp'], duration: '1.5h' },
      { day: 'Semaine 2 - Jeu', modules: ['Facebook Ads: Bases'], duration: '2h' },
      { day: 'Semaine 2 - Ven', modules: ['Facebook Ads: Avancé'], duration: '2h' },
      { day: 'Semaine 2 - Sam', modules: ['Shopify'], duration: '2h' },
      { day: 'Semaine 2 - Dim', modules: ['Révision finale + Certificat'], duration: '1h' },
    ]
  },
  {
    id: 'relax',
    name: 'Relax',
    duration: '4 semaines',
    hoursPerDay: '30min-1h/jour',
    description: 'À ton rythme, sans pression',
    icon: '🧘',
    schedule: [
      { day: 'Semaine 1', modules: ['Fondations complet'], duration: '4-5h total' },
      { day: 'Semaine 2', modules: ['Sourcing complet'], duration: '4-5h total' },
      { day: 'Semaine 3', modules: ['Marketing complet'], duration: '5-6h total' },
      { day: 'Semaine 4', modules: ['Facebook Ads + Shopify'], duration: '5-6h total' },
    ]
  },
]

export function PlanEtude() {
  const [selectedPlan, setSelectedPlan] = useState(STUDY_PLANS[1])
  const [completedDays, setCompletedDays] = useState<string[]>([])
  const { getTotalProgress } = useProgressStore()

  const toggleDay = (day: string) => {
    setCompletedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  const planProgress = Math.round((completedDays.length / selectedPlan.schedule.length) * 100)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <Badge variant="gold" className="mb-2">Organisation</Badge>
        <h1 className="text-3xl font-bold font-playfair">
          <span className="gradient-text">Plan d'Étude</span>
        </h1>
        <p className="text-gray-500 mt-2">
          Choisis ton rythme et organise ton apprentissage
        </p>
      </div>

      {/* Current Progress */}
      <Card variant="gold" hover={false}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BookOpen className="w-8 h-8 text-gold-dark" />
            <div>
              <h3 className="font-bold">Ta progression actuelle</h3>
              <p className="text-gray-600">Modules de formation</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gold-dark">{getTotalProgress()}%</div>
            <p className="text-sm text-gray-600">complété</p>
          </div>
        </div>
      </Card>

      {/* Plan Selection */}
      <div className="grid md:grid-cols-3 gap-4">
        {STUDY_PLANS.map(plan => (
          <Card
            key={plan.id}
            className={cn(
              'cursor-pointer text-center transition-all',
              selectedPlan.id === plan.id && 'ring-2 ring-gold'
            )}
            onClick={() => {
              setSelectedPlan(plan)
              setCompletedDays([])
            }}
          >
            <div className="text-4xl mb-2">{plan.icon}</div>
            <h3 className="font-bold text-lg">{plan.name}</h3>
            <Badge variant="default" className="my-2">{plan.duration}</Badge>
            <p className="text-sm text-gray-500 mb-2">{plan.hoursPerDay}</p>
            <p className="text-xs text-gray-400">{plan.description}</p>
          </Card>
        ))}
      </div>

      {/* Selected Plan Schedule */}
      <Card hover={false}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-gold-dark" />
            <div>
              <h3 className="font-bold text-lg">Plan {selectedPlan.name}</h3>
              <p className="text-sm text-gray-500">{selectedPlan.duration} • {selectedPlan.hoursPerDay}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-gold-dark">{planProgress}%</span>
            <Progress value={planProgress} className="w-24 mt-1" />
          </div>
        </div>

        <div className="space-y-3">
          {selectedPlan.schedule.map((item, i) => {
            const isCompleted = completedDays.includes(item.day)

            return (
              <div
                key={i}
                onClick={() => toggleDay(item.day)}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all',
                  isCompleted
                    ? 'bg-green-50 dark:bg-green-900/20'
                    : 'bg-gray-50 dark:bg-dark-secondary hover:bg-gray-100 dark:hover:bg-dark-card'
                )}
              >
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                  isCompleted ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                )}>
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <span className="text-sm font-bold text-gray-600">{i + 1}</span>
                  )}
                </div>

                <div className="flex-1">
                  <h4 className={cn(
                    'font-semibold',
                    isCompleted && 'line-through text-gray-400'
                  )}>
                    {item.day}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {item.modules.join(', ')}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{item.duration}</span>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Tips */}
      <Card hover={false}>
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-gold-dark" />
          Conseils pour réussir
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-dark-secondary rounded-xl">
            <div className="text-2xl mb-2">⏰</div>
            <h4 className="font-semibold">Fixe une heure</h4>
            <p className="text-sm text-gray-500">Même heure chaque jour = habitude</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-dark-secondary rounded-xl">
            <div className="text-2xl mb-2">📝</div>
            <h4 className="font-semibold">Prends des notes</h4>
            <p className="text-sm text-gray-500">Utilise la section Notes</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-dark-secondary rounded-xl">
            <div className="text-2xl mb-2">🎯</div>
            <h4 className="font-semibold">Applique direct</h4>
            <p className="text-sm text-gray-500">Mets en pratique immédiatement</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
