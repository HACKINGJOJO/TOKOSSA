import { useState } from 'react'
import { Card, Badge, Input } from '@/components/ui'
import { Search, ChevronDown, ChevronUp, HelpCircle, MessageSquare } from 'lucide-react'
import { cn } from '@/utils/helpers'

const FAQ_CATEGORIES = [
  {
    category: 'Démarrage',
    icon: '🚀',
    questions: [
      {
        q: 'Combien faut-il pour démarrer?',
        a: 'Tu peux démarrer avec 100k-300k FCFA pour le niveau Starter. Cela permet d\'acheter 10-20 produits test et de créer ta présence en ligne. Le plus important n\'est pas le montant mais de tester intelligemment.'
      },
      {
        q: 'Par quelle niche commencer?',
        a: 'Les niches les plus accessibles sont: Mode féminine, Accessoires, Cosmétiques/Beauté. Ces niches ont une forte demande et des marges intéressantes (50-80%). Choisis selon tes intérêts personnels.'
      },
      {
        q: 'Faut-il un local pour vendre?',
        a: 'Non! Tu peux vendre depuis chez toi avec juste un téléphone. WhatsApp Business, Facebook et Instagram sont tes vitrines. Un local devient intéressant à partir de 1M+ de CA mensuel.'
      },
      {
        q: 'Combien de temps avant les premières ventes?',
        a: 'Avec une bonne stratégie, tu peux avoir tes premières ventes en 1-2 semaines. Le facteur clé est la qualité de ton contenu et ta réactivité sur WhatsApp.'
      },
    ]
  },
  {
    category: 'Sourcing & Produits',
    icon: '📦',
    questions: [
      {
        q: 'Où trouver des fournisseurs au Bénin?',
        a: 'Les meilleurs endroits: Dantokpa (Cotonou), Missèbo, marchés locaux. Tu peux aussi importer du Togo (Lomé) ou du Nigeria. Commence local avant d\'importer de Chine.'
      },
      {
        q: 'Faut-il importer de Chine?',
        a: 'Pas au début! Commence local pour tester tes produits sans risque. Importe de Chine uniquement quand tu as validé un bestseller avec 20-50 ventes. Les délais (15-45j) et MOQ élevés rendent l\'import risqué au début.'
      },
      {
        q: 'Comment négocier avec les fournisseurs?',
        a: '1) Demande toujours un échantillon, 2) Compare 3-5 fournisseurs, 3) Montre que tu veux un partenariat long terme, 4) Paye cash pour avoir une réduction, 5) Commande en quantité pour baisser les prix.'
      },
      {
        q: 'Quelle marge appliquer?',
        a: 'Minimum 50% de marge nette. Formule: Prix de vente = (Prix achat × 2.5) + Frais. Cela couvre tes coûts (livraison, packaging, pub) et te laisse du profit.'
      },
    ]
  },
  {
    category: 'Marketing & Vente',
    icon: '📢',
    questions: [
      {
        q: 'Combien de posts par jour?',
        a: 'Minimum 1 post par jour sur Facebook/Instagram. Idéalement 2-3 posts variés: produits, témoignages, engagement, coulisses. La régularité est plus importante que la quantité.'
      },
      {
        q: 'Comment avoir plus de followers?',
        a: 'Contenu de qualité + régularité + engagement avec ta communauté. Réponds aux commentaires, fais des lives, utilise les bons hashtags. La croissance organique est lente mais durable.'
      },
      {
        q: 'Comment gérer les clients difficiles?',
        a: 'Reste toujours professionnel et calme. Écoute le problème, propose une solution (remboursement, échange), et transforme une plainte en opportunité de fidélisation. Un bon SAV = bouche-à-oreille positif.'
      },
      {
        q: 'Faut-il faire des promos?',
        a: 'Oui, stratégiquement! Les promos créent l\'urgence. Fais des promos limitées (48h, stock limité) pour les lancements ou les fêtes. Ne fais pas de promo permanente car ça dévalue tes produits.'
      },
    ]
  },
  {
    category: 'Facebook Ads',
    icon: '🎯',
    questions: [
      {
        q: 'Quand commencer les Facebook Ads?',
        a: 'Attends d\'avoir validé ton produit en organique (5-10 ventes minimum) avant de dépenser en pub. Les Ads sont pour scaler, pas pour tester. Budget test: 2-5k FCFA/jour.'
      },
      {
        q: 'Combien investir en pub?',
        a: 'Règle: Ne dépense jamais plus de 10% de ton budget total en pub avant d\'avoir validé ton produit. Commence avec 2-5k/jour en test, puis scale à 10-20k/jour si ça marche.'
      },
      {
        q: 'Ma pub ne marche pas, que faire?',
        a: 'Analyse: 1) CPC trop élevé = créatif pas accrocheur, 2) CTR bas = audience mal ciblée, 3) Pas de conversions = landing page ou prix problématique. Teste plusieurs créatifs et audiences.'
      },
      {
        q: 'Image ou vidéo pour les pubs?',
        a: 'Les vidéos convertissent 2-3x mieux que les images. Même une vidéo simple de 15-30 secondes suffit. Montre le produit en action, ajoute du texte, et termine par un CTA clair.'
      },
    ]
  },
  {
    category: 'Logistique',
    icon: '🚚',
    questions: [
      {
        q: 'Comment gérer les livraisons?',
        a: 'Options: 1) Zem/moto (économique, rapide), 2) Coursier personnel (pour gros volumes), 3) Point relais (client récupère). Propose la livraison gratuite au-dessus d\'un certain montant.'
      },
      {
        q: 'Que faire si un client ne paie pas à la livraison?',
        a: 'Demande un acompte (30-50%) avant la livraison. Pour les nouveaux clients, c\'est une sécurité. Les clients récurrents de confiance peuvent payer à la réception.'
      },
      {
        q: 'Comment gérer les retours?',
        a: 'Définis une politique claire: échange sous 48h si produit défectueux, pas de retour si le client a simplement changé d\'avis (sauf erreur de ta part). Communique ta politique avant l\'achat.'
      },
    ]
  },
  {
    category: 'Plateforme JOJO',
    icon: '💎',
    questions: [
      {
        q: 'Comment fonctionne le système de progression?',
        a: 'Tu gagnes des XP en complétant des modules, en répondant aux quiz, et en utilisant les outils. Les XP te permettent de monter de niveau et de débloquer des badges. Plus tu es actif, plus tu progresses!'
      },
      {
        q: 'Comment obtenir mon certificat?',
        a: 'Complète tous les modules de formation (5 modules) à 100%. Une fois terminé, tu pourras générer ton certificat personnalisé depuis la section "Mon Certificat".'
      },
      {
        q: 'Mes données sont-elles sauvegardées?',
        a: 'Oui! Ta progression, tes notes, tes favoris sont sauvegardés localement sur ton navigateur. Ils persistent même si tu fermes l\'application. Note: efface les données du navigateur = perte de progression.'
      },
    ]
  },
]

export function FAQ() {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const toggleQuestion = (id: string) => {
    const newExpanded = new Set(expandedQuestions)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedQuestions(newExpanded)
  }

  const filteredCategories = FAQ_CATEGORIES.filter(cat => {
    if (selectedCategory && cat.category !== selectedCategory) return false
    if (!searchTerm) return true
    return cat.questions.some(
      q => q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
           q.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }).map(cat => ({
    ...cat,
    questions: searchTerm
      ? cat.questions.filter(
          q => q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
               q.a.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : cat.questions
  }))

  const totalQuestions = FAQ_CATEGORIES.reduce((acc, cat) => acc + cat.questions.length, 0)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <Badge variant="gold" className="mb-2">Aide</Badge>
        <h1 className="text-3xl font-bold font-playfair">
          <span className="gradient-text">Questions Fréquentes</span>
        </h1>
        <p className="text-gray-500 mt-2">
          {totalQuestions} questions les plus posées
        </p>
      </div>

      {/* Search */}
      <Card hover={false}>
        <Input
          placeholder="Rechercher une question..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          className="mb-4"
        />

        {/* Categories */}
        <div className="flex gap-2 flex-wrap">
          <Badge
            variant={selectedCategory === null ? 'gold' : 'default'}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(null)}
          >
            Toutes
          </Badge>
          {FAQ_CATEGORIES.map(cat => (
            <Badge
              key={cat.category}
              variant={selectedCategory === cat.category ? 'gold' : 'default'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(cat.category === selectedCategory ? null : cat.category)}
            >
              {cat.icon} {cat.category}
            </Badge>
          ))}
        </div>
      </Card>

      {/* FAQ List */}
      {filteredCategories.map((cat, catIndex) => (
        <Card key={cat.category} hover={false}>
          <div className="flex items-center gap-3 mb-6">
            <div className="text-3xl">{cat.icon}</div>
            <div>
              <h2 className="font-bold text-xl">{cat.category}</h2>
              <p className="text-sm text-gray-500">{cat.questions.length} question(s)</p>
            </div>
          </div>

          <div className="space-y-3">
            {cat.questions.map((item, qIndex) => {
              const questionId = `${catIndex}-${qIndex}`
              const isExpanded = expandedQuestions.has(questionId)

              return (
                <div
                  key={qIndex}
                  className={cn(
                    'border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden transition-all',
                    isExpanded && 'border-gold'
                  )}
                >
                  <button
                    onClick={() => toggleQuestion(questionId)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-dark-secondary transition-colors"
                  >
                    <span className="font-semibold pr-4">{item.q}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gold-dark shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 bg-gray-50 dark:bg-dark-secondary animate-fade-in">
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      ))}

      {/* No results */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-16">
          <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 mb-2">
            Aucune question trouvée
          </h3>
          <p className="text-gray-400">
            Essaie avec d'autres mots-clés
          </p>
        </div>
      )}

      {/* Contact */}
      <Card variant="gold" hover={false}>
        <div className="flex items-start gap-4">
          <MessageSquare className="w-8 h-8 text-gold-dark shrink-0" />
          <div>
            <h3 className="font-bold font-playfair text-lg mb-2">
              Tu ne trouves pas ta réponse?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Contacte-nous directement sur WhatsApp pour une assistance personnalisée.
              Notre équipe répond sous 24h.
            </p>
            <a
              href="https://wa.me/22900000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-green-600 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Contacter sur WhatsApp
            </a>
          </div>
        </div>
      </Card>
    </div>
  )
}
