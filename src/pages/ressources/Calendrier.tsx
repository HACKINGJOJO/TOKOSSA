import { useState } from 'react'
import { Card, CardHeader, CardTitle, Badge, Button } from '@/components/ui'
import { Calendar, Sparkles } from 'lucide-react'
import { cn } from '@/utils/helpers'

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
]

const EVENTS = [
  // Janvier
  { month: 0, day: 1, name: 'Nouvel An', emoji: '🎆', category: 'fete', importance: 'high', tips: 'Promos post-fêtes, déstockage' },
  { month: 0, day: 10, name: 'Fête du Vaudou', emoji: '🔮', category: 'benin', importance: 'medium', tips: 'Produits traditionnels, artisanat' },

  // Février
  { month: 1, day: 14, name: 'Saint-Valentin', emoji: '❤️', category: 'fete', importance: 'high', tips: 'Cadeaux couple, bijoux, parfums. Prépare 2 semaines avant!' },

  // Mars
  { month: 2, day: 8, name: 'Journée de la Femme', emoji: '👩', category: 'fete', importance: 'high', tips: 'Mode femme, beauté, bien-être. Grosses ventes!' },

  // Avril
  { month: 3, day: null, name: 'Pâques', emoji: '🐣', category: 'fete', importance: 'medium', tips: 'Vêtements enfants, chocolats' },

  // Mai
  { month: 4, day: null, name: 'Fête des Mères', emoji: '👩‍👧', category: 'fete', importance: 'high', tips: 'TOP période! Bijoux, sacs, parfums, vêtements' },
  { month: 4, day: 1, name: 'Fête du Travail', emoji: '💪', category: 'ferie', importance: 'low', tips: 'Jour férié, livraisons impossibles' },

  // Juin
  { month: 5, day: null, name: 'Fête des Pères', emoji: '👨‍👧', category: 'fete', importance: 'medium', tips: 'Montres, portefeuilles, vêtements homme' },
  { month: 5, day: 21, name: 'Début vacances scolaires', emoji: '🏖️', category: 'saison', importance: 'medium', tips: 'Valises, maillots, vacances' },

  // Juillet
  { month: 6, day: null, name: 'Saison des pluies', emoji: '🌧️', category: 'saison', importance: 'medium', tips: 'Parapluies, bottes, imperméables' },

  // Août
  { month: 7, day: 1, name: 'Fête Nationale Bénin', emoji: '🇧🇯', category: 'benin', importance: 'high', tips: 'Fierté nationale, produits locaux, pagne' },
  { month: 7, day: null, name: 'Tabaski/Eid', emoji: '🐑', category: 'religion', importance: 'high', tips: 'Boubous, ensembles, cadeaux' },

  // Septembre
  { month: 8, day: null, name: 'Rentrée Scolaire', emoji: '📚', category: 'saison', importance: 'high', tips: 'Uniformes, sacs, fournitures' },

  // Octobre
  { month: 9, day: 31, name: 'Halloween', emoji: '🎃', category: 'fete', importance: 'low', tips: 'Peu célébré, mais déguisements enfants' },

  // Novembre
  { month: 10, day: 25, name: 'Black Friday', emoji: '🛒', category: 'promo', importance: 'high', tips: 'MEGA promos! Prépare ton stock 1 mois avant' },
  { month: 10, day: 28, name: 'Cyber Monday', emoji: '💻', category: 'promo', importance: 'medium', tips: 'Suite Black Friday, focus tech' },

  // Décembre
  { month: 11, day: 25, name: 'Noël', emoji: '🎄', category: 'fete', importance: 'high', tips: 'Plus grosse période! Cadeaux tous segments' },
  { month: 11, day: 31, name: 'Réveillon', emoji: '🥂', category: 'fete', importance: 'high', tips: 'Tenues de fête, maquillage, accessoires' },
  { month: 11, day: null, name: 'Vacances Noël', emoji: '🎁', category: 'saison', importance: 'medium', tips: 'Jouets enfants, vêtements neufs' },
]

const CATEGORIES = {
  fete: { label: 'Fêtes', color: 'bg-pink-500' },
  benin: { label: 'Bénin', color: 'bg-green-500' },
  religion: { label: 'Religion', color: 'bg-purple-500' },
  saison: { label: 'Saison', color: 'bg-blue-500' },
  promo: { label: 'Promo', color: 'bg-orange-500' },
  ferie: { label: 'Férié', color: 'bg-gray-500' },
}

export function Calendrier() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const monthEvents = EVENTS.filter(e => {
    const matchesMonth = e.month === selectedMonth
    const matchesCategory = !selectedCategory || e.category === selectedCategory
    return matchesMonth && matchesCategory
  })

  const upcomingEvents = EVENTS.filter(e => {
    const currentMonth = new Date().getMonth()
    return e.month >= currentMonth && e.month <= currentMonth + 2
  }).slice(0, 5)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <Badge variant="gold" className="mb-2">Ressources</Badge>
        <h1 className="text-3xl font-bold font-playfair">
          <span className="gradient-text">Calendrier E-commerce</span>
        </h1>
        <p className="text-gray-500 mt-2">
          Toutes les dates clés pour planifier tes campagnes
        </p>
      </div>

      {/* Upcoming Events */}
      <Card variant="gold" hover={false}>
        <h3 className="font-bold font-playfair text-lg mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Prochains événements
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {upcomingEvents.map((event, i) => (
            <div
              key={i}
              className="flex-shrink-0 bg-white dark:bg-dark-card p-4 rounded-xl min-w-[200px]"
            >
              <div className="text-3xl mb-2">{event.emoji}</div>
              <h4 className="font-bold">{event.name}</h4>
              <p className="text-sm text-gray-500">
                {MONTHS[event.month]} {event.day ? event.day : ''}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Month Selector */}
      <Card hover={false}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gold-dark" />
            Sélectionne un mois
          </h3>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2 mb-6">
          {MONTHS.map((month, i) => (
            <Button
              key={i}
              size="sm"
              variant={selectedMonth === i ? 'gold' : 'outline'}
              onClick={() => setSelectedMonth(i)}
              className="text-xs"
            >
              {month.slice(0, 3)}
            </Button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant={selectedCategory === null ? 'gold' : 'ghost'}
            onClick={() => setSelectedCategory(null)}
          >
            Tous
          </Button>
          {Object.entries(CATEGORIES).map(([key, { label }]) => (
            <Button
              key={key}
              size="sm"
              variant={selectedCategory === key ? 'gold' : 'ghost'}
              onClick={() => setSelectedCategory(key)}
            >
              {label}
            </Button>
          ))}
        </div>
      </Card>

      {/* Month Events */}
      <Card hover={false}>
        <CardHeader>
          <CardTitle>
            📅 {MONTHS[selectedMonth]} - {monthEvents.length} événement(s)
          </CardTitle>
        </CardHeader>

        {monthEvents.length > 0 ? (
          <div className="space-y-4">
            {monthEvents.map((event, i) => (
              <div
                key={i}
                className={cn(
                  'p-5 rounded-xl border-l-4',
                  event.importance === 'high' && 'border-l-gold bg-gold-pale dark:bg-gold/10',
                  event.importance === 'medium' && 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20',
                  event.importance === 'low' && 'border-l-gray-400 bg-gray-50 dark:bg-dark-secondary'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{event.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-lg">{event.name}</h4>
                        <div className={cn(
                          'w-2 h-2 rounded-full',
                          CATEGORIES[event.category as keyof typeof CATEGORIES].color
                        )} />
                      </div>
                      <p className="text-sm text-gray-500">
                        {event.day ? `${event.day} ${MONTHS[event.month]}` : MONTHS[event.month]}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={event.importance === 'high' ? 'gold' : 'default'}
                    size="sm"
                  >
                    {event.importance === 'high' ? 'Important' : event.importance === 'medium' ? 'Moyen' : 'Faible'}
                  </Badge>
                </div>

                <div className="mt-4 bg-white dark:bg-dark-card p-3 rounded-lg">
                  <p className="text-sm">
                    <strong className="text-gold-dark">💡 Tips:</strong> {event.tips}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun événement ce mois-ci</p>
          </div>
        )}
      </Card>

      {/* Annual Strategy */}
      <Card hover={false}>
        <CardHeader>
          <CardTitle>📈 Stratégie Annuelle</CardTitle>
        </CardHeader>

        <div className="grid md:grid-cols-4 gap-4">
          <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
            <div className="text-3xl mb-2">❄️</div>
            <h4 className="font-bold">Jan-Mar</h4>
            <p className="text-sm text-gray-500">Déstockage + St-Valentin + 8 Mars</p>
          </div>
          <div className="p-5 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
            <div className="text-3xl mb-2">🌸</div>
            <h4 className="font-bold">Avr-Juin</h4>
            <p className="text-sm text-gray-500">Fête des Mères + Pères</p>
          </div>
          <div className="p-5 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-center">
            <div className="text-3xl mb-2">☀️</div>
            <h4 className="font-bold">Juil-Sept</h4>
            <p className="text-sm text-gray-500">Rentrée scolaire + Tabaski</p>
          </div>
          <div className="p-5 bg-red-50 dark:bg-red-900/20 rounded-xl text-center">
            <div className="text-3xl mb-2">🎄</div>
            <h4 className="font-bold">Oct-Déc</h4>
            <p className="text-sm text-gray-500">Black Friday + Noël = PEAK</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
