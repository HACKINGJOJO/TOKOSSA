import { Card, Badge } from '@/components/ui'
import { Trophy, Medal, Crown, TrendingUp, Star } from 'lucide-react'
import { cn } from '@/utils/helpers'
import { useProgressStore } from '@/stores/progressStore'
import { useAuthStore } from '@/features/auth'

// Simulated leaderboard data (in production, this would come from a backend)
const LEADERBOARD = [
  { rank: 1, name: 'Aminata K.', xp: 2850, level: 'Légende', badge: '🏆', modules: 5 },
  { rank: 2, name: 'Koffi M.', xp: 2200, level: 'Maître', badge: '👑', modules: 5 },
  { rank: 3, name: 'Fatou D.', xp: 1800, level: 'Maître', badge: '👑', modules: 5 },
  { rank: 4, name: 'Serge A.', xp: 1500, level: 'Expert', badge: '💎', modules: 4 },
  { rank: 5, name: 'Blessing O.', xp: 1200, level: 'Expert', badge: '💎', modules: 4 },
  { rank: 6, name: 'Yao K.', xp: 950, level: 'Confirmé', badge: '🔥', modules: 3 },
  { rank: 7, name: 'Aïcha B.', xp: 800, level: 'Confirmé', badge: '🔥', modules: 3 },
  { rank: 8, name: 'Prince N.', xp: 650, level: 'Confirmé', badge: '🔥', modules: 3 },
  { rank: 9, name: 'Grace A.', xp: 450, level: 'Pratiquant', badge: '⚡', modules: 2 },
  { rank: 10, name: 'David K.', xp: 300, level: 'Pratiquant', badge: '⚡', modules: 2 },
]

export function Leaderboard() {
  const { totalXP, getLevel } = useProgressStore()
  const { user } = useAuthStore()
  const currentLevel = getLevel()

  // Find user's rank (simulated)
  const userRank = LEADERBOARD.findIndex(l => l.xp < totalXP) + 1 || LEADERBOARD.length + 1

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <Badge variant="gold" className="mb-2">Classement</Badge>
        <h1 className="text-3xl font-bold font-playfair">
          <span className="gradient-text">Leaderboard</span>
        </h1>
        <p className="text-gray-500 mt-2">
          Les meilleurs élèves de la communauté JOJO
        </p>
      </div>

      {/* Your Stats */}
      <Card variant="gold" hover={false}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white dark:bg-dark-card rounded-full flex items-center justify-center text-3xl">
              {currentLevel.icon}
            </div>
            <div>
              <h3 className="font-bold text-lg">{user?.name || 'Toi'}</h3>
              <p className="text-gray-600">{currentLevel.name}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">#{userRank}</div>
            <p className="text-sm text-gray-600">{totalXP} XP</p>
          </div>
        </div>
      </Card>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4">
        {/* 2nd Place */}
        <Card className="text-center pt-8">
          <div className="w-16 h-16 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
            <Medal className="w-8 h-8 text-gray-500" />
          </div>
          <Badge variant="default" className="mb-2">2ème</Badge>
          <h4 className="font-bold">{LEADERBOARD[1].name}</h4>
          <p className="text-gold-dark font-semibold">{LEADERBOARD[1].xp} XP</p>
          <p className="text-sm text-gray-500">{LEADERBOARD[1].level}</p>
        </Card>

        {/* 1st Place */}
        <Card className="text-center relative -mt-4 border-2 border-gold">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <Crown className="w-8 h-8 text-gold fill-gold" />
          </div>
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gold to-gold-light rounded-full flex items-center justify-center mb-3 mt-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <Badge variant="gold" className="mb-2">1er</Badge>
          <h4 className="font-bold text-lg">{LEADERBOARD[0].name}</h4>
          <p className="text-gold-dark font-bold text-xl">{LEADERBOARD[0].xp} XP</p>
          <p className="text-sm text-gray-500">{LEADERBOARD[0].level} {LEADERBOARD[0].badge}</p>
        </Card>

        {/* 3rd Place */}
        <Card className="text-center pt-8">
          <div className="w-16 h-16 mx-auto bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-3">
            <Medal className="w-8 h-8 text-amber-600" />
          </div>
          <Badge variant="default" className="mb-2">3ème</Badge>
          <h4 className="font-bold">{LEADERBOARD[2].name}</h4>
          <p className="text-gold-dark font-semibold">{LEADERBOARD[2].xp} XP</p>
          <p className="text-sm text-gray-500">{LEADERBOARD[2].level}</p>
        </Card>
      </div>

      {/* Full Ranking */}
      <Card hover={false}>
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-gold-dark" />
          Classement complet
        </h3>

        <div className="space-y-2">
          {LEADERBOARD.map((player, i) => (
            <div
              key={i}
              className={cn(
                'flex items-center gap-4 p-4 rounded-xl transition-all',
                i < 3 ? 'bg-gold-pale dark:bg-gold/10' : 'bg-gray-50 dark:bg-dark-secondary'
              )}
            >
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center font-bold',
                i === 0 && 'bg-gold text-white',
                i === 1 && 'bg-gray-300 text-gray-700',
                i === 2 && 'bg-amber-400 text-white',
                i > 2 && 'bg-gray-200 dark:bg-gray-700 text-gray-600'
              )}>
                {player.rank}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{player.name}</span>
                  <span className="text-lg">{player.badge}</span>
                </div>
                <p className="text-sm text-gray-500">{player.level} • {player.modules} modules</p>
              </div>

              <div className="text-right">
                <p className="font-bold text-gold-dark">{player.xp.toLocaleString()} XP</p>
                <div className="flex items-center justify-end gap-1">
                  {[...Array(Math.min(player.modules, 5))].map((_, j) => (
                    <Star key={j} className="w-3 h-3 fill-gold text-gold" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* How to climb */}
      <Card hover={false}>
        <h3 className="font-bold text-lg mb-4">Comment monter dans le classement?</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-dark-secondary rounded-xl text-center">
            <div className="text-2xl mb-2">📚</div>
            <h4 className="font-semibold">Complète les modules</h4>
            <p className="text-sm text-gray-500">+100 XP par module</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-dark-secondary rounded-xl text-center">
            <div className="text-2xl mb-2">✅</div>
            <h4 className="font-semibold">Réussis les quiz</h4>
            <p className="text-sm text-gray-500">+10 XP par bonne réponse</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-dark-secondary rounded-xl text-center">
            <div className="text-2xl mb-2">🛠️</div>
            <h4 className="font-semibold">Utilise le Workspace</h4>
            <p className="text-sm text-gray-500">+5 XP par génération</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
