import { useState } from 'react'
import { useProgressStore } from '@/stores/progressStore'
import { Card, CardHeader, CardTitle, Button, Progress, Badge, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui'
import { CheckCircle, Target, DollarSign, Smartphone, Database } from 'lucide-react'
import { cn } from '@/utils/helpers'

const NICHES = [
  { name: 'Mode & Vêtements', icon: '👗', margin: '50-80%', demand: 'Très haute' },
  { name: 'Cosmétiques & Beauté', icon: '💄', margin: '60-100%', demand: 'Très haute' },
  { name: 'Accessoires', icon: '👜', margin: '40-70%', demand: 'Haute' },
  { name: 'Bébé & Enfants', icon: '👶', margin: '45-75%', demand: 'Moyenne' },
  { name: 'Bijoux', icon: '💎', margin: '70-150%', demand: 'Moyenne' },
  { name: 'Chaussures', icon: '👠', margin: '50-90%', demand: 'Haute' },
  { name: 'Sacs', icon: '👜', margin: '60-120%', demand: 'Haute' },
  { name: 'Décoration', icon: '🏠', margin: '50-100%', demand: 'Moyenne' },
  { name: 'Alimentation', icon: '🍯', margin: '30-60%', demand: 'Haute' },
  { name: 'Fitness & Sport', icon: '💪', margin: '50-90%', demand: 'Croissante' },
]

const BUDGET_LEVELS = [
  {
    name: 'Starter',
    budget: '100k - 300k FCFA',
    description: 'Idéal pour tester une niche avec peu de risque',
    stocks: '10-20 produits',
    objectif: '50k-100k/mois',
    color: 'from-blue-500 to-blue-400',
  },
  {
    name: 'Pro',
    budget: '500k - 1M FCFA',
    description: 'Pour scaler avec un stock confortable',
    stocks: '50-100 produits',
    objectif: '200k-500k/mois',
    color: 'from-gold to-gold-light',
  },
  {
    name: 'Empire',
    budget: '2M+ FCFA',
    description: 'Multi-niches, équipe, scaling agressif',
    stocks: '200+ produits',
    objectif: '1M+/mois',
    color: 'from-purple-500 to-purple-400',
  },
]

const STACK_DIGITAL = [
  { name: 'Page Facebook', icon: '📘', desc: 'Vitrine principale, posts et engagement' },
  { name: 'Compte Instagram', icon: '📸', desc: 'Visuels, stories, reels' },
  { name: 'WhatsApp Business', icon: '💬', desc: 'Vente directe, relation client' },
  { name: 'Catalogue produits', icon: '📋', desc: 'Photos HD, descriptions vendeuses' },
]

export function Fondations() {
  const { getModuleProgress, markModuleProgress } = useProgressStore()
  const [, setCompleted] = useState(false)
  const progress = getModuleProgress('fondations')

  const handleMarkComplete = () => {
    markModuleProgress('fondations', 100)
    setCompleted(true)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Badge variant="gold" className="mb-2">Module 1</Badge>
          <h1 className="text-3xl font-bold font-playfair">
            <span className="gradient-text">Fondations Stratégiques</span>
          </h1>
          <p className="text-gray-500 mt-2">
            Les bases solides pour lancer ton empire e-commerce
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Progress value={progress} className="w-32" />
          <span className="font-bold text-gold-dark">{progress}%</span>
        </div>
      </div>

      {/* Content */}
      <Tabs defaultTab="niches">
        <TabsList>
          <TabsTrigger value="niches">
            <Target className="w-4 h-4 mr-2" />
            Niches
          </TabsTrigger>
          <TabsTrigger value="pricing">
            <DollarSign className="w-4 h-4 mr-2" />
            Pricing & Budget
          </TabsTrigger>
          <TabsTrigger value="stack">
            <Smartphone className="w-4 h-4 mr-2" />
            Stack Digital
          </TabsTrigger>
          <TabsTrigger value="gestion">
            <Database className="w-4 h-4 mr-2" />
            Gestion Stock
          </TabsTrigger>
        </TabsList>

        {/* Niches Tab */}
        <TabsContent value="niches">
          <Card hover={false}>
            <CardHeader>
              <CardTitle>🎯 Les 10 Niches Ultra-Rentables au Bénin</CardTitle>
            </CardHeader>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {NICHES.map((niche, i) => (
                <div
                  key={i}
                  className={cn(
                    'p-4 rounded-xl border-2 border-gray-100 dark:border-gray-800',
                    'hover:border-gold hover:shadow-lg transition-all cursor-pointer'
                  )}
                >
                  <div className="text-3xl mb-2">{niche.icon}</div>
                  <h3 className="font-bold text-gold-dark">{niche.name}</h3>
                  <div className="mt-2 space-y-1 text-sm">
                    <p className="text-gray-500">
                      Marge: <span className="font-semibold text-green-600">{niche.margin}</span>
                    </p>
                    <p className="text-gray-500">
                      Demande: <span className="font-semibold">{niche.demand}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gold-pale dark:bg-gold/10 p-6 rounded-xl">
              <h4 className="font-bold text-gold-dark mb-3">💡 Stratégie "Mix 3 Niches"</h4>
              <p className="text-gray-700 dark:text-gray-300">
                Ne te limite pas à une seule niche ! Combine 3 niches complémentaires pour diversifier
                tes revenus et réduire les risques. Exemple : Mode + Accessoires + Bijoux.
              </p>
            </div>
          </Card>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing">
          <Card hover={false}>
            <CardHeader>
              <CardTitle>💰 Pricing & Niveaux de Budget</CardTitle>
            </CardHeader>

            <div className="mb-8">
              <h4 className="font-bold mb-4">📐 Formule de Prix Magique</h4>
              <div className="bg-gray-100 dark:bg-dark-secondary p-6 rounded-xl text-center">
                <p className="text-2xl font-bold font-playfair text-gold-dark">
                  Prix de Vente = (Prix d'achat × 2.5) + Frais
                </p>
                <p className="text-gray-500 mt-2">
                  Minimum 50% de marge nette pour être rentable
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {BUDGET_LEVELS.map((level, i) => (
                <div
                  key={i}
                  className={cn(
                    'relative overflow-hidden rounded-2xl p-6 text-white',
                    `bg-gradient-to-br ${level.color}`
                  )}
                >
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
                  <h3 className="text-xl font-bold mb-1">{level.name}</h3>
                  <p className="text-2xl font-black font-playfair mb-3">{level.budget}</p>
                  <p className="text-sm opacity-90 mb-4">{level.description}</p>
                  <div className="space-y-2 text-sm">
                    <p>📦 Stock: {level.stocks}</p>
                    <p>🎯 Objectif: {level.objectif}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-200 dark:border-red-800">
              <h4 className="font-bold text-red-600 dark:text-red-400 mb-3">
                ❌ Erreurs à éviter
              </h4>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Ne pas calculer ses marges avant de commander</li>
                <li>• Vendre trop cher ou trop peu cher</li>
                <li>• Oublier les frais (livraison, packaging, pub)</li>
                <li>• Investir tout son budget d'un coup</li>
              </ul>
            </div>
          </Card>
        </TabsContent>

        {/* Stack Digital Tab */}
        <TabsContent value="stack">
          <Card hover={false}>
            <CardHeader>
              <CardTitle>📱 Ton Stack Digital Minimaliste</CardTitle>
            </CardHeader>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Pas besoin de 10 outils. Ces 4 essentiels suffisent pour démarrer et vendre.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {STACK_DIGITAL.map((tool, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-5 bg-gray-50 dark:bg-dark-secondary rounded-xl"
                >
                  <div className="text-3xl">{tool.icon}</div>
                  <div>
                    <h4 className="font-bold text-gold-dark">{tool.name}</h4>
                    <p className="text-sm text-gray-500">{tool.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gold-pale dark:bg-gold/10 p-6 rounded-xl">
              <h4 className="font-bold text-gold-dark mb-3">🚀 Setup rapide (1 journée)</h4>
              <ol className="space-y-2 text-gray-700 dark:text-gray-300 list-decimal list-inside">
                <li>Créer ta Page Facebook Business</li>
                <li>Lier ton compte Instagram</li>
                <li>Configurer WhatsApp Business avec réponses rapides</li>
                <li>Préparer ton catalogue de 5-10 produits</li>
              </ol>
            </div>
          </Card>
        </TabsContent>

        {/* Gestion Stock Tab */}
        <TabsContent value="gestion">
          <Card hover={false}>
            <CardHeader>
              <CardTitle>📊 Gestion Stock & CRM Simple</CardTitle>
            </CardHeader>

            <div className="mb-8">
              <h4 className="font-bold mb-4">📋 Google Sheets = Ton meilleur ami</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Un simple tableur Google Sheets suffit pour gérer ton stock et tes clients.
                Pas besoin de logiciel compliqué au début.
              </p>

              <div className="bg-gray-100 dark:bg-dark-secondary p-6 rounded-xl">
                <h5 className="font-semibold mb-3">Colonnes essentielles :</h5>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-gold-dark">📦 Feuille Stock</p>
                    <ul className="mt-2 space-y-1 text-gray-600 dark:text-gray-400">
                      <li>• Nom produit</li>
                      <li>• Prix achat / Prix vente</li>
                      <li>• Quantité en stock</li>
                      <li>• Seuil d'alerte</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-gold-dark">👥 Feuille Clients</p>
                    <ul className="mt-2 space-y-1 text-gray-600 dark:text-gray-400">
                      <li>• Nom / WhatsApp</li>
                      <li>• Produits achetés</li>
                      <li>• Date commande</li>
                      <li>• Statut (payé/livré)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
              <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-3">
                📏 Règle 7-3-1
              </h4>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>7</strong> - Réassort quand il reste 7 pièces d'un produit qui marche</li>
                <li><strong>3</strong> - Teste avec 3 pièces maximum pour un nouveau produit</li>
                <li><strong>1</strong> - 1 seul fournisseur principal par catégorie au début</li>
              </ul>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Practice Section */}
      <Card variant="gold" hover={false}>
        <h2 className="text-xl font-bold font-playfair mb-4">📝 En pratique : Ma niche en 1 page</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Avant de passer au module suivant, définis ces 4 points :
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-dark-card p-4 rounded-xl">
            <p className="font-semibold text-gold-dark">1. Ma niche principale</p>
            <p className="text-sm text-gray-500">Ex: Mode féminine casual</p>
          </div>
          <div className="bg-white dark:bg-dark-card p-4 rounded-xl">
            <p className="font-semibold text-gold-dark">2. Ma cible</p>
            <p className="text-sm text-gray-500">Ex: Femmes 25-40 ans, Cotonou</p>
          </div>
          <div className="bg-white dark:bg-dark-card p-4 rounded-xl">
            <p className="font-semibold text-gold-dark">3. Mes 3 concurrents</p>
            <p className="text-sm text-gray-500">Pages/boutiques à surveiller</p>
          </div>
          <div className="bg-white dark:bg-dark-card p-4 rounded-xl">
            <p className="font-semibold text-gold-dark">4. Mon 1er produit test</p>
            <p className="text-sm text-gray-500">Le produit pour démarrer</p>
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
