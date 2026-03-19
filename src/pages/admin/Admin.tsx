import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, Badge, Button, Input } from '@/components/ui'
import { Users, UserPlus, Trash2, Key, Shield, BarChart3 } from 'lucide-react'
import { cn } from '@/utils/helpers'
import { useAuthStore } from '@/features/auth'
import { authClient } from '@/features/auth/services/authClient'
import { User } from '@/types'
import { analytics } from '@/services/analytics'
import { workspaceLearning } from '@/services/workspaceLearning'

export function Admin() {
  const { isAdmin } = useAuthStore()
  const [members, setMembers] = useState<User[]>([])
  const [newMemberName, setNewMemberName] = useState('')
  const [analyticsRefreshTs, setAnalyticsRefreshTs] = useState(Date.now())
  const [isLoadingMembers, setIsLoadingMembers] = useState(false)
  const [membersError, setMembersError] = useState<string | null>(null)
  const now = Date.now()
  const oneWeekMs = 7 * 24 * 60 * 60 * 1000
  const expiringSoonCount = members.filter((m) => m.expiresAt && m.expiresAt > now && m.expiresAt - now <= oneWeekMs).length
  const inactiveCount = members.filter((m) => !m.active).length

  useEffect(() => {
    ;(async () => {
      try {
        setIsLoadingMembers(true)
        setMembersError(null)
        const users = await authClient.getUsers()
        setMembers(users.filter(u => u.role === 'member'))
      } catch {
        setMembersError('Impossible de charger les membres.')
      } finally {
        setIsLoadingMembers(false)
      }
    })()
  }, [])

  const loadMembers = async () => {
    try {
      setIsLoadingMembers(true)
      setMembersError(null)
      const users = await authClient.getUsers()
      setMembers(users.filter(u => u.role === 'member'))
    } catch {
      setMembersError('Impossible de charger les membres.')
    } finally {
      setIsLoadingMembers(false)
    }
  }

  const handleCreateMember = async () => {
    if (!newMemberName.trim()) return

    const result = await authClient.addMember(newMemberName)

    if (result.success) {
      setNewMemberName('')
      await loadMembers()
    } else {
      alert(result.message)
    }
  }

  const handleDeleteMember = async (userId: string) => {
    if (confirm('Supprimer ce membre?')) {
      await authClient.removeMember(userId)
      await loadMembers()
    }
  }

  const handleResetPin = async (userId: string) => {
    if (confirm('Régénérer le code de ce membre?')) {
      const result = await authClient.regenerateCode(userId)
      await loadMembers()
      if (result.success && result.code) {
        alert(`Nouveau code: ${result.code}`)
      }
    }
  }

  const handleExportMembersCsv = () => {
    const lines = [
      ['id', 'name', 'active', 'code', 'createdAt', 'expiresAt'].join(','),
      ...members.map((m) =>
        [
          m.id,
          `"${m.name.replace(/"/g, '""')}"`,
          String(m.active),
          m.code || '',
          new Date(m.createdAt).toISOString(),
          m.expiresAt ? new Date(m.expiresAt).toISOString() : '',
        ].join(',')
      ),
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `jojo-members-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleCopyRelance = async () => {
    const targets = members.filter((m) => !m.active || (m.expiresAt && m.expiresAt > now && m.expiresAt - now <= oneWeekMs))
    if (!targets.length) {
      alert('Aucun membre à relancer pour le moment')
      return
    }
    const names = targets.map((m) => m.name).join(', ')
    const message = `Bonjour ${names}, ton accès JOJO arrive à échéance ou est inactif. Réponds à ce message pour réactiver ton plan rapidement.`
    try {
      await navigator.clipboard.writeText(message)
      alert('Message de relance copié')
    } catch {
      alert(message)
    }
  }

  const handleResetInsights = () => {
    if (!confirm("Réinitialiser les données analytics/feed localement ?")) return
    localStorage.removeItem('jojo_analytics_events')
    localStorage.removeItem('jojo-weekly-feed')
    setAnalyticsRefreshTs(Date.now())
    alert('Insights réinitialisés')
  }

  const overview = analytics.getOverview(analyticsRefreshTs)
  const learningRows = workspaceLearning.getContextLeaderboard(8)

  if (!isAdmin) {
    return (
      <div className="text-center py-20">
        <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-500 mb-2">Accès restreint</h1>
        <p className="text-gray-400">Cette page est réservée aux administrateurs.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <Badge variant="gold" className="mb-2">Administration</Badge>
        <h1 className="text-3xl font-bold font-playfair">
          <span className="gradient-text">Gestion des Membres</span>
        </h1>
        <p className="text-gray-500 mt-2">
          {members.length} membre(s) actif(s)
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center">
          <Users className="w-8 h-8 text-gold-dark mx-auto mb-2" />
          <div className="text-2xl font-bold">{members.length}</div>
          <p className="text-sm text-gray-500">Membres</p>
        </Card>
        <Card className="text-center">
          <UserPlus className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">{members.filter(m => m.active).length}</div>
          <p className="text-sm text-gray-500">Actifs</p>
        </Card>
        <Card className="text-center">
          <BarChart3 className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">{members.filter(m => m.pin).length}</div>
          <p className="text-sm text-gray-500">Avec PIN</p>
        </Card>
      </div>

      <Card hover={false}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Cockpit Croissance
          </CardTitle>
        </CardHeader>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div className="p-4 bg-gray-50 dark:bg-dark-secondary rounded-xl">
            <p className="text-sm text-gray-500">Membres inactifs</p>
            <p className="text-2xl font-bold">{inactiveCount}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-dark-secondary rounded-xl">
            <p className="text-sm text-gray-500">Expiration &lt; 7 jours</p>
            <p className="text-2xl font-bold">{expiringSoonCount}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-dark-secondary rounded-xl">
            <p className="text-sm text-gray-500">Actions recommandées</p>
            <p className="text-2xl font-bold">{inactiveCount + expiringSoonCount}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handleExportMembersCsv}>
            Export CSV membres
          </Button>
          <Button onClick={handleCopyRelance}>
            Copier relance WhatsApp
          </Button>
          <Button variant="danger" onClick={handleResetInsights}>
            Reset analytics/feed
          </Button>
        </div>
      </Card>

      {/* Analytics KPI */}
      <Card hover={false}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            KPI Produit (7 jours)
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => setAnalyticsRefreshTs(Date.now())}>
            Rafraîchir
          </Button>
        </CardHeader>

        <div className="grid md:grid-cols-3 gap-4 mb-5">
          <div className="p-4 bg-gray-50 dark:bg-dark-secondary rounded-xl">
            <p className="text-sm text-gray-500">Événements (total)</p>
            <p className="text-2xl font-bold">{overview.totalEvents}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-dark-secondary rounded-xl">
            <p className="text-sm text-gray-500">Événements (7j)</p>
            <p className="text-2xl font-bold">{overview.events7d}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-dark-secondary rounded-xl">
            <p className="text-sm text-gray-500">Événements (30j)</p>
            <p className="text-2xl font-bold">{overview.events30d}</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mb-5">
          <div className="p-4 bg-gray-50 dark:bg-dark-secondary rounded-xl">
            <p className="text-sm text-gray-500">Taux d'activation (7j)</p>
            <p className="text-2xl font-bold">{overview.activationRate7d}%</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-dark-secondary rounded-xl">
            <p className="text-sm text-gray-500">Taux completion onboarding (7j)</p>
            <p className="text-2xl font-bold">{overview.onboardingCompletionRate7d}%</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-2 text-left">Funnel</th>
                <th className="py-2 text-right">Volume</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2">Onboarding démarrés</td>
                <td className="py-2 text-right font-semibold">{overview.funnel7d.onboardingStarted}</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2">Onboarding complétés</td>
                <td className="py-2 text-right font-semibold">{overview.funnel7d.onboardingCompleted}</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2">Login réussis</td>
                <td className="py-2 text-right font-semibold">{overview.funnel7d.logins}</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2">Générations Workspace</td>
                <td className="py-2 text-right font-semibold">{overview.funnel7d.workspaceGenerations}</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2">Modules complétés</td>
                <td className="py-2 text-right font-semibold">{overview.funnel7d.moduleCompletions}</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2">Clics CTA Tarifs</td>
                <td className="py-2 text-right font-semibold">{overview.funnel7d.pricingClicks}</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2">Upgrades démarrés</td>
                <td className="py-2 text-right font-semibold">{overview.funnel7d.upgradesStarted}</td>
              </tr>
              <tr>
                <td className="py-2">Upgrades confirmés</td>
                <td className="py-2 text-right font-semibold">{overview.funnel7d.upgradesCompleted}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <Card hover={false}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Learning Lab (Workspace)
          </CardTitle>
        </CardHeader>
        {learningRows.length === 0 ? (
          <p className="text-gray-500">Aucune donnée de feedback Workspace pour le moment.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-2 text-left">Niche</th>
                  <th className="py-2 text-left">Canal</th>
                  <th className="py-2 text-right">Feedbacks</th>
                  <th className="py-2 text-right">Succès</th>
                  <th className="py-2 text-right">Ordre gagnant</th>
                </tr>
              </thead>
              <tbody>
                {learningRows.map((row) => (
                  <tr key={`${row.niche}-${row.channel}`} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2">{row.niche}</td>
                    <td className="py-2">{row.channel}</td>
                    <td className="py-2 text-right font-semibold">{row.total}</td>
                    <td className="py-2 text-right font-semibold">{row.successRate}%</td>
                    <td className="py-2 text-right">M{row.priorityOrder.join(' > M')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add Member */}
      <Card hover={false}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Ajouter un membre
          </CardTitle>
        </CardHeader>

        <div className="flex gap-4">
          <Input
            placeholder="Nom du membre"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleCreateMember} leftIcon={<UserPlus className="w-4 h-4" />}>
            Ajouter
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Un code d'accès sera généré automatiquement pour le nouveau membre.
        </p>
      </Card>

      {/* Members List */}
      <Card hover={false}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Liste des membres
          </CardTitle>
        </CardHeader>

        {isLoadingMembers ? (
          <div className="text-center py-8 text-gray-500">Chargement des membres...</div>
        ) : membersError ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-3">{membersError}</p>
            <Button variant="outline" size="sm" onClick={loadMembers}>
              Réessayer
            </Button>
          </div>
        ) : members.length > 0 ? (
          <div className="space-y-3">
            {members.map(member => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-secondary rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-bold',
                    member.active ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'
                  )}>
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold">{member.name}</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant={member.active ? 'success' : 'default'} size="sm">
                        {member.active ? 'Actif' : 'Inactif'}
                      </Badge>
                      <Badge variant={member.pin ? 'gold' : 'default'} size="sm">
                        {member.pin ? 'PIN défini' : 'Sans PIN'}
                      </Badge>
                      {member.code && (
                        <span className="text-gray-500">Code: {member.code}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResetPin(member.id)}
                    leftIcon={<Key className="w-4 h-4" />}
                  >
                    Reset PIN
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteMember(member.id)}
                    leftIcon={<Trash2 className="w-4 h-4" />}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">Aucun membre pour le moment</p>
          </div>
        )}
      </Card>
    </div>
  )
}
