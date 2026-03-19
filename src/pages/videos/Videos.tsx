import { Card, Badge, Button } from '@/components/ui'
import { Play } from 'lucide-react'

const VIDEOS = [
  {
    id: 1,
    title: 'Comment démarrer son e-commerce au Bénin',
    description: 'Les bases pour lancer ta boutique en ligne depuis zéro',
    duration: '15:32',
    category: 'Débutant',
    thumbnail: '🎬',
    url: '#'
  },
  {
    id: 2,
    title: 'Trouver des fournisseurs fiables',
    description: 'Guide complet pour sourcer tes produits localement et en Chine',
    duration: '22:45',
    category: 'Sourcing',
    thumbnail: '📦',
    url: '#'
  },
  {
    id: 3,
    title: 'Créer des visuels qui vendent',
    description: 'Techniques de photo et design pour des posts accrocheurs',
    duration: '18:20',
    category: 'Marketing',
    thumbnail: '📸',
    url: '#'
  },
  {
    id: 4,
    title: 'Maîtriser Facebook Ads',
    description: 'De la création à l\'optimisation de tes campagnes pub',
    duration: '35:10',
    category: 'Publicité',
    thumbnail: '🎯',
    url: '#'
  },
  {
    id: 5,
    title: 'Scripts WhatsApp qui convertissent',
    description: 'Messages type pour closer tes ventes',
    duration: '12:15',
    category: 'Vente',
    thumbnail: '💬',
    url: '#'
  },
  {
    id: 6,
    title: 'Gérer son SAV comme un pro',
    description: 'Transformer les problèmes en opportunités',
    duration: '14:50',
    category: 'SAV',
    thumbnail: '🛠️',
    url: '#'
  },
]

export function Videos() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <Badge variant="gold" className="mb-2">Formation Vidéo</Badge>
        <h1 className="text-3xl font-bold font-playfair">
          <span className="gradient-text">Vidéos de Formation</span>
        </h1>
        <p className="text-gray-500 mt-2">
          {VIDEOS.length} vidéos pour maîtriser le e-commerce
        </p>
      </div>

      {/* Coming Soon Banner */}
      <Card variant="gold" hover={false}>
        <div className="flex items-center gap-4">
          <div className="text-4xl">🎥</div>
          <div>
            <h3 className="font-bold text-lg">Vidéos en cours de production</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Notre équipe prépare des vidéos de qualité. En attendant, tu peux consulter
              les modules écrits qui sont très complets!
            </p>
          </div>
        </div>
      </Card>

      {/* Videos Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {VIDEOS.map(video => (
          <Card key={video.id} className="overflow-hidden">
            {/* Thumbnail */}
            <div className="relative bg-gray-100 dark:bg-dark-secondary h-40 flex items-center justify-center mb-4 rounded-lg">
              <div className="text-6xl">{video.thumbnail}</div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity cursor-pointer rounded-lg">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <Play className="w-8 h-8 text-gold-dark ml-1" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </div>
            </div>

            {/* Info */}
            <Badge variant="default" size="sm" className="mb-2">{video.category}</Badge>
            <h3 className="font-bold mb-2">{video.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{video.description}</p>

            <Button variant="outline" className="w-full" disabled>
              <Play className="w-4 h-4 mr-2" />
              Bientôt disponible
            </Button>
          </Card>
        ))}
      </div>

      {/* Alternative */}
      <Card hover={false}>
        <h3 className="font-bold text-lg mb-4">En attendant les vidéos...</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-dark-secondary rounded-xl text-center">
            <div className="text-2xl mb-2">📚</div>
            <h4 className="font-semibold">Modules écrits</h4>
            <p className="text-sm text-gray-500">Très détaillés et complets</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-dark-secondary rounded-xl text-center">
            <div className="text-2xl mb-2">💡</div>
            <h4 className="font-semibold">Tricks & Astuces</h4>
            <p className="text-sm text-gray-500">Tips rapides à appliquer</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-dark-secondary rounded-xl text-center">
            <div className="text-2xl mb-2">🎯</div>
            <h4 className="font-semibold">Cas Pratiques</h4>
            <p className="text-sm text-gray-500">Success stories détaillées</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
