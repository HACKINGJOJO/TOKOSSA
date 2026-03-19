import { useState } from 'react'
import { Card, Badge } from '@/components/ui'
import { ChevronDown, ChevronUp, TrendingUp, Clock, Target, Star } from 'lucide-react'

const CASE_STUDIES = [
  {
    id: 1,
    title: 'De 0 à 500k FCFA en 30 jours',
    category: 'Mode',
    author: 'Aminata K.',
    duration: '30 jours',
    investment: '150k FCFA',
    revenue: '500k FCFA',
    profit: '280k FCFA',
    roi: '186%',
    image: '👗',
    summary: 'Comment Aminata a lancé sa boutique de robes Ankara en partant de zéro.',
    challenge: 'Aminata avait 0 followers, pas de réseau, et un petit budget de 150k FCFA. Elle ne savait pas quel produit choisir ni comment vendre sur les réseaux.',
    strategy: [
      'Choix de niche: Robes Ankara modernes pour femmes 25-40 ans',
      'Sourcing: Marché Dantokpa - 10 robes variées à 5k chacune',
      'Setup: Page Facebook + WhatsApp Business en 1 jour',
      'Contenu: 2 posts/jour avec photos de qualité (lumière naturelle)',
      'Prix: 15k FCFA par robe (marge x3)',
      'Lancement: Promo -20% pour les 5 premiers clients'
    ],
    results: [
      'Semaine 1: 3 ventes (45k FCFA)',
      'Semaine 2: 8 ventes (120k FCFA)',
      'Semaine 3: 12 ventes (180k FCFA)',
      'Semaine 4: 10 ventes + 5 clients récurrents (155k FCFA)'
    ],
    lessons: [
      'La qualité des photos fait 80% du travail',
      'Les témoignages clients = meilleure publicité',
      'Répondre vite sur WhatsApp = plus de ventes',
      'Commencer petit permet de tester sans risque'
    ],
    rating: 5
  },
  {
    id: 2,
    title: 'Lancement Cosmétiques Bio',
    category: 'Beauté',
    author: 'Fatou D.',
    duration: '60 jours',
    investment: '300k FCFA',
    revenue: '1.2M FCFA',
    profit: '650k FCFA',
    roi: '216%',
    image: '💄',
    summary: 'Fatou a créé une marque de cosmétiques bio locaux qui cartonne.',
    challenge: 'Fatou voulait vendre des produits naturels mais le marché était saturé de produits importés. Comment se différencier?',
    strategy: [
      'USP unique: "Made in Benin" + ingrédients locaux (karité, baobab)',
      'Packaging premium avec étiquettes personnalisées',
      'Partenariat avec 3 micro-influenceuses locales',
      'Contenu éducatif: Bienfaits des ingrédients naturels',
      'Gamme de 5 produits seulement (focus)',
      'Prix premium justifié par la qualité'
    ],
    results: [
      'Mois 1: Construction audience (500 followers)',
      'Mois 2: 80 ventes, 5 revendeurs intéressés',
      'CA mensuel stabilisé à 600k FCFA'
    ],
    lessons: [
      'Le storytelling local crée un attachement fort',
      'Moins de produits = meilleure gestion',
      'Les influenceuses locales sont abordables et efficaces',
      'Le bio/naturel a un vrai marché au Bénin'
    ],
    rating: 5
  },
  {
    id: 3,
    title: 'Dropshipping Accessoires Tech',
    category: 'Tech',
    author: 'Koffi M.',
    duration: '45 jours',
    investment: '200k FCFA',
    revenue: '450k FCFA',
    profit: '180k FCFA',
    roi: '90%',
    image: '🎧',
    summary: 'Test du dropshipping avec des accessoires tech depuis la Chine.',
    challenge: 'Koffi voulait tester le dropshipping mais les délais de livraison (30-45 jours) étaient un frein.',
    strategy: [
      'Produits: Écouteurs Bluetooth, coques iPhone, chargeurs',
      'Fournisseur: CJ Dropshipping (stock en Chine)',
      'Communication claire: "Livraison 25-35 jours"',
      'Prix bas pour compenser le délai',
      'Pub Facebook: 5k/jour ciblant les jeunes urbains',
      'SAV proactif: Suivi commande par WhatsApp'
    ],
    results: [
      '50 commandes en 45 jours',
      '15% d\'annulations (délai)',
      'Marge nette: 40% après pub',
      'Base de 200+ contacts WhatsApp'
    ],
    lessons: [
      'Le dropshipping marche mais la patience client est limitée',
      'Mieux vaut stocker les bestsellers localement',
      'La transparence sur les délais réduit les problèmes',
      'Les produits tech ont une bonne marge mais forte concurrence'
    ],
    rating: 4
  },
  {
    id: 4,
    title: 'Scaling avec Facebook Ads',
    category: 'Pub',
    author: 'Serge A.',
    duration: '90 jours',
    investment: '500k FCFA pub',
    revenue: '2.5M FCFA',
    profit: '1.2M FCFA',
    roi: '240%',
    image: '📱',
    summary: 'Comment Serge a multiplié ses ventes par 5 avec les Facebook Ads.',
    challenge: 'Serge avait une boutique qui marchait bien en organique mais stagnait à 500k/mois. Il voulait passer au niveau supérieur.',
    strategy: [
      'Phase 1: Test 10 créatifs différents (5k/créatif)',
      'Phase 2: Identifier les 2 meilleures pubs',
      'Phase 3: Scaling progressif (+20%/jour)',
      'Retargeting des visiteurs et paniers abandonnés',
      'Lookalike audiences basées sur les acheteurs',
      'Optimisation quotidienne des campagnes'
    ],
    results: [
      'ROAS moyen: 5x (1 FCFA dépensé = 5 FCFA revenus)',
      'CPA: 2000 FCFA par client',
      'Passage de 500k à 2.5M/mois',
      '3 employés embauchés pour gérer le volume'
    ],
    lessons: [
      'Tester avant de scaler est CRUCIAL',
      'Les vidéos convertissent 3x mieux que les images',
      'Le retargeting a le meilleur ROI',
      'Scaling trop rapide = coûts qui explosent'
    ],
    rating: 5
  }
]

export function CasPratiques() {
  const [expandedCase, setExpandedCase] = useState<number | null>(null)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <Badge variant="gold" className="mb-2">Ressources</Badge>
        <h1 className="text-3xl font-bold font-playfair">
          <span className="gradient-text">Cas Pratiques</span>
        </h1>
        <p className="text-gray-500 mt-2">
          {CASE_STUDIES.length} success stories détaillées pour t'inspirer
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-3xl font-bold text-gold-dark">4.6M+</div>
          <div className="text-sm text-gray-500">FCFA générés</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-green-600">183%</div>
          <div className="text-sm text-gray-500">ROI moyen</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-blue-600">56</div>
          <div className="text-sm text-gray-500">Jours en moyenne</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-purple-600">4</div>
          <div className="text-sm text-gray-500">Success stories</div>
        </Card>
      </div>

      {/* Case Studies */}
      <div className="space-y-6">
        {CASE_STUDIES.map((study) => (
          <Card key={study.id} hover={false} className="overflow-hidden">
            {/* Header */}
            <div
              className="cursor-pointer"
              onClick={() => setExpandedCase(expandedCase === study.id ? null : study.id)}
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold-light rounded-xl flex items-center justify-center text-3xl shrink-0">
                  {study.image}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg">{study.title}</h3>
                    <Badge variant="default" size="sm">{study.category}</Badge>
                  </div>
                  <p className="text-gray-500 text-sm mb-2">{study.summary}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-gray-500">
                      <Clock className="w-4 h-4" /> {study.duration}
                    </span>
                    <span className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="w-4 h-4" /> {study.roi} ROI
                    </span>
                    <span className="flex items-center gap-1 text-gold-dark">
                      {[...Array(study.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-gold" />
                      ))}
                    </span>
                  </div>
                </div>
                <div className="shrink-0">
                  {expandedCase === study.id ? (
                    <ChevronUp className="w-6 h-6 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Investissement</p>
                  <p className="font-bold text-red-600">{study.investment}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">CA</p>
                  <p className="font-bold text-blue-600">{study.revenue}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Profit</p>
                  <p className="font-bold text-green-600">{study.profit}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Par</p>
                  <p className="font-bold">{study.author}</p>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedCase === study.id && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 animate-fade-in">
                {/* Challenge */}
                <div className="mb-6">
                  <h4 className="font-bold text-gold-dark mb-2 flex items-center gap-2">
                    <Target className="w-5 h-5" /> Le Défi
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-dark-secondary p-4 rounded-xl">
                    {study.challenge}
                  </p>
                </div>

                {/* Strategy */}
                <div className="mb-6">
                  <h4 className="font-bold text-gold-dark mb-2">La Stratégie</h4>
                  <div className="space-y-2">
                    {study.strategy.map((step, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Results */}
                <div className="mb-6">
                  <h4 className="font-bold text-gold-dark mb-2 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" /> Les Résultats
                  </h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {study.results.map((result, i) => (
                      <div key={i} className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <span className="text-green-600">✓</span>
                        <span className="text-gray-700 dark:text-gray-300">{result}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lessons */}
                <div className="bg-gold-pale dark:bg-gold/10 p-6 rounded-xl">
                  <h4 className="font-bold text-gold-dark mb-3">Leçons à retenir</h4>
                  <div className="space-y-2">
                    {study.lessons.map((lesson, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-gold-dark">💡</span>
                        <span className="text-gray-700 dark:text-gray-300">{lesson}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* CTA */}
      <Card variant="gold" hover={false}>
        <div className="text-center">
          <h3 className="font-bold font-playfair text-xl mb-2">
            La prochaine success story, c'est la tienne!
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Applique les stratégies de ces cas pratiques et partage ton succès avec la communauté.
          </p>
        </div>
      </Card>
    </div>
  )
}
