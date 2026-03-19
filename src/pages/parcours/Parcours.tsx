import { useState } from 'react'
import { Card, Badge, Button, Progress } from '@/components/ui'
import { Check, Circle, Target, Trophy } from 'lucide-react'
import { cn } from '@/utils/helpers'
import { useProgressStore } from '@/stores/progressStore'

const STEPS = [
  {
    id: 1,
    title: 'Choisis ta niche',
    description: 'Sélectionne 1-3 catégories de produits',
    duration: '1-2h',
    tasks: [
      'Consulter la liste des niches rentables',
      'Analyser tes intérêts et compétences',
      'Étudier 3-5 concurrents dans ta niche',
      'Valider la demande sur les réseaux'
    ],
    tips: 'Choisis une niche qui te passionne, tu vendras mieux!'
  },
  {
    id: 2,
    title: 'Trouve tes produits',
    description: 'Source tes 5-10 premiers produits',
    duration: '1-2 jours',
    tasks: [
      'Visiter les marchés locaux (Dantokpa, Missèbo)',
      'Comparer les prix chez 3+ fournisseurs',
      'Commander des échantillons',
      'Valider la qualité des produits',
      'Calculer tes marges (min 50%)'
    ],
    tips: 'Commence local pour tester, importe ensuite.'
  },
  {
    id: 3,
    title: 'Crée ta présence',
    description: 'Configure tes réseaux sociaux',
    duration: '2-3h',
    tasks: [
      'Créer ta Page Facebook Business',
      'Configurer ton compte Instagram',
      'Installer WhatsApp Business',
      'Choisir un nom de boutique',
      'Créer ton logo (Canva gratuit)'
    ],
    tips: 'Utilise le même nom partout pour être reconnaissable.'
  },
  {
    id: 4,
    title: 'Prépare ton catalogue',
    description: 'Photos et descriptions vendeuses',
    duration: '1 jour',
    tasks: [
      'Prendre des photos HD de tes produits',
      'Rédiger des descriptions AIDA',
      'Définir tes prix de vente',
      'Créer tes premiers posts',
      'Préparer les réponses rapides WhatsApp'
    ],
    tips: 'Les photos font 80% de la vente!'
  },
  {
    id: 5,
    title: 'Lance-toi!',
    description: 'Publie et commence à vendre',
    duration: '1 jour',
    tasks: [
      'Publier tes premiers posts',
      'Partager dans les groupes Facebook',
      'Envoyer à tes contacts proches',
      'Créer une offre de lancement',
      'Répondre rapidement aux messages'
    ],
    tips: 'Ta première vente peut arriver dès le jour 1!'
  },
  {
    id: 6,
    title: 'Ta première vente!',
    description: 'Félicitations, tu es officiellement e-commerçant!',
    duration: '🎉',
    tasks: [
      'Confirmer la commande',
      'Préparer le colis avec soin',
      'Livrer le client',
      'Demander un témoignage',
      'Poster le témoignage sur ta page'
    ],
    tips: 'Chaque client satisfait en amène 3 autres!'
  },
]

export function Parcours() {
  const [activeStep, setActiveStep] = useState(1)
  const { toggleMilestone, isMilestoneCompleted, getMilestoneCompletionCount } = useProgressStore()

  const getMilestoneId = (stepId: number) => `j${stepId}`

  const toggleStep = (stepId: number) => {
    toggleMilestone(getMilestoneId(stepId))
  }

  const completedStepsCount = getMilestoneCompletionCount()
  const progress = Math.round((completedStepsCount / STEPS.length) * 100)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <Badge variant="gold" className="mb-2">Parcours guidé</Badge>
        <h1 className="text-3xl font-bold font-playfair">
          <span className="gradient-text">Ta 1ère Vente en 6 Étapes</span>
        </h1>
        <p className="text-gray-500 mt-2">
          Suis ce parcours pas à pas pour réaliser ta première vente
        </p>
      </div>

      {/* Progress */}
      <Card hover={false}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-gold-dark" />
            <span className="font-bold">Progression</span>
          </div>
          <span className="text-2xl font-bold text-gold-dark">{progress}%</span>
        </div>
        <Progress value={progress} />
        <p className="text-sm text-gray-500 mt-2">
          {completedStepsCount}/{STEPS.length} étapes complétées
        </p>
      </Card>

      {/* Steps Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

        <div className="space-y-6">
          {STEPS.map((step) => {
            const isCompleted = isMilestoneCompleted(getMilestoneId(step.id))
            const isActive = activeStep === step.id

            return (
              <div key={step.id} className="relative pl-16">
                {/* Step Number */}
                <button
                  onClick={() => toggleStep(step.id)}
                  className={cn(
                    'absolute left-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all z-10',
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isActive
                        ? 'bg-gold text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600'
                  )}
                >
                  {isCompleted ? <Check className="w-6 h-6" /> : step.id}
                </button>

                <Card
                  hover={false}
                  className={cn(
                    'cursor-pointer transition-all',
                    isActive && 'ring-2 ring-gold',
                    isCompleted && 'bg-green-50 dark:bg-green-900/10'
                  )}
                  onClick={() => setActiveStep(step.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={cn(
                          'font-bold text-lg',
                          isCompleted && 'text-green-600'
                        )}>
                          {step.title}
                        </h3>
                        {isCompleted && <Badge variant="success" size="sm">Fait</Badge>}
                      </div>
                      <p className="text-gray-500">{step.description}</p>
                    </div>
                    <Badge variant="default" size="sm">{step.duration}</Badge>
                  </div>

                  {isActive && (
                    <div className="animate-fade-in">
                      <div className="space-y-2 mb-4">
                        {step.tasks.map((task, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <Circle className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{task}</span>
                          </div>
                        ))}
                      </div>

                      <div className="bg-gold-pale dark:bg-gold/10 p-3 rounded-lg">
                        <p className="text-sm">
                          <strong className="text-gold-dark">💡 Tip:</strong> {step.tips}
                        </p>
                      </div>

                      <Button
                        className="mt-4"
                        variant={isCompleted ? 'success' : 'gold'}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleStep(step.id)
                        }}
                      >
                        {isCompleted ? 'Marquer non fait' : 'Marquer comme fait'}
                      </Button>
                    </div>
                  )}
                </Card>
              </div>
            )
          })}
        </div>
      </div>

      {/* Completion */}
      {progress === 100 && (
        <Card variant="gold" hover={false} className="text-center">
          <Trophy className="w-16 h-16 text-gold-dark mx-auto mb-4" />
          <h2 className="text-2xl font-bold font-playfair mb-2">Félicitations!</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Tu as complété le parcours première vente! Continue sur ta lancée et
            consulte les modules avancés pour aller encore plus loin.
          </p>
        </Card>
      )}
    </div>
  )
}
