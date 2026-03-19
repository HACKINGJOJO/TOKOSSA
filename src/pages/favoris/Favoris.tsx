import { useState, useEffect } from 'react'
import { Card, Badge, Button } from '@/components/ui'
import { Star, Trash2, Heart } from 'lucide-react'
import { storageService } from '@/services/storage'
import { FavoriteItem } from '@/types'

export function Favoris() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [filter, setFilter] = useState<'all' | 'prompt' | 'trick' | 'tool'>('all')

  useEffect(() => {
    const saved = storageService.get<FavoriteItem[]>('favorites', [])
    setFavorites(saved)
  }, [])

  const removeFavorite = (id: string) => {
    const updated = favorites.filter(f => f.id !== id)
    setFavorites(updated)
    storageService.set('favorites', updated)
  }

  const filteredFavorites = favorites.filter(f =>
    filter === 'all' || f.type === filter
  )

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <Badge variant="gold" className="mb-2">Personnel</Badge>
        <h1 className="text-3xl font-bold font-playfair">
          <span className="gradient-text">Mes Favoris</span>
        </h1>
        <p className="text-gray-500 mt-2">
          {favorites.length} élément(s) sauvegardé(s)
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <Button
          size="sm"
          variant={filter === 'all' ? 'gold' : 'outline'}
          onClick={() => setFilter('all')}
        >
          Tous ({favorites.length})
        </Button>
        <Button
          size="sm"
          variant={filter === 'prompt' ? 'gold' : 'outline'}
          onClick={() => setFilter('prompt')}
        >
          Prompts ({favorites.filter(f => f.type === 'prompt').length})
        </Button>
        <Button
          size="sm"
          variant={filter === 'trick' ? 'gold' : 'outline'}
          onClick={() => setFilter('trick')}
        >
          Tricks ({favorites.filter(f => f.type === 'trick').length})
        </Button>
        <Button
          size="sm"
          variant={filter === 'tool' ? 'gold' : 'outline'}
          onClick={() => setFilter('tool')}
        >
          Outils ({favorites.filter(f => f.type === 'tool').length})
        </Button>
      </div>

      {/* Favorites List */}
      {filteredFavorites.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredFavorites.map(fav => (
            <Card key={fav.id} className="relative">
              <button
                onClick={() => removeFavorite(fav.id)}
                className="absolute top-4 right-4 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>

              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-gold-pale dark:bg-gold/20 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-gold-dark" />
                </div>
                <div>
                  <Badge variant="default" size="sm" className="mb-1">
                    {fav.type === 'prompt' ? 'Prompt' : fav.type === 'trick' ? 'Trick' : 'Outil'}
                  </Badge>
                  <h3 className="font-bold">{fav.title}</h3>
                </div>
              </div>

              {fav.content && (
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3">
                  {fav.content}
                </p>
              )}

              <p className="text-xs text-gray-400">
                Ajouté le {formatDate(fav.addedAt)}
              </p>
            </Card>
          ))}
        </div>
      ) : (
        <Card hover={false} className="text-center py-16">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 mb-2">
            {filter === 'all' ? 'Aucun favori' : `Aucun ${filter} en favori`}
          </h3>
          <p className="text-gray-400">
            Ajoute des éléments en favori depuis les différentes pages
          </p>
        </Card>
      )}

      {/* Tips */}
      <Card variant="gold" hover={false}>
        <h3 className="font-bold font-playfair text-lg mb-2">
          Comment ajouter des favoris?
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Clique sur l'icône étoile ou favori sur les prompts, tricks et outils
          que tu veux sauvegarder pour y accéder rapidement plus tard.
        </p>
      </Card>
    </div>
  )
}
