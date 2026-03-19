import { useState } from 'react'
import { Card, Badge, Button, Progress } from '@/components/ui'
import { CheckCircle, XCircle, Trophy, RotateCcw, ChevronRight } from 'lucide-react'
import { cn } from '@/utils/helpers'
import { useProgressStore } from '@/stores/progressStore'

const QUIZZES = [
  {
    id: 'fondations',
    title: 'Quiz Fondations',
    description: 'Teste tes connaissances sur les bases',
    icon: '🏗️',
    questions: [
      {
        question: 'Quelle est la marge minimum recommandée pour être rentable?',
        options: ['20%', '35%', '50%', '70%'],
        correct: 2,
        explanation: '50% de marge nette minimum permet de couvrir les frais et générer du profit.'
      },
      {
        question: 'Quelle est la formule de prix recommandée?',
        options: [
          'Prix vente = Prix achat × 1.5',
          'Prix vente = Prix achat × 2',
          'Prix vente = (Prix achat × 2.5) + Frais',
          'Prix vente = Prix achat + 5000 FCFA'
        ],
        correct: 2,
        explanation: 'La formule (Prix achat × 2.5) + Frais garantit une marge suffisante.'
      },
      {
        question: 'Combien de niches est-il recommandé de combiner?',
        options: ['1 seule', '2-3 complémentaires', '5-10', 'Autant que possible'],
        correct: 1,
        explanation: 'La stratégie "Mix 3 Niches" permet de diversifier sans se disperser.'
      },
    ]
  },
  {
    id: 'marketing',
    title: 'Quiz Marketing',
    description: 'Maîtrises-tu le copywriting et la vente?',
    icon: '📢',
    questions: [
      {
        question: 'Que signifie AIDA?',
        options: [
          'Attention, Innovation, Demande, Achat',
          'Attention, Intérêt, Désir, Action',
          'Analyse, Information, Décision, Action',
          'Attraction, Interaction, Discussion, Achat'
        ],
        correct: 1,
        explanation: 'AIDA = Attention, Intérêt, Désir, Action - la structure parfaite pour vendre.'
      },
      {
        question: 'Quelle fréquence de publication est recommandée?',
        options: ['1 post par semaine', '1 post par jour', '2-3 posts par jour', '10 posts par jour'],
        correct: 1,
        explanation: 'Un post par jour minimum pour maintenir l\'engagement.'
      },
      {
        question: 'Quel type de contenu génère le plus d\'engagement?',
        options: ['Images statiques', 'Texte uniquement', 'Vidéos', 'Liens externes'],
        correct: 2,
        explanation: 'Les vidéos ont 2-3x plus d\'engagement que les images.'
      },
    ]
  },
  {
    id: 'facebook-ads',
    title: 'Quiz Facebook Ads',
    description: 'Es-tu prêt à lancer des pubs?',
    icon: '🎯',
    questions: [
      {
        question: 'Qu\'est-ce que le Pixel Facebook?',
        options: [
          'Un format d\'image',
          'Un code de tracking',
          'Un type de pub',
          'Une audience'
        ],
        correct: 1,
        explanation: 'Le Pixel est un code qui track les visiteurs et conversions sur ton site.'
      },
      {
        question: 'Un bon CTR (taux de clic) est supérieur à:',
        options: ['0.5%', '1%', '2%', '5%'],
        correct: 2,
        explanation: 'Un CTR supérieur à 2% indique que ta pub est pertinente pour ton audience.'
      },
      {
        question: 'Combien de temps attendre avant de juger une campagne?',
        options: ['6 heures', '24 heures', '48-72 heures', '1 semaine'],
        correct: 2,
        explanation: 'Attendre 48-72h permet à l\'algorithme d\'optimiser et d\'avoir des données fiables.'
      },
      {
        question: 'Qu\'est-ce que le ROAS?',
        options: [
          'Retour sur investissement',
          'Retour sur dépense publicitaire',
          'Ratio d\'audience',
          'Réduction offre spéciale'
        ],
        correct: 1,
        explanation: 'ROAS = Return On Ad Spend, le revenu généré par FCFA dépensé en pub.'
      },
    ]
  },
  {
    id: 'sourcing',
    title: 'Quiz Sourcing',
    description: 'Sais-tu trouver les bons fournisseurs?',
    icon: '📦',
    questions: [
      {
        question: 'Que signifie MOQ?',
        options: [
          'Mode Of Quality',
          'Minimum Order Quantity',
          'Maximum Order Quantity',
          'Money Or Quality'
        ],
        correct: 1,
        explanation: 'MOQ = Quantité minimum de commande exigée par le fournisseur.'
      },
      {
        question: 'Quelle est la première étape avant de payer un fournisseur?',
        options: [
          'Négocier le prix',
          'Vérifier les avis',
          'Commander un échantillon',
          'Payer un acompte'
        ],
        correct: 2,
        explanation: 'Toujours valider la qualité avec un échantillon avant une grosse commande.'
      },
      {
        question: 'Quel avantage a le sourcing local?',
        options: [
          'Prix plus bas',
          'Stock immédiat',
          'Plus de choix',
          'Meilleure qualité'
        ],
        correct: 1,
        explanation: 'Le local permet un stock immédiat et pas de risque douane/délai.'
      },
    ]
  },
]

type QuizState = 'menu' | 'playing' | 'results'

export function Quiz() {
  const [state, setState] = useState<QuizState>('menu')
  const [selectedQuiz, setSelectedQuiz] = useState<typeof QUIZZES[0] | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [showExplanation, setShowExplanation] = useState(false)
  const { addXP } = useProgressStore()

  const startQuiz = (quiz: typeof QUIZZES[0]) => {
    setSelectedQuiz(quiz)
    setCurrentQuestion(0)
    setAnswers([])
    setSelectedAnswer(null)
    setShowExplanation(false)
    setState('playing')
  }

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(index)
    setShowExplanation(true)
  }

  const nextQuestion = () => {
    if (!selectedQuiz) return

    setAnswers([...answers, selectedAnswer!])

    if (currentQuestion < selectedQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setState('results')
      // Award XP based on score
      const finalAnswers = [...answers, selectedAnswer!]
      const correctCount = finalAnswers.filter(
        (a, i) => a === selectedQuiz.questions[i].correct
      ).length
      const xpEarned = correctCount * 10
      addXP(xpEarned)
    }
  }

  const getScore = () => {
    if (!selectedQuiz) return { correct: 0, total: 0, percentage: 0 }
    const correct = answers.filter(
      (a, i) => a === selectedQuiz.questions[i].correct
    ).length
    const total = selectedQuiz.questions.length
    return { correct, total, percentage: Math.round((correct / total) * 100) }
  }

  const resetQuiz = () => {
    setState('menu')
    setSelectedQuiz(null)
    setCurrentQuestion(0)
    setAnswers([])
    setSelectedAnswer(null)
    setShowExplanation(false)
  }

  // Menu State
  if (state === 'menu') {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <Badge variant="gold" className="mb-2">Évaluation</Badge>
          <h1 className="text-3xl font-bold font-playfair">
            <span className="gradient-text">Quiz E-commerce</span>
          </h1>
          <p className="text-gray-500 mt-2">
            Teste tes connaissances et gagne des XP!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {QUIZZES.map(quiz => (
            <Card key={quiz.id} className="cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => startQuiz(quiz)}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold-light rounded-xl flex items-center justify-center text-3xl">
                  {quiz.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{quiz.title}</h3>
                  <p className="text-sm text-gray-500">{quiz.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="default">{quiz.questions.length} questions</Badge>
                <Button size="sm" variant="gold" rightIcon={<ChevronRight className="w-4 h-4" />}>
                  Commencer
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Card variant="gold" hover={false}>
          <div className="flex items-center gap-4">
            <Trophy className="w-10 h-10 text-gold-dark" />
            <div>
              <h3 className="font-bold">Gagne des XP!</h3>
              <p className="text-sm text-gray-600">10 XP par bonne réponse. Réponds correctement pour progresser!</p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // Playing State
  if (state === 'playing' && selectedQuiz) {
    const question = selectedQuiz.questions[currentQuestion]
    const isCorrect = selectedAnswer === question.correct

    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="gold">{selectedQuiz.title}</Badge>
            <h1 className="text-2xl font-bold mt-2">
              Question {currentQuestion + 1}/{selectedQuiz.questions.length}
            </h1>
          </div>
          <Button variant="ghost" onClick={resetQuiz}>
            Quitter
          </Button>
        </div>

        <Progress value={((currentQuestion + 1) / selectedQuiz.questions.length) * 100} />

        <Card hover={false}>
          <h2 className="text-xl font-bold mb-6">{question.question}</h2>

          <div className="space-y-3">
            {question.options.map((option, i) => {
              const isSelected = selectedAnswer === i
              const isCorrectOption = i === question.correct
              const showResult = selectedAnswer !== null

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={selectedAnswer !== null}
                  className={cn(
                    'w-full p-4 rounded-xl text-left transition-all border-2',
                    !showResult && 'border-gray-200 dark:border-gray-700 hover:border-gold hover:bg-gold/5',
                    showResult && isCorrectOption && 'border-green-500 bg-green-50 dark:bg-green-900/20',
                    showResult && isSelected && !isCorrectOption && 'border-red-500 bg-red-50 dark:bg-red-900/20',
                    showResult && !isSelected && !isCorrectOption && 'border-gray-200 dark:border-gray-700 opacity-50'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && isCorrectOption && <CheckCircle className="w-5 h-5 text-green-500" />}
                    {showResult && isSelected && !isCorrectOption && <XCircle className="w-5 h-5 text-red-500" />}
                  </div>
                </button>
              )
            })}
          </div>

          {showExplanation && (
            <div className={cn(
              'mt-6 p-4 rounded-xl',
              isCorrect ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
            )}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-bold text-green-600">Correct! +10 XP</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-500" />
                    <span className="font-bold text-red-600">Incorrect</span>
                  </>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400">{question.explanation}</p>
            </div>
          )}

          {selectedAnswer !== null && (
            <div className="mt-6 flex justify-end">
              <Button onClick={nextQuestion} rightIcon={<ChevronRight className="w-4 h-4" />}>
                {currentQuestion < selectedQuiz.questions.length - 1 ? 'Suivant' : 'Voir les résultats'}
              </Button>
            </div>
          )}
        </Card>
      </div>
    )
  }

  // Results State
  if (state === 'results' && selectedQuiz) {
    const { correct, total, percentage } = getScore()
    const xpEarned = correct * 10

    return (
      <div className="space-y-8 animate-fade-in">
        <Card hover={false} className="text-center">
          <div className="mb-6">
            {percentage >= 80 ? (
              <div className="text-6xl mb-4">🏆</div>
            ) : percentage >= 50 ? (
              <div className="text-6xl mb-4">👍</div>
            ) : (
              <div className="text-6xl mb-4">📚</div>
            )}
            <h1 className="text-3xl font-bold font-playfair mb-2">
              {percentage >= 80 ? 'Excellent!' : percentage >= 50 ? 'Pas mal!' : 'Continue à apprendre!'}
            </h1>
            <p className="text-gray-500">Quiz terminé</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 dark:bg-dark-secondary p-4 rounded-xl">
              <div className="text-3xl font-bold text-gold-dark">{correct}/{total}</div>
              <div className="text-sm text-gray-500">Bonnes réponses</div>
            </div>
            <div className="bg-gray-50 dark:bg-dark-secondary p-4 rounded-xl">
              <div className="text-3xl font-bold text-green-600">{percentage}%</div>
              <div className="text-sm text-gray-500">Score</div>
            </div>
            <div className="bg-gray-50 dark:bg-dark-secondary p-4 rounded-xl">
              <div className="text-3xl font-bold text-purple-600">+{xpEarned}</div>
              <div className="text-sm text-gray-500">XP gagnés</div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={resetQuiz} leftIcon={<RotateCcw className="w-4 h-4" />}>
              Retour aux quiz
            </Button>
            <Button onClick={() => startQuiz(selectedQuiz)} leftIcon={<RotateCcw className="w-4 h-4" />}>
              Recommencer
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return null
}
