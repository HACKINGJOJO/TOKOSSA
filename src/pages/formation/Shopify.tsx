import { useProgressStore } from '@/stores/progressStore'
import { Card, CardHeader, CardTitle, Button, Progress, Badge } from '@/components/ui'
import { CheckCircle } from 'lucide-react'

const COMPARISON = [
  { feature: 'Investissement initial', whatsapp: 'Gratuit', shopify: '29$/mois + thème' },
  { feature: 'Temps de mise en place', whatsapp: '1 jour', shopify: '1-2 semaines' },
  { feature: 'Gestion commandes', whatsapp: 'Manuelle', shopify: 'Automatique' },
  { feature: 'Paiement en ligne', whatsapp: 'Non', shopify: 'Oui (carte, Mobile Money)' },
  { feature: 'Scaling', whatsapp: 'Difficile (+10 ventes/jour)', shopify: 'Facile (illimité)' },
  { feature: 'Crédibilité', whatsapp: 'Moyenne', shopify: 'Élevée' },
]

const SHOPIFY_STEPS = [
  { step: 1, title: 'Créer ton compte', desc: 'shopify.com - 14 jours gratuits', icon: '🔐' },
  { step: 2, title: 'Choisir un thème', desc: 'Dawn (gratuit) ou thème premium', icon: '🎨' },
  { step: 3, title: 'Ajouter tes produits', desc: 'Photos HD, descriptions vendeuses', icon: '📦' },
  { step: 4, title: 'Configurer les paiements', desc: 'Paystack, Flutterwave, Mobile Money', icon: '💳' },
  { step: 5, title: 'Paramétrer la livraison', desc: 'Zones et tarifs', icon: '🚚' },
  { step: 6, title: 'Installer les apps', desc: 'WhatsApp, Avis, Marketing', icon: '📱' },
  { step: 7, title: 'Lancer !', desc: 'Tester et publier', icon: '🚀' },
]

const ESSENTIAL_APPS = [
  { name: 'WhatsApp Chat', desc: 'Bouton WhatsApp sur ton site', price: 'Gratuit' },
  { name: 'Judge.me', desc: 'Avis clients avec photos', price: 'Gratuit' },
  { name: 'Klaviyo', desc: 'Email marketing automation', price: 'Gratuit jusqu\'à 250 contacts' },
  { name: 'Oberlo/DSers', desc: 'Dropshipping automatisé', price: 'Gratuit' },
  { name: 'PageFly', desc: 'Landing pages personnalisées', price: 'Gratuit limité' },
]

const PAYMENT_METHODS = [
  { name: 'Paystack', countries: 'Nigeria, Ghana', fees: '1.5% + frais fixes' },
  { name: 'Flutterwave', countries: 'Afrique (14+ pays)', fees: '1.4% local, 3.8% international' },
  { name: 'Mobile Money', countries: 'Via Flutterwave/intégration', fees: 'Variable' },
  { name: 'Stripe', countries: 'Limité Afrique', fees: '2.9% + 30¢' },
]

const WHEN_TO_OPEN = [
  { metric: 'Ventes/semaine', threshold: '20+ ventes', reason: 'Volume justifie l\'investissement' },
  { metric: 'CA mensuel', threshold: '500k+ FCFA', reason: 'Marge pour payer l\'abonnement' },
  { metric: 'Temps de gestion', threshold: '+3h/jour sur WhatsApp', reason: 'Automatisation nécessaire' },
  { metric: 'Clients récurrents', threshold: '30%+ reviennent', reason: 'Fidélisation plus facile' },
]

export function Shopify() {
  const { getModuleProgress, markModuleProgress } = useProgressStore()
  const progress = getModuleProgress('shopify')

  const handleMarkComplete = () => {
    markModuleProgress('shopify', 100)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Badge variant="gold" className="mb-2">Module 5</Badge>
          <h1 className="text-3xl font-bold font-playfair">
            <span className="gradient-text">Shopify Mastery</span>
          </h1>
          <p className="text-gray-500 mt-2">
            Crée ta boutique en ligne professionnelle
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Progress value={progress} className="w-32" />
          <span className="font-bold text-gold-dark">{progress}%</span>
        </div>
      </div>

      {/* Comparison */}
      <Card hover={false}>
        <CardHeader>
          <CardTitle>⚖️ WhatsApp vs Shopify - Le Comparatif</CardTitle>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-3 px-4 text-left font-bold">Critère</th>
                <th className="py-3 px-4 text-left font-bold text-green-600">💬 WhatsApp Only</th>
                <th className="py-3 px-4 text-left font-bold text-purple-600">🛒 Shopify</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 px-4 font-medium">{row.feature}</td>
                  <td className="py-3 px-4">{row.whatsapp}</td>
                  <td className="py-3 px-4">{row.shopify}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Setup Steps */}
      <Card hover={false}>
        <CardHeader>
          <CardTitle>🚀 Les 7 Étapes pour Lancer ta Boutique</CardTitle>
        </CardHeader>

        <div className="space-y-4">
          {SHOPIFY_STEPS.map((s) => (
            <div
              key={s.step}
              className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-dark-secondary rounded-xl"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-light rounded-xl flex items-center justify-center text-2xl">
                {s.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-bold">
                  <span className="text-gold-dark">Étape {s.step}:</span> {s.title}
                </h4>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Essential Apps */}
      <Card hover={false}>
        <CardHeader>
          <CardTitle>📱 Apps Essentielles (Gratuites)</CardTitle>
        </CardHeader>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ESSENTIAL_APPS.map((app, i) => (
            <div key={i} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
              <h4 className="font-bold text-gold-dark">{app.name}</h4>
              <p className="text-sm text-gray-500 mb-2">{app.desc}</p>
              <Badge variant="success" size="sm">{app.price}</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Payment Methods */}
      <Card hover={false}>
        <CardHeader>
          <CardTitle>💳 Solutions de Paiement Afrique</CardTitle>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-3 px-4 text-left font-bold">Solution</th>
                <th className="py-3 px-4 text-left font-bold">Pays</th>
                <th className="py-3 px-4 text-left font-bold">Frais</th>
              </tr>
            </thead>
            <tbody>
              {PAYMENT_METHODS.map((pm, i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 px-4 font-semibold text-gold-dark">{pm.name}</td>
                  <td className="py-3 px-4">{pm.countries}</td>
                  <td className="py-3 px-4">{pm.fees}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* When to Open */}
      <Card variant="gold" hover={false}>
        <h2 className="text-xl font-bold font-playfair mb-4">⏰ Quand ouvrir ta boutique Shopify ?</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Ne te précipite pas ! Ouvre Shopify quand tu atteins au moins 2 de ces critères :
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {WHEN_TO_OPEN.map((item, i) => (
            <div key={i} className="bg-white dark:bg-dark-card p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gold-dark">{item.metric}</span>
                <Badge variant="gold" size="sm">{item.threshold}</Badge>
              </div>
              <p className="text-sm text-gray-500">{item.reason}</p>
            </div>
          ))}
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
