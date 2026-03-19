import { useState } from 'react'
import { useProgressStore } from '@/stores/progressStore'
import { Card, CardHeader, CardTitle, Button, Progress, Badge } from '@/components/ui'
import { CheckCircle, AlertTriangle } from 'lucide-react'
import { cn } from '@/utils/helpers'

const STEPS = [
  {
    step: 1,
    title: 'Créer Business Manager',
    desc: 'Le centre de commande de tes pubs Facebook',
    tips: ['business.facebook.com', 'Utilise ton vrai nom', 'Ajoute un moyen de paiement'],
    icon: '🏢'
  },
  {
    step: 2,
    title: 'Installer le Pixel Facebook',
    desc: 'Tracker qui suit tes visiteurs et conversions',
    tips: ['Gestionnaire d\'événements → Pixel', 'Copie le code sur ton site', 'Teste avec le Pixel Helper'],
    icon: '🎯'
  },
  {
    step: 3,
    title: 'Créer les Audiences',
    desc: 'Cibler les bonnes personnes',
    tips: ['Audience similaire (Lookalike)', 'Retargeting visiteurs', 'Intérêts : mode, shopping, beauté'],
    icon: '👥'
  },
  {
    step: 4,
    title: 'Créer des Pubs qui Convertissent',
    desc: 'Visuels et textes qui vendent',
    tips: ['Vidéo › Image', 'Texte court + CTA clair', 'Prix visible ou curiosité'],
    icon: '🎨'
  },
  {
    step: 5,
    title: 'Lancer ta Première Campagne',
    desc: 'Configuration optimale pour débutant',
    tips: ['Objectif : Conversions ou Messages', 'Budget : 2-5k FCFA/jour minimum', 'Durée : 3-7 jours test'],
    icon: '🚀'
  },
  {
    step: 6,
    title: 'Budget & Scaling',
    desc: 'Augmenter les budgets intelligemment',
    tips: ['Attendre 50+ conversions avant de juger', 'Augmenter de 20-30% max par jour', 'Couper ce qui ne marche pas vite'],
    icon: '📈'
  },
  {
    step: 7,
    title: 'Analyser & Optimiser',
    desc: 'Les métriques qui comptent',
    tips: ['CPC ‹ 50 FCFA = Bien', 'CTR › 2% = Bien', 'ROAS › 2 = Rentable'],
    icon: '📊'
  },
]

const BUDGET_GUIDE = [
  { level: 'Test', daily: '2-5k FCFA/jour', weekly: '15-35k/semaine', goal: 'Valider le produit' },
  { level: 'Scale', daily: '10-20k FCFA/jour', weekly: '70-140k/semaine', goal: 'Augmenter les ventes' },
  { level: 'Agressif', daily: '50k+ FCFA/jour', weekly: '350k+/semaine', goal: 'Dominer le marché' },
]

const METRICS = [
  { name: 'CPC (Coût par Clic)', good: '‹ 50 FCFA', bad: '› 100 FCFA', desc: 'Combien tu paies par clic' },
  { name: 'CTR (Taux de Clic)', good: '› 2%', bad: '‹ 1%', desc: 'Pourcentage qui clique sur ta pub' },
  { name: 'CPM (Coût pour 1000 vues)', good: '‹ 1000 FCFA', bad: '› 3000 FCFA', desc: 'Coût pour 1000 impressions' },
  { name: 'ROAS (Retour sur Pub)', good: '› 2x', bad: '‹ 1x', desc: 'Revenu généré par FCFA dépensé' },
]

export function FacebookAds() {
  const { getModuleProgress, markModuleProgress } = useProgressStore()
  const progress = getModuleProgress('facebook-ads')
  const [activeStep, setActiveStep] = useState(1)

  const handleMarkComplete = () => {
    markModuleProgress('facebook-ads', 100)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Badge variant="gold" className="mb-2">Module 4</Badge>
          <h1 className="text-3xl font-bold font-playfair">
            <span className="gradient-text">Facebook Ads Mastery</span>
          </h1>
          <p className="text-gray-500 mt-2">
            Maîtrise la publicité Facebook pour scaler ton business
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Progress value={progress} className="w-32" />
          <span className="font-bold text-gold-dark">{progress}%</span>
        </div>
      </div>

      {/* 7 Steps */}
      <Card hover={false}>
        <CardHeader>
          <CardTitle>🎯 Les 7 Étapes pour Lancer tes Pubs</CardTitle>
        </CardHeader>

        <div className="grid md:grid-cols-7 gap-2 mb-8">
          {STEPS.map((s) => (
            <button
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              className={cn(
                'p-3 rounded-xl text-center transition-all',
                activeStep === s.step
                  ? 'bg-gradient-to-br from-gold to-gold-light text-white'
                  : 'bg-gray-100 dark:bg-dark-secondary hover:bg-gold/10'
              )}
            >
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xs font-semibold">Étape {s.step}</div>
            </button>
          ))}
        </div>

        {/* Active Step Content */}
        {STEPS.map((s) => (
          activeStep === s.step && (
            <div key={s.step} className="bg-gray-50 dark:bg-dark-secondary p-6 rounded-xl animate-fade-in">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">{s.icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-gold-dark">
                    Étape {s.step}: {s.title}
                  </h3>
                  <p className="text-gray-500">{s.desc}</p>
                </div>
              </div>
              <div className="space-y-2">
                {s.tips.map((tip, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </Card>

      {/* Budget Guide */}
      <Card hover={false}>
        <CardHeader>
          <CardTitle>💰 Guide Budget Pub</CardTitle>
        </CardHeader>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {BUDGET_GUIDE.map((b, i) => (
            <div
              key={i}
              className={cn(
                'p-5 rounded-xl border-2',
                i === 0 && 'border-blue-300 bg-blue-50 dark:bg-blue-900/20',
                i === 1 && 'border-gold bg-gold-pale dark:bg-gold/10',
                i === 2 && 'border-purple-300 bg-purple-50 dark:bg-purple-900/20'
              )}
            >
              <h4 className="font-bold text-lg mb-2">{b.level}</h4>
              <p className="text-2xl font-black font-playfair text-gold-dark">{b.daily}</p>
              <p className="text-sm text-gray-500 mb-2">{b.weekly}</p>
              <p className="text-sm font-medium">{b.goal}</p>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Règle d'or :</strong> Ne dépense jamais plus de 10% de ton budget total en pub avant d'avoir validé ton produit avec des ventes organiques.
          </p>
        </div>
      </Card>

      {/* Metrics */}
      <Card hover={false}>
        <CardHeader>
          <CardTitle>📊 Les Métriques à Surveiller</CardTitle>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-3 px-4 text-left font-bold">Métrique</th>
                <th className="py-3 px-4 text-left font-bold text-green-600">✅ Bon</th>
                <th className="py-3 px-4 text-left font-bold text-red-600">❌ Mauvais</th>
                <th className="py-3 px-4 text-left font-bold">Description</th>
              </tr>
            </thead>
            <tbody>
              {METRICS.map((m, i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 px-4 font-semibold">{m.name}</td>
                  <td className="py-3 px-4 text-green-600">{m.good}</td>
                  <td className="py-3 px-4 text-red-600">{m.bad}</td>
                  <td className="py-3 px-4 text-gray-500 text-sm">{m.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Tips */}
      <Card variant="gold" hover={false}>
        <h2 className="text-xl font-bold font-playfair mb-4">💡 Tips Avancés</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-dark-card p-4 rounded-xl">
            <p className="font-semibold text-gold-dark">🎥 Vidéo &gt; Image</p>
            <p className="text-sm text-gray-500">Les vidéos ont 2-3x plus d'engagement</p>
          </div>
          <div className="bg-white dark:bg-dark-card p-4 rounded-xl">
            <p className="font-semibold text-gold-dark">📱 Mobile First</p>
            <p className="text-sm text-gray-500">95% des utilisateurs sont sur mobile</p>
          </div>
          <div className="bg-white dark:bg-dark-card p-4 rounded-xl">
            <p className="font-semibold text-gold-dark">🔄 Teste 3-5 créatifs</p>
            <p className="text-sm text-gray-500">Ne mise jamais sur une seule pub</p>
          </div>
          <div className="bg-white dark:bg-dark-card p-4 rounded-xl">
            <p className="font-semibold text-gold-dark">⏰ Attends 48-72h</p>
            <p className="text-sm text-gray-500">Avant de juger une campagne</p>
          </div>
        </div>
      </Card>

      {/* Complete Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handleMarkComplete}
          disabled={progress >= 100}
          leftIcon={<CheckCircle className="w-5 h-5" />}
        >
          {progress >= 100 ? 'Module complété ✓' : 'Marquer ce module comme terminé'}
        </Button>
      </div>
    </div>
  )
}
