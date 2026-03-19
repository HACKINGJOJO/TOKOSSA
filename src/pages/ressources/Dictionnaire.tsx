import { useState } from 'react'
import { Card, Badge, Input } from '@/components/ui'
import { Search, BookOpen } from 'lucide-react'
import { cn } from '@/utils/helpers'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const TERMS = [
  // A
  { term: 'AIDA', definition: 'Attention, Intérêt, Désir, Action - Structure de copywriting pour vendre', category: 'Marketing' },
  { term: 'AOV', definition: 'Average Order Value - Panier moyen d\'un client', category: 'Métrique' },
  { term: 'Audience Lookalike', definition: 'Audience similaire à tes clients existants, créée par Facebook', category: 'Pub' },

  // B
  { term: 'B2B', definition: 'Business to Business - Vente entre entreprises', category: 'Business' },
  { term: 'B2C', definition: 'Business to Consumer - Vente aux particuliers', category: 'Business' },
  { term: 'Bounce Rate', definition: 'Taux de rebond - Visiteurs qui quittent sans action', category: 'Métrique' },
  { term: 'Branding', definition: 'Construction de l\'image de marque', category: 'Marketing' },

  // C
  { term: 'CAC', definition: 'Coût d\'Acquisition Client - Combien tu paies pour avoir 1 client', category: 'Métrique' },
  { term: 'Closing', definition: 'Techniques pour finaliser une vente', category: 'Vente' },
  { term: 'Conversion', definition: 'Quand un visiteur devient client (achat)', category: 'Métrique' },
  { term: 'CPA', definition: 'Coût Par Acquisition - Prix payé par vente obtenue', category: 'Pub' },
  { term: 'CPC', definition: 'Coût Par Clic - Prix payé à chaque clic sur ta pub', category: 'Pub' },
  { term: 'CPM', definition: 'Coût Pour Mille - Prix pour 1000 affichages', category: 'Pub' },
  { term: 'CTA', definition: 'Call To Action - Bouton/texte qui incite à agir', category: 'Marketing' },
  { term: 'CTR', definition: 'Click Through Rate - Taux de clic', category: 'Métrique' },

  // D
  { term: 'Dropshipping', definition: 'Vente sans stock - Le fournisseur expédie directement', category: 'Business' },

  // E
  { term: 'E-commerce', definition: 'Commerce électronique - Vente en ligne', category: 'Business' },
  { term: 'Engagement', definition: 'Interactions (likes, commentaires, partages)', category: 'Social' },

  // F
  { term: 'Funnel', definition: 'Tunnel de vente - Parcours du visiteur vers l\'achat', category: 'Marketing' },
  { term: 'FOMO', definition: 'Fear Of Missing Out - Peur de rater une opportunité', category: 'Psycho' },

  // G
  { term: 'GMV', definition: 'Gross Merchandise Value - Valeur totale des ventes', category: 'Métrique' },

  // I
  { term: 'Impression', definition: 'Une vue de ta pub/post', category: 'Pub' },
  { term: 'Influenceur', definition: 'Personne avec une audience qui peut promouvoir', category: 'Marketing' },

  // K
  { term: 'KPI', definition: 'Key Performance Indicator - Indicateur clé de performance', category: 'Métrique' },

  // L
  { term: 'Landing Page', definition: 'Page d\'atterrissage optimisée pour convertir', category: 'Web' },
  { term: 'Lead', definition: 'Prospect/contact potentiellement intéressé', category: 'Vente' },
  { term: 'LTV', definition: 'Lifetime Value - Valeur totale d\'un client sur la durée', category: 'Métrique' },

  // M
  { term: 'Marge', definition: 'Différence entre prix de vente et prix d\'achat', category: 'Finance' },
  { term: 'MOQ', definition: 'Minimum Order Quantity - Quantité minimum de commande', category: 'Sourcing' },

  // N
  { term: 'Niche', definition: 'Segment de marché spécifique ciblé', category: 'Business' },

  // O
  { term: 'Organic', definition: 'Trafic/ventes sans publicité payante', category: 'Marketing' },

  // P
  { term: 'Pixel Facebook', definition: 'Code de tracking pour suivre les conversions', category: 'Pub' },
  { term: 'POD', definition: 'Print On Demand - Impression à la demande', category: 'Business' },
  { term: 'Proof', definition: 'Preuve sociale (témoignages, avis)', category: 'Marketing' },

  // R
  { term: 'Reach', definition: 'Portée - Nombre de personnes touchées', category: 'Social' },
  { term: 'Retargeting', definition: 'Recibler les visiteurs qui n\'ont pas acheté', category: 'Pub' },
  { term: 'ROI', definition: 'Return On Investment - Retour sur investissement', category: 'Finance' },
  { term: 'ROAS', definition: 'Return On Ad Spend - Retour sur dépense publicitaire', category: 'Pub' },

  // S
  { term: 'Scaling', definition: 'Augmenter les volumes (pub, ventes)', category: 'Business' },
  { term: 'SEO', definition: 'Search Engine Optimization - Référencement naturel', category: 'Web' },
  { term: 'SKU', definition: 'Stock Keeping Unit - Référence produit unique', category: 'Stock' },
  { term: 'Social Proof', definition: 'Preuve sociale - Avis, témoignages clients', category: 'Marketing' },
  { term: 'Sourcing', definition: 'Recherche de fournisseurs/produits', category: 'Sourcing' },

  // T
  { term: 'Targeting', definition: 'Ciblage publicitaire', category: 'Pub' },
  { term: 'Taux de conversion', definition: 'Pourcentage de visiteurs qui achètent', category: 'Métrique' },

  // U
  { term: 'UGC', definition: 'User Generated Content - Contenu créé par les utilisateurs', category: 'Marketing' },
  { term: 'Upsell', definition: 'Proposer un produit plus cher/premium', category: 'Vente' },
  { term: 'USP', definition: 'Unique Selling Proposition - Argument de vente unique', category: 'Marketing' },

  // V
  { term: 'Viral', definition: 'Contenu qui se propage rapidement', category: 'Social' },

  // W
  { term: 'Wholesale', definition: 'Vente en gros', category: 'Business' },
]

const CATEGORIES = [...new Set(TERMS.map(t => t.category))]

export function Dictionnaire() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredTerms = TERMS.filter(t => {
    const matchesSearch = t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.definition.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLetter = !selectedLetter || t.term.startsWith(selectedLetter)
    const matchesCategory = !selectedCategory || t.category === selectedCategory
    return matchesSearch && matchesLetter && matchesCategory
  }).sort((a, b) => a.term.localeCompare(b.term))

  // Group by first letter
  const groupedTerms = filteredTerms.reduce((acc, term) => {
    const letter = term.term[0].toUpperCase()
    if (!acc[letter]) acc[letter] = []
    acc[letter].push(term)
    return acc
  }, {} as Record<string, typeof TERMS>)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <Badge variant="gold" className="mb-2">Ressources</Badge>
        <h1 className="text-3xl font-bold font-playfair">
          <span className="gradient-text">Dictionnaire E-commerce</span>
        </h1>
        <p className="text-gray-500 mt-2">
          {TERMS.length} termes essentiels expliqués simplement
        </p>
      </div>

      {/* Search */}
      <Card hover={false}>
        <Input
          placeholder="Rechercher un terme..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          className="mb-4"
        />

        {/* Alphabet */}
        <div className="flex flex-wrap gap-1 mb-4">
          <button
            onClick={() => setSelectedLetter(null)}
            className={cn(
              'w-8 h-8 rounded-lg text-sm font-bold transition-all',
              selectedLetter === null
                ? 'bg-gold text-white'
                : 'bg-gray-100 dark:bg-dark-secondary hover:bg-gold/20'
            )}
          >
            #
          </button>
          {ALPHABET.map(letter => {
            const hasTerms = TERMS.some(t => t.term.startsWith(letter))
            return (
              <button
                key={letter}
                onClick={() => hasTerms && setSelectedLetter(letter === selectedLetter ? null : letter)}
                disabled={!hasTerms}
                className={cn(
                  'w-8 h-8 rounded-lg text-sm font-bold transition-all',
                  selectedLetter === letter
                    ? 'bg-gold text-white'
                    : hasTerms
                      ? 'bg-gray-100 dark:bg-dark-secondary hover:bg-gold/20'
                      : 'bg-gray-50 dark:bg-dark-secondary text-gray-300 cursor-not-allowed'
                )}
              >
                {letter}
              </button>
            )
          })}
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === null ? 'gold' : 'default'}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(null)}
          >
            Toutes
          </Badge>
          {CATEGORIES.map(cat => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? 'gold' : 'default'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Terms List */}
      {Object.entries(groupedTerms).map(([letter, terms]) => (
        <Card key={letter} hover={false}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold-light rounded-xl flex items-center justify-center text-white font-bold text-xl">
              {letter}
            </div>
            <span className="text-gray-500">{terms.length} terme(s)</span>
          </div>

          <div className="space-y-4">
            {terms.map((item, i) => (
              <div
                key={i}
                className="p-4 bg-gray-50 dark:bg-dark-secondary rounded-xl"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-gold-dark text-lg">{item.term}</h4>
                  <Badge variant="default" size="sm">{item.category}</Badge>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{item.definition}</p>
              </div>
            ))}
          </div>
        </Card>
      ))}

      {/* No results */}
      {filteredTerms.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucun terme trouvé</p>
        </div>
      )}

      {/* Tips */}
      <Card variant="gold" hover={false}>
        <h3 className="font-bold font-playfair text-lg mb-4">
          Maîtrise le jargon e-commerce
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Connaître ces termes te permettra de mieux comprendre les formations,
          communiquer avec d'autres e-commerçants, et analyser tes performances.
          Reviens régulièrement consulter ce dictionnaire!
        </p>
      </Card>
    </div>
  )
}
