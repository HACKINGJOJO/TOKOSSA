import { useState } from 'react'
import { Card, Badge, Button } from '@/components/ui'
import { Check, ClipboardCheck } from 'lucide-react'
import { cn } from '@/utils/helpers'

const CHECKLISTS = [
  {
    id: 'launch',
    title: 'Checklist Lancement Boutique',
    description: 'Tout ce qu\'il faut pour lancer ta boutique',
    icon: '🚀',
    color: 'from-blue-500 to-blue-400',
    items: [
      { text: 'Choisir sa niche (1-3 catégories)', critical: true },
      { text: 'Étudier 5 concurrents', critical: false },
      { text: 'Définir sa cible (âge, ville, intérêts)', critical: true },
      { text: 'Calculer son budget initial', critical: true },
      { text: 'Trouver 1-2 fournisseurs fiables', critical: true },
      { text: 'Commander des échantillons', critical: true },
      { text: 'Créer sa Page Facebook', critical: true },
      { text: 'Créer son compte Instagram', critical: false },
      { text: 'Configurer WhatsApp Business', critical: true },
      { text: 'Préparer son catalogue (5-10 produits)', critical: true },
      { text: 'Prendre des photos HD des produits', critical: true },
      { text: 'Rédiger les descriptions vendeuses', critical: true },
      { text: 'Définir sa politique de prix', critical: true },
      { text: 'Définir zones et tarifs livraison', critical: true },
      { text: 'Préparer les réponses rapides WhatsApp', critical: false },
    ]
  },
  {
    id: 'product',
    title: 'Checklist Ajout Produit',
    description: 'Pour chaque nouveau produit',
    icon: '📦',
    color: 'from-green-500 to-green-400',
    items: [
      { text: 'Photo principale HD (fond clair)', critical: true },
      { text: 'Photos secondaires (3-5 angles)', critical: false },
      { text: 'Photo portée/mise en situation', critical: false },
      { text: 'Titre accrocheur (+ emojis)', critical: true },
      { text: 'Description AIDA complète', critical: true },
      { text: 'Prix affiché clairement', critical: true },
      { text: 'Tailles/couleurs disponibles', critical: true },
      { text: 'Stock initial compté', critical: true },
      { text: 'Prix d\'achat noté (pour marge)', critical: true },
      { text: 'Hashtags préparés (5-10)', critical: false },
    ]
  },
  {
    id: 'order',
    title: 'Checklist Traitement Commande',
    description: 'À chaque nouvelle commande',
    icon: '📋',
    color: 'from-purple-500 to-purple-400',
    items: [
      { text: 'Confirmer la commande par message', critical: true },
      { text: 'Vérifier le stock du produit', critical: true },
      { text: 'Noter les détails (taille, couleur)', critical: true },
      { text: 'Confirmer l\'adresse de livraison', critical: true },
      { text: 'Calculer les frais de livraison', critical: true },
      { text: 'Envoyer le récapitulatif + total', critical: true },
      { text: 'Attendre confirmation du client', critical: true },
      { text: 'Recevoir le paiement', critical: true },
      { text: 'Préparer le colis', critical: true },
      { text: 'Envoyer photo du colis au client', critical: false },
      { text: 'Organiser la livraison', critical: true },
      { text: 'Envoyer le tracking/contact livreur', critical: false },
      { text: 'Confirmer réception avec le client', critical: true },
      { text: 'Demander un avis/témoignage', critical: false },
      { text: 'Mettre à jour le stock', critical: true },
    ]
  },
  {
    id: 'supplier',
    title: 'Checklist Fournisseur',
    description: 'Avant de payer un fournisseur',
    icon: '🤝',
    color: 'from-orange-500 to-orange-400',
    items: [
      { text: 'Échantillon reçu et qualité validée', critical: true },
      { text: 'Prix négocié confirmé par écrit', critical: true },
      { text: 'Quantité exacte commandée', critical: true },
      { text: 'Délai de livraison confirmé', critical: true },
      { text: 'Conditions de retour définies', critical: true },
      { text: 'Coordonnées complètes du fournisseur', critical: true },
      { text: 'Photos des produits exacts', critical: false },
      { text: 'Mode de paiement sécurisé', critical: true },
      { text: 'Bon de commande écrit', critical: true },
    ]
  },
  {
    id: 'weekly',
    title: 'Checklist Hebdomadaire',
    description: 'À faire chaque semaine',
    icon: '📅',
    color: 'from-pink-500 to-pink-400',
    items: [
      { text: 'Vérifier le stock (réassort si besoin)', critical: true },
      { text: 'Analyser les ventes de la semaine', critical: true },
      { text: 'Publier le planning de contenu', critical: false },
      { text: 'Répondre aux messages en attente', critical: true },
      { text: 'Relancer les prospects froids', critical: false },
      { text: 'Collecter les témoignages clients', critical: false },
      { text: 'Planifier 7 posts minimum', critical: true },
      { text: 'Vérifier les paiements en attente', critical: true },
      { text: 'Suivre les livraisons en cours', critical: true },
      { text: 'Identifier les bestsellers', critical: false },
    ]
  },
  {
    id: 'facebook-ads',
    title: 'Checklist Facebook Ads',
    description: 'Avant de lancer une pub',
    icon: '📢',
    color: 'from-blue-600 to-blue-500',
    items: [
      { text: 'Pixel Facebook installé et testé', critical: true },
      { text: 'Objectif de campagne défini', critical: true },
      { text: 'Budget journalier calculé', critical: true },
      { text: 'Audience cible créée', critical: true },
      { text: 'Visuel/vidéo de qualité', critical: true },
      { text: 'Texte de pub rédigé (AIDA)', critical: true },
      { text: 'CTA clair défini', critical: true },
      { text: 'Landing page/destination prête', critical: true },
      { text: 'Stock suffisant pour le volume', critical: true },
      { text: 'Équipe prête à répondre aux messages', critical: false },
    ]
  },
]

export function Checklists() {
  const [expandedList, setExpandedList] = useState<string | null>('launch')
  const [checkedItems, setCheckedItems] = useState<Record<string, Set<number>>>({})

  const toggleItem = (listId: string, itemIndex: number) => {
    setCheckedItems(prev => {
      const newChecked = { ...prev }
      if (!newChecked[listId]) newChecked[listId] = new Set()

      if (newChecked[listId].has(itemIndex)) {
        newChecked[listId].delete(itemIndex)
      } else {
        newChecked[listId].add(itemIndex)
      }

      return newChecked
    })
  }

  const getProgress = (listId: string, totalItems: number) => {
    const checked = checkedItems[listId]?.size || 0
    return Math.round((checked / totalItems) * 100)
  }

  const resetChecklist = (listId: string) => {
    setCheckedItems(prev => {
      const newChecked = { ...prev }
      delete newChecked[listId]
      return newChecked
    })
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <Badge variant="gold" className="mb-2">Ressources</Badge>
        <h1 className="text-3xl font-bold font-playfair">
          <span className="gradient-text">Checklists</span>
        </h1>
        <p className="text-gray-500 mt-2">
          {CHECKLISTS.length} checklists pour ne rien oublier
        </p>
      </div>

      {/* Checklists Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {CHECKLISTS.map(list => {
          const progress = getProgress(list.id, list.items.length)
          return (
            <Card
              key={list.id}
              className={cn(
                'cursor-pointer transition-all',
                expandedList === list.id && 'ring-2 ring-gold'
              )}
              onClick={() => setExpandedList(expandedList === list.id ? null : list.id)}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  'w-14 h-14 rounded-xl flex items-center justify-center text-2xl text-white bg-gradient-to-br',
                  list.color
                )}>
                  {list.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{list.title}</h3>
                  <p className="text-sm text-gray-500">{list.items.length} items</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-500">Progression</span>
                  <span className="font-bold text-gold-dark">{progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-dark-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold to-gold-light transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Expanded Checklist */}
      {expandedList && (
        <Card hover={false} className="animate-fade-in">
          {(() => {
            const list = CHECKLISTS.find(l => l.id === expandedList)!
            const progress = getProgress(list.id, list.items.length)

            return (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'w-16 h-16 rounded-xl flex items-center justify-center text-3xl text-white bg-gradient-to-br',
                      list.color
                    )}>
                      {list.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{list.title}</h2>
                      <p className="text-gray-500">{list.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gold-dark">{progress}%</div>
                    <Button size="sm" variant="ghost" onClick={() => resetChecklist(list.id)}>
                      Réinitialiser
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {list.items.map((item, i) => {
                    const isChecked = checkedItems[list.id]?.has(i)
                    return (
                      <div
                        key={i}
                        onClick={() => toggleItem(list.id, i)}
                        className={cn(
                          'flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all',
                          isChecked
                            ? 'bg-green-50 dark:bg-green-900/20'
                            : item.critical
                              ? 'bg-red-50 dark:bg-red-900/20'
                              : 'bg-gray-50 dark:bg-dark-secondary',
                          'hover:scale-[1.01]'
                        )}
                      >
                        <div className={cn(
                          'w-6 h-6 rounded border-2 flex items-center justify-center transition-all',
                          isChecked
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-300 dark:border-gray-600'
                        )}>
                          {isChecked && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <span className={cn(
                          'flex-1 transition-all',
                          isChecked && 'line-through text-gray-400'
                        )}>
                          {item.text}
                        </span>
                        {item.critical && !isChecked && (
                          <Badge variant="danger" size="sm">Critique</Badge>
                        )}
                        {isChecked && (
                          <Badge variant="success" size="sm">Fait</Badge>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Progress Bar */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">
                      {checkedItems[list.id]?.size || 0} / {list.items.length} complétés
                    </span>
                    {progress === 100 && (
                      <Badge variant="success">Checklist complète!</Badge>
                    )}
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-dark-secondary rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full transition-all',
                        progress === 100
                          ? 'bg-gradient-to-r from-green-500 to-green-400'
                          : 'bg-gradient-to-r from-gold to-gold-light'
                      )}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </>
            )
          })()}
        </Card>
      )}

      {/* Tips */}
      <Card variant="gold" hover={false}>
        <div className="flex items-start gap-4">
          <ClipboardCheck className="w-8 h-8 text-gold-dark shrink-0" />
          <div>
            <h3 className="font-bold font-playfair text-lg mb-2">
              Utilise ces checklists à chaque étape
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Les entrepreneurs qui réussissent ont des systèmes. Ces checklists t'aident
              à ne rien oublier et à maintenir un niveau de qualité constant.
              Coche les items au fur et à mesure!
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
