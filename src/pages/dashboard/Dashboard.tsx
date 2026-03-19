import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getRoutePath } from '@/app/routes'
import { useProgressStore } from '@/stores/progressStore'
import { Card, Button, Badge } from '@/components/ui'
import { StatCard, ModuleCard, ToolCard, TestimonialCard } from '@/components/features'
import { useAuthStore } from '@/features/auth'
import { useOnboardingStore, OnboardingChannel, OnboardingObjective } from '@/stores/onboardingStore'
import { useWeeklyFeedStore } from '@/stores/weeklyFeedStore'
import { analytics } from '@/services/analytics'
import { CATEGORIES } from '@/utils/constants'
import { Wrench, MessageSquare, Target, ExternalLink } from 'lucide-react'

const TESTIMONIALS = [
  {
    quote: "La formation m'a donné une vraie méthode. J'ai lancé en 3 semaines.",
    author: 'Membre',
    location: 'Cotonou',
  },
  {
    quote: "Les scripts WhatsApp et le pricing, c'est du concret. J'ai doublé mes ventes.",
    author: 'Membre',
    location: 'Bénin',
  },
  {
    quote: "Enfin du contenu e-commerce adapté à chez nous. Merci JOJO.",
    author: 'Membre',
  },
]

const MILESTONES = [
  { id: 'j1', label: 'Niche & budget validés' },
  { id: 'j2', label: 'Produit & fournisseur trouvés' },
  { id: 'j3', label: 'Présence en ligne OK' },
  { id: 'j4', label: 'Première vente' },
  { id: 'j5', label: '10 ventes' },
  { id: 'j6', label: 'Premier 100k FCFA' },
]

const ONBOARDING_OBJECTIVES: { value: OnboardingObjective; label: string; description: string }[] = [
  { value: 'premiere_vente', label: 'Faire ma 1ère vente', description: 'Objectif démarrage rapide' },
  { value: 'doubler_ventes', label: 'Doubler mes ventes', description: 'Objectif croissance' },
  { value: 'systeme', label: 'Créer un système stable', description: 'Objectif long terme' },
]

const ONBOARDING_CHANNELS: { value: OnboardingChannel; label: string }[] = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
]

export function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const {
    getTotalProgress,
    getCompletedModules,
    getLevel,
    getBadges,
    getModuleProgress,
    hasCompletedAllForCertificate,
    isMilestoneCompleted,
    getMilestoneCompletionCount,
    progress,
  } = useProgressStore()
  const {
    status: onboardingStatus,
    niche,
    objective,
    channel,
    syncUser,
    start,
    setNiche,
    setObjective,
    setChannel,
    complete,
  } = useOnboardingStore()
  const [onboardingStep, setOnboardingStep] = useState(1)
  const { ensureCurrentWeek, updates, seenIds, markSeen, unseenCount } = useWeeklyFeedStore()

  const totalProgress = getTotalProgress()
  const completedModules = getCompletedModules()
  const level = getLevel()
  const badges = getBadges()
  const canGetCertificate = hasCompletedAllForCertificate()
  const completedMilestones = getMilestoneCompletionCount()
  const unseenWeekly = unseenCount()
  const dashboardPath = getRoutePath('dashboard')
  const leaderboardPath = getRoutePath('leaderboard')
  const parcoursPath = getRoutePath('parcours')
  const certificatPath = getRoutePath('certificat')
  const workspacePath = getRoutePath('workspace')
  const promptsPath = getRoutePath('prompts')
  const tricksPath = getRoutePath('tricks')
  const fondationsPath = getRoutePath('fondations')
  const sourcingPath = getRoutePath('sourcing')
  const marketingPath = getRoutePath('marketing')
  const shopifyPath = getRoutePath('shopify')
  const onboardingIsVisible = onboardingStatus !== 'completed'
  const onboardingPercent = Math.round((onboardingStep / 3) * 100)
  const lastVisitedPath = progress.lastVisited
    ? getRoutePath(progress.lastVisited, dashboardPath)
    : dashboardPath

  const nicheLabel = useMemo(() => {
    return CATEGORIES.find((cat) => cat.value === niche)?.label || niche
  }, [niche])

  useEffect(() => {
    if (!user?.id) return
    syncUser(user.id)
  }, [syncUser, user?.id])

  useEffect(() => {
    ensureCurrentWeek()
  }, [ensureCurrentWeek])

  useEffect(() => {
    if (onboardingStatus === 'completed') return
    if (!niche) {
      setOnboardingStep(1)
      return
    }
    if (!objective) {
      setOnboardingStep(2)
      return
    }
    setOnboardingStep(3)
  }, [niche, objective, onboardingStatus])

  const handleChooseNiche = (value: string) => {
    if (onboardingStatus === 'not_started') {
      start()
      analytics.track('onboarding_started', { step: 1 }, user?.id)
    }
    setNiche(value)
    setOnboardingStep(2)
  }

  const handleChooseObjective = (value: OnboardingObjective) => {
    setObjective(value)
    setOnboardingStep(3)
  }

  const handleLaunchWorkspace = () => {
    if (!channel) return
    complete()
    analytics.track(
      'onboarding_completed',
      { niche, objective, channel, step: 3 },
      user?.id
    )
    navigate(`${workspacePath}?tab=script&onboarding=1`)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-4xl font-black font-playfair mb-2">
          <span className="gradient-text">Bienvenue Boss!</span> 👑
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Ton empire e-commerce commence ici.
        </p>
      </div>

      {onboardingIsVisible && (
        <Card variant="gold" hover={false}>
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-xl font-bold font-playfair">Démarrage Express (10 min)</h2>
            <span className="text-sm font-semibold text-gold-dark">{onboardingPercent}%</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-5">
            Objectif immédiat: repartir avec un script concret prêt à envoyer à un prospect.
          </p>

          {onboardingStep === 1 && (
            <div className="space-y-3">
              <p className="font-semibold text-gold-dark">1. Choisis ta niche</p>
              <p className="text-sm text-gray-500">Choisis celle que tu veux attaquer cette semaine.</p>
              <div className="grid md:grid-cols-2 gap-3">
                {CATEGORIES.slice(0, 6).map((cat) => (
                  <Button
                    key={cat.value}
                    variant={niche === cat.value ? 'gold' : 'outline'}
                    onClick={() => handleChooseNiche(cat.value)}
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {onboardingStep === 2 && (
            <div className="space-y-3">
              <p className="font-semibold text-gold-dark">2. Ton objectif principal</p>
              <p className="text-sm text-gray-500">Sélectionne un seul objectif pour rester focus.</p>
              <div className="grid md:grid-cols-3 gap-3">
                {ONBOARDING_OBJECTIVES.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => handleChooseObjective(item.value)}
                    className="text-left p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-gold transition-colors"
                  >
                    <p className="font-semibold">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </button>
                ))}
              </div>
              <Button variant="ghost" onClick={() => setOnboardingStep(1)}>
                Retour
              </Button>
            </div>
          )}

          {onboardingStep === 3 && (
            <div className="space-y-3">
              <p className="font-semibold text-gold-dark">3. Canal prioritaire</p>
              <p className="text-sm text-gray-500">On génère ensuite un script aligné sur ce canal.</p>
              <div className="grid grid-cols-3 gap-3">
                {ONBOARDING_CHANNELS.map((item) => (
                  <Button
                    key={item.value}
                    variant={channel === item.value ? 'gold' : 'outline'}
                    onClick={() => setChannel(item.value)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
              <div className="bg-white dark:bg-dark-card p-4 rounded-xl border border-gold/40">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Niche: <strong>{nicheLabel || '-'}</strong> | Objectif:{' '}
                  <strong>{ONBOARDING_OBJECTIVES.find((o) => o.value === objective)?.label || '-'}</strong> | Canal:{' '}
                  <strong>{ONBOARDING_CHANNELS.find((c) => c.value === channel)?.label || '-'}</strong>
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleLaunchWorkspace} disabled={!channel}>
                  Générer mon script maintenant
                </Button>
                <Button variant="outline" onClick={() => setOnboardingStep(2)}>
                  Retour
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      <Card variant="default" hover={false}>
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-bold font-playfair">Nouveau cette semaine</h2>
          <Badge variant={unseenWeekly > 0 ? 'gold' : 'default'}>
            {unseenWeekly > 0 ? `${unseenWeekly} nouveau(x)` : 'Tout vu'}
          </Badge>
        </div>
        <div className="space-y-3">
          {updates.length === 0 && (
            <div className="p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-sm text-gray-500">
              Aucun update hebdo pour le moment.
            </div>
          )}
          {updates.map((item) => {
            const isSeen = seenIds.includes(item.id)
            return (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-secondary"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <Badge variant={isSeen ? 'default' : 'gold'} size="sm">
                    {isSeen ? 'Vu' : 'Nouveau'}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    onClick={() => {
                      markSeen(item.id)
                      navigate(getRoutePath(item.routeId, dashboardPath))
                    }}
                  >
                    Ouvrir
                  </Button>
                  {!isSeen && (
                    <Button size="sm" variant="outline" onClick={() => markSeen(item.id)}>
                      Marquer vu
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard value={`${totalProgress}%`} label="Progression" />
        <StatCard value={`${completedModules.length}/8`} label="Modules" />
        <StatCard
          value={level.icon}
          label={level.name}
          onClick={() => navigate(leaderboardPath)}
        />
        <StatCard value={level.xp} label="XP" />
      </div>

      {/* Resume Block */}
      {progress.lastVisited && (
        <Card variant="default" hover={false}>
          <h2 className="text-xl font-bold font-playfair mb-3">📍 Où j'en suis</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Reprends là où tu t'es arrêté.
          </p>
          <Link to={lastVisitedPath}>
            <Button variant="outline">
              Reprendre : {progress.lastVisited.charAt(0).toUpperCase() + progress.lastVisited.slice(1)}
            </Button>
          </Link>
        </Card>
      )}

      {/* Milestones */}
      <Card variant="default" hover={false}>
        <h2 className="text-xl font-bold font-playfair mb-4">
          🎯 Jalons vers ta 1ère vente
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Objectifs intermédiaires pour garder le cap et mesurer ta progression.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          {completedMilestones}/{MILESTONES.length} jalons validés
        </p>
        <ul className="space-y-3 mb-6">
          {MILESTONES.map((milestone, i) => (
            <li
              key={milestone.id}
              className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
            >
              <span className={isMilestoneCompleted(milestone.id) ? 'text-green-500' : 'text-gray-400'}>
                {isMilestoneCompleted(milestone.id) ? '✓' : '○'}
              </span>
              <span className="font-semibold text-gold-dark">J{i + 1}</span>
              <span className="text-gray-700 dark:text-gray-300">{milestone.label}</span>
            </li>
          ))}
        </ul>
        <Link to={parcoursPath}>
          <Button>Voir le parcours complet (8 étapes)</Button>
        </Link>
      </Card>

      {/* Certificate CTA */}
      {canGetCertificate && (
        <Card variant="gold" hover={false}>
          <h2 className="text-xl font-bold font-playfair mb-3">
            🏆 Tu as tout validé !
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Débloque ton certificat de réussite officiel.
          </p>
          <Link to={certificatPath}>
            <Button>Obtenir mon certificat</Button>
          </Link>
        </Card>
      )}

      {/* Badges */}
      {badges.length > 0 && (
        <Card variant="default" hover={false}>
          <h2 className="text-xl font-bold font-playfair mb-4">🏅 Tes badges</h2>
          <div className="flex flex-wrap gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-secondary rounded-full font-semibold"
              >
                <span>{badge.icon}</span>
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Testimonials */}
      <Card variant="gold" hover={false}>
        <h2 className="text-xl font-bold font-playfair mb-6">
          💬 Ce que disent les membres
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={i} {...t} />
          ))}
        </div>
      </Card>

      {/* Community */}
      <Card variant="default" hover={false}>
        <h2 className="text-xl font-bold font-playfair mb-3">
          👥 Rejoins la communauté
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Échange avec d'autres membres, partage tes wins et pose tes questions.
        </p>
        <a
          href="https://wa.me/?text=Je%20suis%20membre%20JOJO%20E-Commerce%20Mastery"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button rightIcon={<ExternalLink className="w-4 h-4" />}>
            Rejoindre le groupe WhatsApp
          </Button>
        </a>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold font-playfair mb-5">Accès Rapide</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <ToolCard
            title="Workspace"
            description="Générateur de descriptions, posts, scripts..."
            icon={Wrench}
            href={workspacePath}
          />
          <ToolCard
            title="Prompts IA"
            description="Bibliothèque de prompts prêts à l'emploi"
            icon={MessageSquare}
            href={promptsPath}
          />
          <ToolCard
            title="Tricks"
            description="15+ tricks secrets pour booster tes ventes"
            icon={Target}
            href={tricksPath}
          />
        </div>
      </div>

      {/* Formation Modules */}
      <div>
        <h2 className="text-2xl font-bold font-playfair mb-5">Ta Formation</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <ModuleCard
            moduleNumber={1}
            title="Fondations Stratégiques"
            description="Niches rentables, pricing, budget de démarrage..."
            href={fondationsPath}
            progress={getModuleProgress('fondations')}
          />
          <ModuleCard
            moduleNumber={2}
            title="Sourcing & Fournisseurs"
            description="Local vs Chine, négociation, stratégie hybride..."
            href={sourcingPath}
            progress={getModuleProgress('sourcing')}
          />
          <ModuleCard
            moduleNumber={3}
            title="Marketing & Vente"
            description="AIDA, Facebook Ads, Scripts WhatsApp..."
            href={marketingPath}
            progress={getModuleProgress('marketing')}
          />
          <ModuleCard
            moduleNumber={4}
            title="Shopify Mastery"
            description="Setup complet, paiements Afrique, apps..."
            href={shopifyPath}
            progress={getModuleProgress('shopify')}
          />
        </div>
      </div>

      {/* Motivation Quote */}
      <Card variant="gold" hover={false} className="text-center py-8">
        <p className="text-xl italic mb-3">
          "Le succès n'attend pas. Il se construit vente après vente, client après client."
        </p>
        <p className="text-gold-dark font-bold">— JOJO E-Commerce Mastery</p>
      </Card>
    </div>
  )
}
