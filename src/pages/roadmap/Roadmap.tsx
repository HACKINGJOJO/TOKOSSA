import { useState } from 'react'
import { Card, Badge, Progress } from '@/components/ui'
import { Check, Rocket } from 'lucide-react'
import { cn } from '@/utils/helpers'

const WEEKS = [
  {
    week: 1,
    title: 'Préparation & Setup',
    description: 'Poser les fondations de ton business',
    days: [
      { day: 1, title: 'Définir ta niche', tasks: ['Choisir 1-3 catégories', 'Étudier 5 concurrents', 'Définir ta cible'] },
      { day: 2, title: 'Créer tes comptes', tasks: ['Page Facebook Business', 'Compte Instagram', 'WhatsApp Business'] },
      { day: 3, title: 'Trouver fournisseurs', tasks: ['Visiter 2-3 marchés', 'Comparer les prix', 'Négocier samples'] },
      { day: 4, title: 'Préparer catalogue', tasks: ['Sélectionner 5-10 produits', 'Calculer les marges', 'Fixer les prix'] },
      { day: 5, title: 'Shooting photos', tasks: ['Photos HD des produits', 'Photos portées/lifestyle', 'Retouches basiques'] },
      { day: 6, title: 'Rédiger descriptions', tasks: ['Écrire en format AIDA', 'Préparer les hashtags', 'Créer réponses rapides'] },
      { day: 7, title: 'Finaliser setup', tasks: ['Tester le parcours client', 'Préparer premier post', 'Repos & révision'] },
    ]
  },
  {
    week: 2,
    title: 'Lancement & Premiers clients',
    description: 'Générer tes premières ventes',
    days: [
      { day: 8, title: 'Lancement officiel', tasks: ['Premier post produit', 'Story d\'annonce', 'Partager à tes proches'] },
      { day: 9, title: 'Contenu quotidien', tasks: ['Post produit', 'Story engagement', 'Répondre messages'] },
      { day: 10, title: 'Première promo', tasks: ['Offre de lancement -10%', 'Post promo', 'Relancer contacts'] },
      { day: 11, title: 'Engagement', tasks: ['Commenter autres pages', 'Rejoindre groupes FB', 'Poster dans groupes'] },
      { day: 12, title: 'Suivi clients', tasks: ['Relancer prospects', 'Demander témoignages', 'Post témoignage'] },
      { day: 13, title: 'Analyse', tasks: ['Voir stats FB/IG', 'Identifier ce qui marche', 'Ajuster stratégie'] },
      { day: 14, title: 'Bilan semaine', tasks: ['Compter ventes', 'Calculer profit', 'Planifier semaine 3'] },
    ]
  },
  {
    week: 3,
    title: 'Optimisation & Croissance',
    description: 'Améliorer et scaler',
    days: [
      { day: 15, title: 'Réassort', tasks: ['Commander bestsellers', 'Ajouter nouveaux produits', 'Mettre à jour catalogue'] },
      { day: 16, title: 'Contenu avancé', tasks: ['Créer une vidéo/reel', 'Post carrousel', 'Story interactive'] },
      { day: 17, title: 'Partenariats', tasks: ['Contacter micro-influenceurs', 'Proposer collaboration', 'Échanger visibilité'] },
      { day: 18, title: 'Fidélisation', tasks: ['Créer offre VIP', 'Remercier clients', 'Programme parrainage'] },
      { day: 19, title: 'Automatisation', tasks: ['Créer plus de réponses rapides', 'Templates messages', 'Organiser fichiers'] },
      { day: 20, title: 'Test pub', tasks: ['Créer compte Ads', 'Premier boost 2-5k', 'Observer résultats'] },
      { day: 21, title: 'Bilan mi-parcours', tasks: ['Analyser 3 semaines', 'Fêter les victoires', 'Ajuster objectifs'] },
    ]
  },
  {
    week: 4,
    title: 'Scaling & Systématisation',
    description: 'Créer un business durable',
    days: [
      { day: 22, title: 'Process', tasks: ['Documenter tes process', 'Créer checklist commande', 'Optimiser workflow'] },
      { day: 23, title: 'Diversification', tasks: ['Ajouter nouvelle catégorie', 'Tester nouveau produit', 'Cross-selling'] },
      { day: 24, title: 'Scale pub', tasks: ['Analyser première pub', 'Créer nouvelles audiences', 'Augmenter budget si ROI+'] },
      { day: 25, title: 'Relations', tasks: ['Renforcer lien fournisseurs', 'Négocier meilleurs prix', 'Explorer nouveaux sourcing'] },
      { day: 26, title: 'Contenu batch', tasks: ['Créer contenu 2 semaines', 'Programmer posts', 'Préparer promos'] },
      { day: 27, title: 'Vision', tasks: ['Définir objectifs mois 2', 'Planifier investissements', 'Explorer Shopify?'] },
      { day: 28, title: 'Célébration!', tasks: ['Bilan 30 jours', 'Calculer ROI total', 'Récompense-toi!'] },
    ]
  },
]

export function Roadmap() {
  const [completedDays, setCompletedDays] = useState<number[]>([])
  const [expandedWeek, setExpandedWeek] = useState(1)

  const toggleDay = (day: number) => {
    setCompletedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  const progress = Math.round((completedDays.length / 28) * 100)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Badge variant="gold" className="mb-2">Plan d'action</Badge>
          <h1 className="text-3xl font-bold font-playfair">
            <span className="gradient-text">Roadmap 30 Jours</span>
          </h1>
          <p className="text-gray-500 mt-2">
            Ton plan jour par jour pour lancer ton business
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gold-dark">{completedDays.length}/28</div>
          <p className="text-sm text-gray-500">jours complétés</p>
          <Progress value={progress} className="w-32 mt-2" />
        </div>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-4 gap-4">
        {WEEKS.map(week => {
          const weekDays = week.days.map(d => d.day)
          const weekCompleted = weekDays.filter(d => completedDays.includes(d)).length
          const weekProgress = Math.round((weekCompleted / 7) * 100)

          return (
            <Card
              key={week.week}
              className={cn(
                'cursor-pointer text-center transition-all',
                expandedWeek === week.week && 'ring-2 ring-gold'
              )}
              onClick={() => setExpandedWeek(week.week)}
            >
              <div className="text-2xl mb-2">
                {weekProgress === 100 ? '✅' : weekProgress > 0 ? '🔄' : '⏳'}
              </div>
              <h3 className="font-bold">Semaine {week.week}</h3>
              <p className="text-xs text-gray-500 mb-2">{week.title}</p>
              <Progress value={weekProgress} className="h-1" />
              <p className="text-xs text-gray-500 mt-1">{weekCompleted}/7</p>
            </Card>
          )
        })}
      </div>

      {/* Week Detail */}
      {WEEKS.filter(w => w.week === expandedWeek).map(week => (
        <Card key={week.week} hover={false}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-gold to-gold-light rounded-xl flex items-center justify-center text-white font-bold text-xl">
              S{week.week}
            </div>
            <div>
              <h2 className="text-xl font-bold">{week.title}</h2>
              <p className="text-gray-500">{week.description}</p>
            </div>
          </div>

          <div className="space-y-4">
            {week.days.map(day => {
              const isCompleted = completedDays.includes(day.day)

              return (
                <div
                  key={day.day}
                  className={cn(
                    'p-4 rounded-xl border-2 transition-all',
                    isCompleted
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  )}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleDay(day.day)}
                      className={cn(
                        'w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
                        isCompleted
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-300 hover:border-gold'
                      )}
                    >
                      {isCompleted && <Check className="w-5 h-5 text-white" />}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={isCompleted ? 'success' : 'default'} size="sm">
                          Jour {day.day}
                        </Badge>
                        <h4 className={cn(
                          'font-bold',
                          isCompleted && 'line-through text-gray-400'
                        )}>
                          {day.title}
                        </h4>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {day.tasks.map((task, i) => (
                          <span
                            key={i}
                            className={cn(
                              'text-xs px-2 py-1 rounded-full',
                              isCompleted
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-gray-100 text-gray-600 dark:bg-dark-secondary dark:text-gray-400'
                            )}
                          >
                            {task}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      ))}

      {/* Motivation */}
      <Card variant="gold" hover={false}>
        <div className="flex items-center gap-4">
          <Rocket className="w-10 h-10 text-gold-dark" />
          <div>
            <h3 className="font-bold font-playfair text-lg">Tu peux le faire!</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Chaque jour compte. Un petit pas chaque jour = un grand business dans 30 jours.
              Coche les jours au fur et à mesure de ta progression!
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
