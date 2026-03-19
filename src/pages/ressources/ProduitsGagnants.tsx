import { useState } from 'react'
import { Card, Button, Badge, Input } from '@/components/ui'
import { Search, Star, TrendingUp, Package, Filter } from 'lucide-react'

const CATEGORIES = ['Tous', 'Mode', 'Beauté', 'Accessoires', 'Maison', 'Tech', 'Bébé']

const PRODUCTS = [
  {
    id: 1,
    name: 'Robe Ankara Moderne',
    category: 'Mode',
    buyPrice: 5000,
    sellPrice: 15000,
    margin: 66,
    demand: 'Très haute',
    season: 'Toute l\'année',
    rating: 5,
    tips: 'Propose plusieurs tailles. Les robes mi-longues marchent le mieux.',
    image: '👗'
  },
  {
    id: 2,
    name: 'Huile de Ricin Bio',
    category: 'Beauté',
    buyPrice: 1500,
    sellPrice: 5000,
    margin: 70,
    demand: 'Très haute',
    season: 'Toute l\'année',
    rating: 5,
    tips: 'Vends en lot avec peigne + bonnet. Marge x3 possible.',
    image: '🧴'
  },
  {
    id: 3,
    name: 'Sac à Main Tendance',
    category: 'Accessoires',
    buyPrice: 3000,
    sellPrice: 8000,
    margin: 62,
    demand: 'Haute',
    season: 'Toute l\'année',
    rating: 4,
    tips: 'Les sacs medium taille sont les plus demandés.',
    image: '👜'
  },
  {
    id: 4,
    name: 'Écouteurs Bluetooth',
    category: 'Tech',
    buyPrice: 2000,
    sellPrice: 7000,
    margin: 71,
    demand: 'Haute',
    season: 'Toute l\'année',
    rating: 4,
    tips: 'Qualité sonore moyenne suffit. Focus sur le design.',
    image: '🎧'
  },
  {
    id: 5,
    name: 'Body Bébé Coton',
    category: 'Bébé',
    buyPrice: 1000,
    sellPrice: 3500,
    margin: 71,
    demand: 'Haute',
    season: 'Toute l\'année',
    rating: 5,
    tips: 'Vends en pack de 3. Les mamans adorent.',
    image: '👶'
  },
  {
    id: 6,
    name: 'Perruque Lace Front',
    category: 'Beauté',
    buyPrice: 15000,
    sellPrice: 45000,
    margin: 66,
    demand: 'Très haute',
    season: 'Toute l\'année',
    rating: 5,
    tips: 'Offre installation gratuite pour fidéliser.',
    image: '💇‍♀️'
  },
  {
    id: 7,
    name: 'Sneakers Unisexe',
    category: 'Mode',
    buyPrice: 8000,
    sellPrice: 20000,
    margin: 60,
    demand: 'Haute',
    season: 'Toute l\'année',
    rating: 4,
    tips: 'Tailles 40-44 sont les plus demandées.',
    image: '👟'
  },
  {
    id: 8,
    name: 'Housse Coussin Wax',
    category: 'Maison',
    buyPrice: 1500,
    sellPrice: 5000,
    margin: 70,
    demand: 'Moyenne',
    season: 'Toute l\'année',
    rating: 4,
    tips: 'Vends en lot de 2 ou 4 pièces.',
    image: '🛋️'
  },
  {
    id: 9,
    name: 'Montre Femme Élégante',
    category: 'Accessoires',
    buyPrice: 3000,
    sellPrice: 12000,
    margin: 75,
    demand: 'Haute',
    season: 'Fêtes',
    rating: 5,
    tips: 'Parfait pour cadeaux. Push avant fêtes.',
    image: '⌚'
  },
  {
    id: 10,
    name: 'Crème Éclaircissante',
    category: 'Beauté',
    buyPrice: 2000,
    sellPrice: 8000,
    margin: 75,
    demand: 'Très haute',
    season: 'Toute l\'année',
    rating: 4,
    tips: 'Bio/naturel = argument de vente fort.',
    image: '✨'
  },
  {
    id: 11,
    name: 'Ensemble Pagne Homme',
    category: 'Mode',
    buyPrice: 12000,
    sellPrice: 35000,
    margin: 65,
    demand: 'Haute',
    season: 'Fêtes/Cérémonies',
    rating: 5,
    tips: 'Forte demande mariages et baptêmes.',
    image: '👔'
  },
  {
    id: 12,
    name: 'Ventilateur USB',
    category: 'Tech',
    buyPrice: 1500,
    sellPrice: 5000,
    margin: 70,
    demand: 'Très haute',
    season: 'Saison chaude',
    rating: 4,
    tips: 'Mars-Juin = saison peak. Stock massif.',
    image: '🌀'
  },
]

export function ProduitsGagnants() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [sortBy, setSortBy] = useState<'margin' | 'demand' | 'rating'>('margin')

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'Tous' || p.category === selectedCategory
    return matchesSearch && matchesCategory
  }).sort((a, b) => {
    if (sortBy === 'margin') return b.margin - a.margin
    if (sortBy === 'rating') return b.rating - a.rating
    return 0
  })

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <Badge variant="gold" className="mb-2">Ressources</Badge>
        <h1 className="text-3xl font-bold font-playfair">
          <span className="gradient-text">Produits Gagnants</span>
        </h1>
        <p className="text-gray-500 mt-2">
          12 produits validés avec marges et conseils
        </p>
      </div>

      {/* Filters */}
      <Card hover={false}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <Button
                key={cat}
                size="sm"
                variant={selectedCategory === cat ? 'gold' : 'outline'}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <Filter className="w-4 h-4" /> Trier par:
          </span>
          <Button size="sm" variant={sortBy === 'margin' ? 'gold' : 'ghost'} onClick={() => setSortBy('margin')}>
            Marge
          </Button>
          <Button size="sm" variant={sortBy === 'demand' ? 'gold' : 'ghost'} onClick={() => setSortBy('demand')}>
            Demande
          </Button>
          <Button size="sm" variant={sortBy === 'rating' ? 'gold' : 'ghost'} onClick={() => setSortBy('rating')}>
            Note
          </Button>
        </div>
      </Card>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <Card key={product.id} className="relative overflow-hidden">
            {/* Badge Marge */}
            <div className="absolute top-4 right-4">
              <Badge variant="success" size="sm">+{product.margin}%</Badge>
            </div>

            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gray-100 dark:bg-dark-secondary rounded-xl flex items-center justify-center text-3xl">
                {product.image}
              </div>
              <div>
                <h3 className="font-bold text-lg">{product.name}</h3>
                <Badge variant="default" size="sm">{product.category}</Badge>
              </div>
            </div>

            {/* Prices */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-500">Prix achat</p>
                <p className="font-bold text-red-600">{product.buyPrice.toLocaleString()} F</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-500">Prix vente</p>
                <p className="font-bold text-green-600">{product.sellPrice.toLocaleString()} F</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm mb-4">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-gold-dark" />
                <span>{product.demand}</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(product.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gold-pale dark:bg-gold/10 p-3 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong className="text-gold-dark">Tip:</strong> {product.tips}
              </p>
            </div>

            {/* Season */}
            <div className="mt-4 text-center">
              <span className="text-xs text-gray-500">Saison: {product.season}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* No results */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucun produit trouvé</p>
        </div>
      )}

      {/* Tips Card */}
      <Card variant="gold" hover={false}>
        <h3 className="font-bold font-playfair text-xl mb-4">
          Comment utiliser cette liste ?
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-dark-card p-4 rounded-xl">
            <div className="text-2xl mb-2">1️⃣</div>
            <h4 className="font-semibold mb-1">Choisis 3-5 produits</h4>
            <p className="text-sm text-gray-500">Commence petit, teste le marché</p>
          </div>
          <div className="bg-white dark:bg-dark-card p-4 rounded-xl">
            <div className="text-2xl mb-2">2️⃣</div>
            <h4 className="font-semibold mb-1">Source localement d'abord</h4>
            <p className="text-sm text-gray-500">Valide avant d'importer</p>
          </div>
          <div className="bg-white dark:bg-dark-card p-4 rounded-xl">
            <div className="text-2xl mb-2">3️⃣</div>
            <h4 className="font-semibold mb-1">Scale ce qui marche</h4>
            <p className="text-sm text-gray-500">Double la mise sur les gagnants</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
