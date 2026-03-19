import { useState } from 'react'
import { Card, Badge, Button, Input } from '@/components/ui'
import { Search, ExternalLink, Star, Sparkles } from 'lucide-react'
import { cn } from '@/utils/helpers'

const TOOL_CATEGORIES = [
  { id: 'all', name: 'Tous', icon: '🔧' },
  { id: 'design', name: 'Design', icon: '🎨' },
  { id: 'photo', name: 'Photo/Vidéo', icon: '📸' },
  { id: 'ai', name: 'IA', icon: '🤖' },
  { id: 'marketing', name: 'Marketing', icon: '📢' },
  { id: 'analytics', name: 'Analytics', icon: '📊' },
  { id: 'ecommerce', name: 'E-commerce', icon: '🛒' },
]

const TOOLS = [
  // Design
  {
    id: 1,
    name: 'Canva',
    category: 'design',
    description: 'Création de visuels, logos, posts sociaux facilement',
    website: 'https://canva.com',
    pricing: 'Gratuit / Pro 12$/mois',
    rating: 5,
    useCases: ['Posts Instagram/Facebook', 'Logos', 'Stories', 'Catalogues'],
    tip: 'Utilise les templates "E-commerce" pour gagner du temps',
    icon: '🎨',
    essential: true
  },
  {
    id: 2,
    name: 'Figma',
    category: 'design',
    description: 'Design d\'interfaces et maquettes professionnelles',
    website: 'https://figma.com',
    pricing: 'Gratuit / Pro 15$/mois',
    rating: 5,
    useCases: ['Maquettes site', 'Prototypes', 'UI/UX', 'Collaboration'],
    tip: 'Parfait pour designer ton site avant de le créer',
    icon: '✏️',
    essential: false
  },
  {
    id: 3,
    name: 'Remove.bg',
    category: 'photo',
    description: 'Suppression automatique de l\'arrière-plan des images',
    website: 'https://remove.bg',
    pricing: 'Gratuit (limité) / Crédit',
    rating: 5,
    useCases: ['Photos produits', 'Détourage', 'Fond blanc', 'Montages'],
    tip: 'Indispensable pour des photos produits pro sur fond blanc',
    icon: '✂️',
    essential: true
  },
  {
    id: 4,
    name: 'CapCut',
    category: 'photo',
    description: 'Montage vidéo gratuit avec effets tendance',
    website: 'https://capcut.com',
    pricing: 'Gratuit',
    rating: 5,
    useCases: ['Reels', 'TikToks', 'Vidéos produits', 'Témoignages'],
    tip: 'Les templates viraux sont parfaits pour les réseaux',
    icon: '🎬',
    essential: true
  },
  {
    id: 5,
    name: 'Lightroom Mobile',
    category: 'photo',
    description: 'Retouche photo professionnelle sur mobile',
    website: 'https://lightroom.adobe.com',
    pricing: 'Gratuit (fonctions de base)',
    rating: 4,
    useCases: ['Retouche photos', 'Presets', 'Filtres', 'Couleurs'],
    tip: 'Crée un preset unique pour toutes tes photos = cohérence visuelle',
    icon: '📷',
    essential: false
  },
  // IA
  {
    id: 6,
    name: 'ChatGPT',
    category: 'ai',
    description: 'Assistant IA pour rédiger textes, descriptions, emails',
    website: 'https://chat.openai.com',
    pricing: 'Gratuit / Plus 20$/mois',
    rating: 5,
    useCases: ['Descriptions produits', 'Emails', 'Scripts vente', 'Idées'],
    tip: 'Donne-lui le contexte de ton produit + ta cible pour de meilleurs résultats',
    icon: '🤖',
    essential: true
  },
  {
    id: 7,
    name: 'Google Gemini',
    category: 'ai',
    description: 'IA Google multimodale pour texte et images',
    website: 'https://gemini.google.com',
    pricing: 'Gratuit / Advanced 20$/mois',
    rating: 5,
    useCases: ['Analyse images', 'Génération texte', 'Recherche', 'Brainstorm'],
    tip: 'Peut analyser tes photos produits et suggérer des améliorations',
    icon: '✨',
    essential: true
  },
  {
    id: 8,
    name: 'Midjourney',
    category: 'ai',
    description: 'Génération d\'images par IA de haute qualité',
    website: 'https://midjourney.com',
    pricing: '10$/mois',
    rating: 4,
    useCases: ['Visuels créatifs', 'Mockups', 'Bannières', 'Art'],
    tip: 'Génère des visuels lifestyle pour tes produits',
    icon: '🎭',
    essential: false
  },
  // Marketing
  {
    id: 9,
    name: 'Meta Business Suite',
    category: 'marketing',
    description: 'Gestion Facebook/Instagram, posts programmés, analytics',
    website: 'https://business.facebook.com',
    pricing: 'Gratuit',
    rating: 5,
    useCases: ['Programmation posts', 'Statistiques', 'Messages', 'Pub'],
    tip: 'Programme tes posts à l\'avance pour être régulier',
    icon: '📱',
    essential: true
  },
  {
    id: 10,
    name: 'WhatsApp Business',
    category: 'marketing',
    description: 'Messagerie pro avec catalogue et réponses rapides',
    website: 'https://business.whatsapp.com',
    pricing: 'Gratuit',
    rating: 5,
    useCases: ['SAV', 'Commandes', 'Catalogue', 'Réponses auto'],
    tip: 'Configure les réponses rapides pour tes questions fréquentes',
    icon: '💬',
    essential: true
  },
  {
    id: 11,
    name: 'Mailchimp',
    category: 'marketing',
    description: 'Email marketing et newsletters',
    website: 'https://mailchimp.com',
    pricing: 'Gratuit jusqu\'à 500 contacts',
    rating: 4,
    useCases: ['Newsletters', 'Promotions', 'Relance panier', 'Fidélisation'],
    tip: 'Envoie un email de bienvenue automatique aux nouveaux clients',
    icon: '📧',
    essential: false
  },
  // Analytics
  {
    id: 12,
    name: 'Google Analytics',
    category: 'analytics',
    description: 'Statistiques détaillées de ton site web',
    website: 'https://analytics.google.com',
    pricing: 'Gratuit',
    rating: 5,
    useCases: ['Trafic', 'Conversions', 'Audience', 'Sources'],
    tip: 'Configure les objectifs pour tracker tes ventes',
    icon: '📊',
    essential: true
  },
  {
    id: 13,
    name: 'Hotjar',
    category: 'analytics',
    description: 'Heatmaps et enregistrements de sessions utilisateurs',
    website: 'https://hotjar.com',
    pricing: 'Gratuit (limité)',
    rating: 4,
    useCases: ['Heatmaps', 'Recordings', 'Feedback', 'UX'],
    tip: 'Vois où tes visiteurs cliquent et optimise ton site',
    icon: '🔥',
    essential: false
  },
  // E-commerce
  {
    id: 14,
    name: 'Shopify',
    category: 'ecommerce',
    description: 'Plateforme e-commerce complète et facile',
    website: 'https://shopify.com',
    pricing: '29$/mois',
    rating: 5,
    useCases: ['Boutique en ligne', 'Paiements', 'Stock', 'Livraison'],
    tip: 'Utilise le thème Dawn (gratuit) pour un design moderne',
    icon: '🛒',
    essential: true
  },
  {
    id: 15,
    name: 'WooCommerce',
    category: 'ecommerce',
    description: 'Plugin e-commerce gratuit pour WordPress',
    website: 'https://woocommerce.com',
    pricing: 'Gratuit (+ hébergement)',
    rating: 4,
    useCases: ['Boutique WordPress', 'Personnalisation', 'Extensions'],
    tip: 'Plus de contrôle mais demande plus de technique',
    icon: '🔧',
    essential: false
  },
  {
    id: 16,
    name: 'Notion',
    category: 'ecommerce',
    description: 'Organisation, notes, bases de données tout-en-un',
    website: 'https://notion.so',
    pricing: 'Gratuit',
    rating: 5,
    useCases: ['Gestion stock', 'To-do', 'CRM simple', 'Notes'],
    tip: 'Crée une base de données pour suivre tes commandes',
    icon: '📝',
    essential: true
  },
]

export function Outils() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showEssentialOnly, setShowEssentialOnly] = useState(false)

  const filteredTools = TOOLS.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesEssential = !showEssentialOnly || tool.essential
    return matchesCategory && matchesSearch && matchesEssential
  })

  const essentialCount = TOOLS.filter(t => t.essential).length

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <Badge variant="gold" className="mb-2">Ressources</Badge>
        <h1 className="text-3xl font-bold font-playfair">
          <span className="gradient-text">Outils & IA</span>
        </h1>
        <p className="text-gray-500 mt-2">
          {TOOLS.length} outils pour booster ton business
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Rechercher un outil..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12"
          />
        </div>
        <Button
          variant={showEssentialOnly ? 'gold' : 'outline'}
          onClick={() => setShowEssentialOnly(!showEssentialOnly)}
        >
          <Star className="w-4 h-4 mr-2" />
          Essentiels ({essentialCount})
        </Button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {TOOL_CATEGORIES.map(cat => (
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

      {/* Tools Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map(tool => (
          <Card key={tool.id} className="relative">
            {tool.essential && (
              <div className="absolute top-3 right-3">
                <Badge variant="gold" size="sm">
                  <Star className="w-3 h-3 mr-1" />
                  Essentiel
                </Badge>
              </div>
            )}

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-100 dark:bg-dark-secondary rounded-xl flex items-center justify-center text-2xl">
                {tool.icon}
              </div>
              <div>
                <h3 className="font-bold">{tool.name}</h3>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-3 h-3',
                        i < tool.rating ? 'text-gold fill-gold' : 'text-gray-300'
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            <p className="text-gray-500 text-sm mb-4">{tool.description}</p>

            <div className="flex flex-wrap gap-1 mb-4">
              {tool.useCases.map((use, i) => (
                <Badge key={i} variant="default" size="sm">{use}</Badge>
              ))}
            </div>

            <div className="p-3 bg-gold-pale dark:bg-gold/10 rounded-lg mb-4">
              <p className="text-sm">
                <span className="font-semibold text-gold-dark">💡 Tip:</span> {tool.tip}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{tool.pricing}</span>
              <a
                href={tool.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-gold-dark hover:text-gold transition-colors text-sm font-medium"
              >
                Visiter
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </Card>
        ))}
      </div>

      {/* Stack Recommandé */}
      <Card variant="gold" hover={false}>
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Stack recommandé pour démarrer
        </h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-dark-card p-4 rounded-xl text-center">
            <div className="text-3xl mb-2">🎨</div>
            <h4 className="font-semibold">Canva</h4>
            <p className="text-xs text-gray-500">Visuels</p>
          </div>
          <div className="bg-white dark:bg-dark-card p-4 rounded-xl text-center">
            <div className="text-3xl mb-2">🤖</div>
            <h4 className="font-semibold">ChatGPT</h4>
            <p className="text-xs text-gray-500">Textes</p>
          </div>
          <div className="bg-white dark:bg-dark-card p-4 rounded-xl text-center">
            <div className="text-3xl mb-2">💬</div>
            <h4 className="font-semibold">WhatsApp</h4>
            <p className="text-xs text-gray-500">Ventes</p>
          </div>
          <div className="bg-white dark:bg-dark-card p-4 rounded-xl text-center">
            <div className="text-3xl mb-2">📝</div>
            <h4 className="font-semibold">Notion</h4>
            <p className="text-xs text-gray-500">Organisation</p>
          </div>
        </div>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          Avec ces 4 outils gratuits, tu peux lancer ton business!
        </p>
      </Card>
    </div>
  )
}
