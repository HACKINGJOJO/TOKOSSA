import { useState } from 'react'
import { Card, CardHeader, CardTitle, Badge, Button } from '@/components/ui'
import { AlertTriangle, Phone, CheckCircle, Copy, Check } from 'lucide-react'
import { cn } from '@/utils/helpers'

const CRISIS_TYPES = [
  {
    id: 'livraison',
    title: 'Problème de livraison',
    icon: '📦',
    scenarios: [
      {
        problem: 'Client dit ne pas avoir reçu',
        solution: 'Vérifier avec le livreur, demander preuve de livraison, proposer renvoi si perdu',
        script: `Je comprends ta frustration. Laisse-moi vérifier avec notre livreur. Tu peux me confirmer ton adresse exacte? Je reviens vers toi dans 30 min max avec une solution.`
      },
      {
        problem: 'Livraison en retard',
        solution: 'S\'excuser, donner une nouvelle date, offrir compensation',
        script: `Je suis vraiment désolé pour ce retard. Le colis sera livré demain avant 18h. Pour m'excuser, je t'offre 10% sur ta prochaine commande.`
      },
      {
        problem: 'Mauvaise adresse livrée',
        solution: 'Récupérer le colis si possible, renvoyer à la bonne adresse',
        script: `Je vois le problème. Je contacte le livreur pour récupérer le colis et le faire livrer à la bonne adresse. Ça sera fait aujourd'hui même.`
      },
    ]
  },
  {
    id: 'qualite',
    title: 'Problème de qualité',
    icon: '⚠️',
    scenarios: [
      {
        problem: 'Produit défectueux',
        solution: 'Proposer échange immédiat, ne pas discuter',
        script: `Je suis vraiment navré pour ce désagrément. Je te propose un échange immédiat. Tu peux me renvoyer une photo du défaut? Je prépare ton nouveau produit tout de suite.`
      },
      {
        problem: 'Produit ne correspond pas à la photo',
        solution: 'Proposer retour et remboursement ou échange',
        script: `Je comprends ta déception. Tu as le choix: soit je te rembourse intégralement, soit je t'échange contre un autre produit de ton choix. Qu'est-ce qui te convient le mieux?`
      },
      {
        problem: 'Mauvaise taille',
        solution: 'Échange gratuit si stock disponible',
        script: `Pas de souci! Je vérifie si j'ai ta taille en stock... Oui c'est bon! On fait l'échange gratuitement. Tu peux me renvoyer le produit et je t'envoie la bonne taille.`
      },
    ]
  },
  {
    id: 'paiement',
    title: 'Problème de paiement',
    icon: '💳',
    scenarios: [
      {
        problem: 'Client a payé mais pas reçu',
        solution: 'Vérifier le paiement, rassurer, donner timeline',
        script: `Je vérifie ton paiement... C'est bien reçu! Ta commande est en préparation et sera livrée demain. Je t'envoie le contact du livreur dès qu'il part.`
      },
      {
        problem: 'Client veut annuler après paiement',
        solution: 'Si pas encore envoyé, rembourser. Si envoyé, expliquer',
        script: `Je comprends. Comme le produit n'est pas encore parti, je peux te rembourser intégralement. Tu recevras ton argent dans les 24h.`
      },
      {
        problem: 'Client dit avoir payé mais pas de trace',
        solution: 'Demander preuve de paiement, vérifier calmement',
        script: `Je ne vois pas le paiement de mon côté. Tu peux m'envoyer une capture d'écran de la confirmation? Ça m'aidera à tracer le problème.`
      },
    ]
  },
  {
    id: 'agressif',
    title: 'Client agressif',
    icon: '😤',
    scenarios: [
      {
        problem: 'Client insulte ou menace',
        solution: 'Rester calme, ne pas répondre aux provocations, proposer solution',
        script: `Je comprends que tu sois frustré et je veux vraiment résoudre ce problème. Concentrons-nous sur la solution: que puis-je faire pour arranger ça?`
      },
      {
        problem: 'Client menace bad buzz',
        solution: 'Ne pas céder au chantage mais proposer solution raisonnable',
        script: `Je comprends ta frustration. Mon objectif est de te satisfaire. Voici ce que je te propose [solution]. C'est le maximum que je peux faire.`
      },
      {
        problem: 'Client exige remboursement abusif',
        solution: 'Rester ferme mais poli, expliquer la politique',
        script: `Je comprends ta demande mais notre politique est claire sur ce point. Cependant, je peux te proposer [alternative]. C'est la meilleure solution que je peux offrir.`
      },
    ]
  },
]

const GOLDEN_RULES = [
  { icon: '⏰', rule: 'Répondre en moins de 2h', desc: 'La rapidité calme les tensions' },
  { icon: '😊', rule: 'Toujours rester poli', desc: 'Même si le client est agressif' },
  { icon: '🎧', rule: 'Écouter avant de répondre', desc: 'Comprendre le vrai problème' },
  { icon: '💡', rule: 'Proposer une solution', desc: 'Ne jamais dire juste "non"' },
  { icon: '📝', rule: 'Tout documenter', desc: 'Garder trace des échanges' },
  { icon: '🎁', rule: 'Compenser si nécessaire', desc: 'Un geste commercial fidélise' },
]

export function SAV() {
  const [selectedCrisis, setSelectedCrisis] = useState(CRISIS_TYPES[0])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCopy = async (script: string, index: number) => {
    await navigator.clipboard.writeText(script)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <Badge variant="gold" className="mb-2">Support</Badge>
        <h1 className="text-3xl font-bold font-playfair">
          <span className="gradient-text">SAV & Gestion de Crises</span>
        </h1>
        <p className="text-gray-500 mt-2">
          Scripts et solutions pour gérer les situations difficiles
        </p>
      </div>

      {/* Golden Rules */}
      <Card variant="gold" hover={false}>
        <h3 className="font-bold font-playfair text-lg mb-4">Les 6 Règles d'Or du SAV</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {GOLDEN_RULES.map((rule, i) => (
            <div key={i} className="bg-white dark:bg-dark-card p-3 rounded-xl">
              <div className="text-2xl mb-1">{rule.icon}</div>
              <h4 className="font-semibold text-sm">{rule.rule}</h4>
              <p className="text-xs text-gray-500">{rule.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Crisis Types */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CRISIS_TYPES.map(crisis => (
          <Card
            key={crisis.id}
            className={cn(
              'cursor-pointer text-center transition-all',
              selectedCrisis.id === crisis.id && 'ring-2 ring-gold'
            )}
            onClick={() => setSelectedCrisis(crisis)}
          >
            <div className="text-3xl mb-2">{crisis.icon}</div>
            <h4 className="font-semibold text-sm">{crisis.title}</h4>
            <p className="text-xs text-gray-500">{crisis.scenarios.length} scénarios</p>
          </Card>
        ))}
      </div>

      {/* Scenarios */}
      <Card hover={false}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">{selectedCrisis.icon}</span>
            {selectedCrisis.title}
          </CardTitle>
        </CardHeader>

        <div className="space-y-6">
          {selectedCrisis.scenarios.map((scenario, i) => (
            <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <h4 className="font-bold text-red-600">Problème: {scenario.problem}</h4>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-600">Solution:</p>
                    <p className="text-gray-600 dark:text-gray-400">{scenario.solution}</p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-dark-secondary p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm text-gold-dark">Script à copier:</span>
                    <Button
                      size="sm"
                      variant={copiedIndex === i ? 'success' : 'outline'}
                      onClick={() => handleCopy(scenario.script, i)}
                      leftIcon={copiedIndex === i ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    >
                      {copiedIndex === i ? 'Copié!' : 'Copier'}
                    </Button>
                  </div>
                  <p className="text-sm italic text-gray-700 dark:text-gray-300">
                    "{scenario.script}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Emergency Contact */}
      <Card hover={false}>
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Phone className="w-5 h-5 text-gold-dark" />
          En cas de crise majeure
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-dark-secondary rounded-xl">
            <h4 className="font-semibold mb-2">Ne jamais faire:</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>❌ Ignorer le message</li>
              <li>❌ Répondre sous le coup de l'émotion</li>
              <li>❌ Supprimer les commentaires négatifs</li>
              <li>❌ Mentir ou promettre l'impossible</li>
            </ul>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-dark-secondary rounded-xl">
            <h4 className="font-semibold mb-2">Toujours faire:</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>✅ Prendre du recul avant de répondre</li>
              <li>✅ S'excuser sincèrement si c'est ta faute</li>
              <li>✅ Proposer une solution concrète</li>
              <li>✅ Transformer le problème en opportunité</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
