import { useState } from 'react'
import { Card, Badge, Button, Progress } from '@/components/ui'
import { Download, Check, CheckCircle, Gift, Sparkles, Target } from 'lucide-react'
import { cn } from '@/utils/helpers'

const KIT_ITEMS = [
  {
    id: 1,
    category: 'templates',
    name: 'Templates Canva E-commerce',
    description: '50+ templates de posts, stories et bannières',
    icon: '🎨',
    items: [
      'Posts produits (10 designs)',
      'Stories promotions (10 designs)',
      'Bannières Facebook (5 designs)',
      'Templates témoignages (5 designs)',
      'Visuels "Nouveau produit" (10 designs)',
      'Templates soldes/promos (10 designs)',
    ],
    downloadable: true
  },
  {
    id: 2,
    category: 'templates',
    name: 'Scripts WhatsApp',
    description: 'Messages types pour toutes les situations',
    icon: '💬',
    items: [
      'Message de bienvenue',
      'Présentation produit',
      'Réponse aux questions prix',
      'Closing de vente',
      'Confirmation commande',
      'Suivi livraison',
      'Demande de témoignage',
      'Relance client inactif',
    ],
    downloadable: true
  },
  {
    id: 3,
    category: 'outils',
    name: 'Calculateur de marge',
    description: 'Excel/Sheet pour calculer tes prix',
    icon: '📊',
    items: [
      'Calcul automatique de marge',
      'Simulation prix de vente',
      'Intégration frais de livraison',
      'Comparaison fournisseurs',
      'Seuil de rentabilité',
    ],
    downloadable: true
  },
  {
    id: 4,
    category: 'outils',
    name: 'Tracker de commandes',
    description: 'Suivi de toutes tes commandes',
    icon: '📦',
    items: [
      'Suivi statut commandes',
      'Informations clients',
      'Historique paiements',
      'Calcul CA automatique',
      'Dashboard mensuel',
    ],
    downloadable: true
  },
  {
    id: 5,
    category: 'outils',
    name: 'CRM Client Simple',
    description: 'Base de données clients sur Notion',
    icon: '👥',
    items: [
      'Fiche client complète',
      'Historique achats',
      'Notes et préférences',
      'Rappels de relance',
      'Segmentation clients',
    ],
    downloadable: true
  },
  {
    id: 6,
    category: 'guides',
    name: 'Checklist lancement',
    description: 'Liste complète pour ne rien oublier',
    icon: '✅',
    items: [
      'Préparation produits',
      'Configuration réseaux',
      'Visuels à créer',
      'Messages à préparer',
      'Tests avant lancement',
      'Actions jour J',
    ],
    downloadable: true
  },
  {
    id: 7,
    category: 'guides',
    name: 'Guide des hashtags',
    description: 'Hashtags performants par niche',
    icon: '#️⃣',
    items: [
      'Mode & Accessoires',
      'Beauté & Cosmétiques',
      'High-Tech',
      'Maison & Déco',
      'Enfants & Bébés',
      'Hashtags locaux Bénin',
    ],
    downloadable: true
  },
  {
    id: 8,
    category: 'guides',
    name: 'Calendrier éditorial',
    description: 'Planning de publication sur 30 jours',
    icon: '📅',
    items: [
      'Types de posts par jour',
      'Meilleurs horaires',
      'Idées de contenu',
      'Dates importantes',
      'Templates de planning',
    ],
    downloadable: true
  },
]

const CATEGORIES = [
  { id: 'all', name: 'Tout', icon: '📦' },
  { id: 'templates', name: 'Templates', icon: '🎨' },
  { id: 'outils', name: 'Outils', icon: '🛠️' },
  { id: 'guides', name: 'Guides', icon: '📚' },
]

export function KitDemarrage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [downloadedItems, setDownloadedItems] = useState<number[]>([])

  const filteredItems = KIT_ITEMS.filter(item =>
    selectedCategory === 'all' || item.category === selectedCategory
  )

  const toggleDownloaded = (id: number) => {
    setDownloadedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const progress = Math.round((downloadedItems.length / KIT_ITEMS.length) * 100)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <Badge variant="gold" className="mb-2">Ressources</Badge>
        <h1 className="text-3xl font-bold font-playfair">
          <span className="gradient-text">Kit de Démarrage</span>
        </h1>
        <p className="text-gray-500 mt-2">
          Tout ce dont tu as besoin pour démarrer ton business
        </p>
      </div>

      {/* Progress */}
      <Card variant="gold" hover={false}>
        <div className="flex items-center gap-4">
          <Gift className="w-10 h-10 text-gold-dark" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold">Ta progression</h3>
              <span className="text-2xl font-bold text-gold-dark">{progress}%</span>
            </div>
            <Progress value={progress} />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {downloadedItems.length}/{KIT_ITEMS.length} ressources téléchargées
            </p>
          </div>
        </div>
      </Card>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all',
              selectedCategory === cat.id
                ? 'bg-gold text-white'
                : 'bg-gray-100 dark:bg-dark-card hover:bg-gray-200 dark:hover:bg-dark-secondary'
            )}
          >
            <span>{cat.icon}</span>
            <span className="text-sm font-medium">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredItems.map(item => {
          const isDownloaded = downloadedItems.includes(item.id)

          return (
            <Card
              key={item.id}
              className={cn(
                'relative overflow-hidden transition-all',
                isDownloaded && 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/10'
              )}
              hover={false}
            >
              {isDownloaded && (
                <div className="absolute top-3 right-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
              )}

              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gray-100 dark:bg-dark-secondary rounded-xl flex items-center justify-center text-3xl">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {item.items.map((subItem, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{subItem}</span>
                  </div>
                ))}
              </div>

              <Button
                variant={isDownloaded ? 'success' : 'gold'}
                className="w-full"
                onClick={() => toggleDownloaded(item.id)}
              >
                {isDownloaded ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Téléchargé
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger (Bientôt)
                  </>
                )}
              </Button>
            </Card>
          )
        })}
      </div>

      {/* Bonus Section */}
      <Card hover={false}>
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gold-dark" />
          Bonus exclusifs
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl">
            <div className="text-2xl mb-2">🎁</div>
            <h4 className="font-semibold">Accès communauté</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Groupe privé d'entraide entre e-commerçants
            </p>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
            <div className="text-2xl mb-2">📞</div>
            <h4 className="font-semibold">Support WhatsApp</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Pose tes questions directement à l'équipe
            </p>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
            <div className="text-2xl mb-2">🔄</div>
            <h4 className="font-semibold">Mises à jour</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Nouvelles ressources ajoutées régulièrement
            </p>
          </div>
        </div>
      </Card>

      {/* Quick Start */}
      <Card variant="gold" hover={false}>
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Par où commencer?
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-3 bg-white dark:bg-dark-card rounded-xl">
            <div className="w-8 h-8 bg-gold text-white rounded-full flex items-center justify-center font-bold">1</div>
            <div>
              <h4 className="font-semibold">Calculateur de marge</h4>
              <p className="text-sm text-gray-500">Définis tes prix correctement dès le départ</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-white dark:bg-dark-card rounded-xl">
            <div className="w-8 h-8 bg-gold text-white rounded-full flex items-center justify-center font-bold">2</div>
            <div>
              <h4 className="font-semibold">Checklist lancement</h4>
              <p className="text-sm text-gray-500">Ne rien oublier avant de te lancer</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-white dark:bg-dark-card rounded-xl">
            <div className="w-8 h-8 bg-gold text-white rounded-full flex items-center justify-center font-bold">3</div>
            <div>
              <h4 className="font-semibold">Templates Canva</h4>
              <p className="text-sm text-gray-500">Crée tes premiers visuels rapidement</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-white dark:bg-dark-card rounded-xl">
            <div className="w-8 h-8 bg-gold text-white rounded-full flex items-center justify-center font-bold">4</div>
            <div>
              <h4 className="font-semibold">Scripts WhatsApp</h4>
              <p className="text-sm text-gray-500">Prêt à répondre à tes premiers clients!</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
