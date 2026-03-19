import { useState } from 'react'
import { Card, Badge, Button, Input } from '@/components/ui'
import { Copy, Check, Search, Sparkles, MessageSquare, PenTool, Camera, Megaphone } from 'lucide-react'

const CATEGORIES = [
  { id: 'all', label: 'Tous', icon: Sparkles },
  { id: 'description', label: 'Descriptions', icon: PenTool },
  { id: 'post', label: 'Posts', icon: Megaphone },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
  { id: 'photo', label: 'Photos', icon: Camera },
]

const PROMPTS = [
  // Descriptions
  {
    id: 1,
    category: 'description',
    title: 'Description Produit Vendeuse',
    prompt: `Tu es un expert copywriter e-commerce africain. Écris une description de produit vendeuse pour:
Produit: [NOM DU PRODUIT]
Prix: [PRIX] FCFA
Public cible: [Femmes/Hommes] [AGE] ans

La description doit:
- Utiliser des emojis
- Avoir une accroche forte
- Lister 3-5 bénéfices
- Inclure un appel à l'action
- Être en français accessible
- Faire 100-150 mots maximum`,
    example: '👗 Robe Ankara Premium, 15000 FCFA, Femmes 25-40 ans',
    tags: ['produit', 'vente', 'copywriting']
  },
  {
    id: 2,
    category: 'description',
    title: 'Description Courte Instagram',
    prompt: `Écris une description Instagram courte et impactante pour:
Produit: [PRODUIT]
Prix: [PRIX] FCFA

Format:
- 1-2 lignes max
- Emoji au début
- Prix visible
- Hashtags pertinents (5 max)
- CTA: "DM pour commander"`,
    example: 'Sac à main cuir, 12000 FCFA',
    tags: ['instagram', 'court', 'hashtags']
  },
  {
    id: 3,
    category: 'description',
    title: 'Fiche Produit Complète',
    prompt: `Crée une fiche produit complète pour:
Produit: [NOM]
Catégorie: [CATÉGORIE]
Prix: [PRIX] FCFA

Inclure:
1. Titre accrocheur
2. Description détaillée (matière, taille, couleur)
3. Avantages du produit
4. Conseils d'entretien
5. Information livraison
6. Garantie/SAV`,
    example: 'Montre homme élégante, Accessoires, 25000 FCFA',
    tags: ['fiche', 'détaillé', 'professionnel']
  },

  // Posts
  {
    id: 4,
    category: 'post',
    title: 'Post Promo Flash',
    prompt: `Crée un post Facebook/Instagram pour une promo flash:
Produit: [PRODUIT]
Réduction: [X]%
Durée: [DURÉE]
Prix avant/après: [AVANT] → [APRÈS] FCFA

Le post doit:
- Créer l'urgence
- Avoir des emojis feu/alerte
- Mentionner la rareté
- Avoir un CTA clair`,
    example: 'Robes été, -30%, 48h, 20000 → 14000 FCFA',
    tags: ['promo', 'urgence', 'vente']
  },
  {
    id: 5,
    category: 'post',
    title: 'Post Nouveauté/Arrivage',
    prompt: `Crée un post pour annoncer une nouveauté:
Produit: [PRODUIT]
Quantité: [QUANTITÉ] pièces
Prix: [PRIX] FCFA

Le post doit:
- Générer de l'excitation
- Créer la rareté
- Utiliser des emojis ✨🔥
- Encourager les premiers clients`,
    example: 'Sacs Ankara, 20 pièces, 18000 FCFA',
    tags: ['nouveauté', 'arrivage', 'excitation']
  },
  {
    id: 6,
    category: 'post',
    title: 'Post Témoignage Client',
    prompt: `Transforme ce témoignage client en post engageant:
Témoignage: "[TÉMOIGNAGE]"
Produit acheté: [PRODUIT]
Prénom client: [PRÉNOM]

Format:
- Remercier le client
- Mettre en valeur le témoignage
- Mentionner le produit
- Inviter les autres à commander`,
    example: '"Super qualité, livraison rapide!", Robe wax, Aïcha',
    tags: ['témoignage', 'social proof', 'confiance']
  },
  {
    id: 7,
    category: 'post',
    title: 'Post Engagement/Sondage',
    prompt: `Crée un post engagement pour ma page e-commerce:
Thème: [MODE/BEAUTÉ/ACCESSOIRES]
Objectif: [Plus de commentaires/Connaître les goûts]

Le post doit:
- Poser une question simple
- Proposer 2-3 options
- Encourager les commentaires
- Être fun et accessible`,
    example: 'Mode, Connaître les préférences couleurs',
    tags: ['engagement', 'sondage', 'interaction']
  },

  // WhatsApp
  {
    id: 8,
    category: 'whatsapp',
    title: 'Script Accueil Client',
    prompt: `Crée un script d'accueil WhatsApp professionnel pour:
Nom boutique: [NOM BOUTIQUE]
Produit demandé: [PRODUIT]

Le script doit:
- Être chaleureux
- Remercier l'intérêt
- Demander les besoins
- Être court (3-4 messages max)`,
    example: 'ChicMode, Robe de soirée',
    tags: ['accueil', 'premier contact', 'pro']
  },
  {
    id: 9,
    category: 'whatsapp',
    title: 'Script Relance Client',
    prompt: `Crée 3 messages de relance pour un client qui n'a pas répondu:
Produit intéressé: [PRODUIT]
Jours depuis dernier message: [X] jours

Les messages doivent:
- Ne pas être insistants
- Rappeler le produit
- Offrir une aide
- Avoir un ton amical`,
    example: 'Sac cuir noir, 2 jours',
    tags: ['relance', 'suivi', 'conversion']
  },
  {
    id: 10,
    category: 'whatsapp',
    title: 'Script Objection Prix',
    prompt: `Crée une réponse pour un client qui trouve le prix trop cher:
Produit: [PRODUIT]
Prix: [PRIX] FCFA
Points forts: [QUALITÉ/DURABILITÉ/EXCLUSIVITÉ]

La réponse doit:
- Comprendre le client
- Justifier le prix
- Proposer une alternative (facilité, promo)
- Rester professionnel`,
    example: 'Montre femme, 35000 FCFA, Qualité premium + garantie',
    tags: ['objection', 'négociation', 'closing']
  },

  // Photos
  {
    id: 11,
    category: 'photo',
    title: 'Idées de Photos Produit',
    prompt: `Donne-moi 5 idées de photos créatives pour:
Produit: [PRODUIT]
Style: [LUXE/CASUAL/FUN]
Pour: [Instagram/WhatsApp catalogue]

Chaque idée doit inclure:
- Le setup/décor
- L'angle de prise
- Les props suggérés
- L'ambiance recherchée`,
    example: 'Bijoux, Luxe, Instagram',
    tags: ['photo', 'créatif', 'visuel']
  },
  {
    id: 12,
    category: 'photo',
    title: 'Légendes Photos',
    prompt: `Génère 5 légendes Instagram différentes pour cette photo de:
Produit: [PRODUIT]
Ambiance: [DESCRIPTION DE LA PHOTO]
Objectif: [Vendre/Engager/Inspirer]

Chaque légende doit:
- Avoir un ton différent
- Inclure 3-5 hashtags
- Avoir un CTA`,
    example: 'Robe rouge, Photo sur fond blanc élégant, Vendre',
    tags: ['légende', 'instagram', 'hashtags']
  },
]

export function Prompts() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const filteredPrompts = PROMPTS.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.tags.some(t => t.includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCopy = async (prompt: typeof PROMPTS[0]) => {
    await navigator.clipboard.writeText(prompt.prompt)
    setCopiedId(prompt.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <Badge variant="gold" className="mb-2">Ressources</Badge>
        <h1 className="text-3xl font-bold font-playfair">
          <span className="gradient-text">Prompts IA</span>
        </h1>
        <p className="text-gray-500 mt-2">
          12 prompts prêts à l'emploi pour ChatGPT, Gemini, Claude...
        </p>
      </div>

      {/* Search & Filters */}
      <Card hover={false}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Rechercher un prompt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4 flex-wrap">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon
            return (
              <Button
                key={cat.id}
                size="sm"
                variant={selectedCategory === cat.id ? 'gold' : 'outline'}
                onClick={() => setSelectedCategory(cat.id)}
                leftIcon={<Icon className="w-4 h-4" />}
              >
                {cat.label}
              </Button>
            )
          })}
        </div>
      </Card>

      {/* Prompts List */}
      <div className="space-y-6">
        {filteredPrompts.map(prompt => (
          <Card key={prompt.id} hover={false}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg">{prompt.title}</h3>
                  <Badge variant="default" size="sm">
                    {CATEGORIES.find(c => c.id === prompt.category)?.label}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  {prompt.tags.map(tag => (
                    <span key={tag} className="text-xs text-gray-500">#{tag}</span>
                  ))}
                </div>
              </div>
              <Button
                size="sm"
                variant={copiedId === prompt.id ? 'success' : 'outline'}
                onClick={() => handleCopy(prompt)}
                leftIcon={copiedId === prompt.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              >
                {copiedId === prompt.id ? 'Copié!' : 'Copier'}
              </Button>
            </div>

            <div className="bg-gray-50 dark:bg-dark-secondary p-4 rounded-xl mb-4">
              <pre className="whitespace-pre-wrap text-sm font-mono text-gray-700 dark:text-gray-300">
                {prompt.prompt}
              </pre>
            </div>

            <div className="bg-gold-pale dark:bg-gold/10 p-3 rounded-lg">
              <p className="text-sm">
                <strong className="text-gold-dark">Exemple:</strong> {prompt.example}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* No results */}
      {filteredPrompts.length === 0 && (
        <div className="text-center py-12">
          <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucun prompt trouvé</p>
        </div>
      )}

      {/* Tips */}
      <Card variant="gold" hover={false}>
        <h3 className="font-bold font-playfair text-lg mb-4">
          Comment utiliser ces prompts ?
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-dark-card p-4 rounded-xl">
            <div className="text-2xl mb-2">1️⃣</div>
            <h4 className="font-semibold mb-1">Copie le prompt</h4>
            <p className="text-sm text-gray-500">Clique sur "Copier"</p>
          </div>
          <div className="bg-white dark:bg-dark-card p-4 rounded-xl">
            <div className="text-2xl mb-2">2️⃣</div>
            <h4 className="font-semibold mb-1">Personnalise</h4>
            <p className="text-sm text-gray-500">Remplace les [CROCHETS]</p>
          </div>
          <div className="bg-white dark:bg-dark-card p-4 rounded-xl">
            <div className="text-2xl mb-2">3️⃣</div>
            <h4 className="font-semibold mb-1">Envoie à l'IA</h4>
            <p className="text-sm text-gray-500">ChatGPT, Gemini, Claude...</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
