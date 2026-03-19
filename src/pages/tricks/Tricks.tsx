import { useState } from 'react'
import { Card, Badge, Button, Input } from '@/components/ui'
import { Search, Lightbulb, Copy, Check, Star } from 'lucide-react'

const CATEGORIES = ['Tous', 'Vente', 'Marketing', 'Négociation', 'Psychologie', 'Productivité']

const TRICKS = [
  {
    id: 1,
    category: 'Vente',
    title: 'La technique du "Dernière pièce"',
    description: 'Dis toujours qu\'il ne reste que 2-3 pièces même si tu en as plus. Crée l\'urgence et pousse à l\'achat immédiat.',
    example: '"Il m\'en reste que 2 en stock, je te la garde?"',
    rating: 5
  },
  {
    id: 2,
    category: 'Vente',
    title: 'Le cadeau surprise',
    description: 'Ajoute toujours un petit cadeau non annoncé dans le colis. Le client sera ravi et en parlera autour de lui.',
    example: 'Un petit accessoire, un échantillon, une carte de remerciement personnalisée',
    rating: 5
  },
  {
    id: 3,
    category: 'Marketing',
    title: 'Le post "Behind the scenes"',
    description: 'Montre les coulisses de ton business (préparation commandes, emballage). Les gens adorent voir l\'authenticité.',
    example: 'Story de toi en train d\'emballer avec soin une commande',
    rating: 4
  },
  {
    id: 4,
    category: 'Psychologie',
    title: 'L\'effet d\'ancrage',
    description: 'Montre toujours un prix barré plus élevé à côté du prix actuel. Le client perçoit une bonne affaire.',
    example: '̶2̶5̶0̶0̶0̶ ̶F̶C̶F̶A̶ → 18000 FCFA',
    rating: 5
  },
  {
    id: 5,
    category: 'Négociation',
    title: 'Le silence stratégique',
    description: 'Après avoir donné ton prix, ne dis plus rien. Celui qui parle en premier perd la négociation.',
    example: 'Client: "C\'est cher" - Toi: *silence* - Client: "Bon ok je prends"',
    rating: 4
  },
  {
    id: 6,
    category: 'Vente',
    title: 'La vente croisée',
    description: 'Propose toujours un produit complémentaire. "Tu veux les boucles d\'oreilles assorties?"',
    example: 'Robe → Propose le sac assorti. Crème → Propose le savon.',
    rating: 5
  },
  {
    id: 7,
    category: 'Marketing',
    title: 'L\'heure magique',
    description: 'Poste entre 19h-21h en semaine et 10h-12h le weekend. C\'est là que l\'engagement est max.',
    example: 'Prépare tes posts à l\'avance et programme-les',
    rating: 4
  },
  {
    id: 8,
    category: 'Psychologie',
    title: 'Le prix psychologique',
    description: 'Utilise des prix en 9 ou 5. 14 900 FCFA paraît moins cher que 15 000 FCFA.',
    example: '9 900, 14 500, 19 900 au lieu de 10 000, 15 000, 20 000',
    rating: 4
  },
  {
    id: 9,
    category: 'Productivité',
    title: 'La règle des 2 minutes',
    description: 'Si une tâche prend moins de 2 minutes, fais-la immédiatement. Ne la reporte pas.',
    example: 'Répondre à un message client, mettre à jour le stock, poster une story',
    rating: 4
  },
  {
    id: 10,
    category: 'Vente',
    title: 'Le témoignage screenshot',
    description: 'Screenshot les messages de clients satisfaits et partage-les. C\'est la meilleure pub gratuite.',
    example: 'Screenshot WhatsApp avec "Merci! J\'adore!" + photo du client',
    rating: 5
  },
  {
    id: 11,
    category: 'Négociation',
    title: 'L\'option du milieu',
    description: 'Propose 3 options de prix. Les gens choisissent presque toujours celle du milieu.',
    example: 'Pack Basic 10k, Pack Standard 18k (celui que tu veux vendre), Pack Premium 30k',
    rating: 4
  },
  {
    id: 12,
    category: 'Marketing',
    title: 'Le hashtag local',
    description: 'Utilise des hashtags locaux pour toucher ta zone. #CotonouFashion #BeninMode',
    example: '#Cotonou #Benin #ModeAfricaine #FashionBenin #ShoppingCotonou',
    rating: 3
  },
  {
    id: 13,
    category: 'Psychologie',
    title: 'La preuve sociale',
    description: 'Mentionne combien de personnes ont déjà acheté. "Déjà 50+ clientes satisfaites!"',
    example: '"Ce modèle est notre bestseller, +100 vendus ce mois!"',
    rating: 5
  },
  {
    id: 14,
    category: 'Productivité',
    title: 'Le batch content',
    description: 'Prépare tout ton contenu de la semaine en une seule session (dimanche soir par ex).',
    example: 'Dimanche: prends toutes les photos, écris tous les textes pour la semaine',
    rating: 4
  },
  {
    id: 15,
    category: 'Vente',
    title: 'Le rappel subtil',
    description: 'Relance les clients qui n\'ont pas finalisé avec une offre limitée dans le temps.',
    example: '"Hey! Le produit que tu voulais est encore dispo. -10% si tu commandes avant ce soir!"',
    rating: 4
  },
]

export function Tricks() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const filteredTricks = TRICKS.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'Tous' || t.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCopy = async (trick: typeof TRICKS[0]) => {
    const text = `${trick.title}\n\n${trick.description}\n\nExemple: ${trick.example}`
    await navigator.clipboard.writeText(text)
    setCopiedId(trick.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <Badge variant="gold" className="mb-2">Astuces</Badge>
        <h1 className="text-3xl font-bold font-playfair">
          <span className="gradient-text">Tricks & Astuces</span>
        </h1>
        <p className="text-gray-500 mt-2">
          {TRICKS.length} techniques secrètes des pros du e-commerce
        </p>
      </div>

      {/* Search & Filters */}
      <Card hover={false}>
        <Input
          placeholder="Rechercher un trick..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          className="mb-4"
        />
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <Button
              key={cat}
              size="sm"
              variant={selectedCategory === cat ? 'gold' : 'outline'}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </Card>

      {/* Tricks Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredTricks.map(trick => (
          <Card key={trick.id} className="relative">
            <div className="absolute top-4 right-4 flex items-center gap-1">
              {[...Array(trick.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-gold text-gold" />
              ))}
            </div>

            <Badge variant="default" size="sm" className="mb-3">{trick.category}</Badge>

            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold-light rounded-lg flex items-center justify-center shrink-0">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-lg">{trick.title}</h3>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {trick.description}
            </p>

            <div className="bg-gray-50 dark:bg-dark-secondary p-3 rounded-lg mb-4">
              <p className="text-sm">
                <strong className="text-gold-dark">Exemple:</strong> {trick.example}
              </p>
            </div>

            <Button
              size="sm"
              variant={copiedId === trick.id ? 'success' : 'outline'}
              onClick={() => handleCopy(trick)}
              leftIcon={copiedId === trick.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              className="w-full"
            >
              {copiedId === trick.id ? 'Copié!' : 'Copier ce trick'}
            </Button>
          </Card>
        ))}
      </div>

      {/* No results */}
      {filteredTricks.length === 0 && (
        <div className="text-center py-12">
          <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucun trick trouvé</p>
        </div>
      )}
    </div>
  )
}
