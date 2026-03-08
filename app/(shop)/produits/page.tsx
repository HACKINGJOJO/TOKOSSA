import { Suspense } from 'react'
import prisma from '@/lib/db'
import ProductGrid from '@/components/shop/ProductGrid'
import SortSelect from '@/components/shop/SortSelect'
import PriceFilter from '@/components/shop/PriceFilter'
import FilterChip from '@/components/shop/FilterChip'
import type { Prisma } from '@prisma/client'
import type { Metadata } from 'next'

const categories = [
  { name: 'Tous', slug: 'all' },
  { name: 'Electronique', slug: 'electronique' },
  { name: 'Mode', slug: 'mode' },
  { name: 'Beaute', slug: 'beaute' },
  { name: 'Sport', slug: 'sport' },
  { name: 'Maison', slug: 'maison' },
]

interface PageProps {
  searchParams: Promise<{
    category?: string
    sort?: string
    search?: string
    minPrice?: string
    maxPrice?: string
    promo?: string
    inStock?: string
  }>
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const categoryFilter = params.category || 'all'
  const sortBy = params.sort || 'featured'
  const searchQuery = params.search || ''

  // Lecture des nouveaux filtres
  const minPrice = params.minPrice ? parseInt(params.minPrice, 10) : null
  const maxPrice = params.maxPrice ? parseInt(params.maxPrice, 10) : null
  const promoFilter = params.promo === 'true'
  const inStockFilter = params.inStock === 'true'

  // Construction du filtre Prisma
  const where: Prisma.ProductWhereInput = { isActive: true }

  if (categoryFilter !== 'all') {
    where.category = { equals: categoryFilter, mode: 'insensitive' }
  }

  // Support de la recherche textuelle
  if (searchQuery) {
    where.OR = [
      { name: { contains: searchQuery, mode: 'insensitive' } },
      { description: { contains: searchQuery, mode: 'insensitive' } },
      { category: { contains: searchQuery, mode: 'insensitive' } },
    ]
  }

  // Filtre par fourchette de prix (min / max en FCFA)
  if (minPrice !== null || maxPrice !== null) {
    where.price = {}
    if (minPrice !== null && !isNaN(minPrice)) {
      where.price.gte = minPrice
    }
    if (maxPrice !== null && !isNaN(maxPrice)) {
      where.price.lte = maxPrice
    }
  }

  // Filtre "En promotion" : produits avec un ancien prix (oldPrice non null)
  if (promoFilter) {
    where.oldPrice = { not: null }
  }

  // Filtre "En stock" : produits avec stock > 0
  if (inStockFilter) {
    where.stock = { gt: 0 }
  }

  // Construction du tri
  const orderBy: Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[] =
    sortBy === 'price-asc'
      ? { price: 'asc' }
      : sortBy === 'price-desc'
        ? { price: 'desc' }
        : [{ isFeatured: 'desc' }, { createdAt: 'desc' }]

  // Requete Prisma avec filtres serveur
  const products = await prisma.product.findMany({
    where,
    orderBy,
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      oldPrice: true,
      images: true,
      stock: true,
      category: true,
      isFeatured: true,
    },
  })

  /**
   * Construction des liens de categories qui preservent les autres filtres actifs.
   * Sans cela, cliquer sur une categorie reinitialiserait les filtres prix/promo/stock.
   */
  function buildCategoryHref(slug: string): string {
    const p = new URLSearchParams()
    if (slug !== 'all') p.set('category', slug)
    if (params.sort) p.set('sort', params.sort)
    if (params.search) p.set('search', params.search)
    if (params.minPrice) p.set('minPrice', params.minPrice)
    if (params.maxPrice) p.set('maxPrice', params.maxPrice)
    if (params.promo) p.set('promo', params.promo)
    if (params.inStock) p.set('inStock', params.inStock)
    const qs = p.toString()
    return `/produits${qs ? `?${qs}` : ''}`
  }

  // Nombre de filtres actifs (hors categorie et tri)
  const activeFiltersCount = [
    minPrice !== null || maxPrice !== null,
    promoFilter,
    inStockFilter,
  ].filter(Boolean).length

  // JSON-LD BreadcrumbList pour le SEO
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: 'https://tokossa.bj',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: categoryFilter !== 'all'
          ? categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)
          : 'Produits',
        item: categoryFilter !== 'all'
          ? `https://tokossa.bj/produits?category=${categoryFilter}`
          : 'https://tokossa.bj/produits',
      },
    ],
  }

  return (
    <>
    {/* JSON-LD — Fil d'ariane pour le SEO */}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
    />

    <div className="min-h-screen bg-warm-50">
      {/* Header avec degrade indigo */}
      <div className="bg-gradient-to-r from-secondary-500 to-secondary-500/90 text-white">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {searchQuery ? `Resultats pour "${searchQuery}"` : 'Nos Produits'}
          </h1>
          <p className="text-white/70 mt-1">
            {products.length} produit{products.length > 1 ? 's' : ''} disponible
            {products.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Filtres */}
        <div className="space-y-3 mb-6">
          {/* Ligne 1 : Categories + Tri */}
          <div className="flex flex-wrap gap-4">
            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              {categories.map((category) => (
                <a
                  key={category.slug}
                  href={buildCategoryHref(category.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    categoryFilter === category.slug ||
                    (category.slug === 'all' && !params.category)
                      ? 'bg-primary-500 text-white shadow-md shadow-primary-500/25'
                      : 'bg-white text-warm-700 border border-warm-200 shadow-sm hover:border-primary-300'
                  }`}
                >
                  {category.name}
                </a>
              ))}
            </div>

            {/* Tri -- composant client isole */}
            <div className="ml-auto">
              <Suspense fallback={
                <div className="px-4 py-2 bg-white border border-warm-200 rounded-xl text-sm text-warm-400">
                  Chargement...
                </div>
              }>
                <SortSelect currentSort={sortBy} />
              </Suspense>
            </div>
          </div>

          {/* Ligne 2 : Filtres avances (prix, promo, stock) */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 items-center">
            {/* Indicateur de filtres actifs */}
            {activeFiltersCount > 0 && (
              <span className="px-2 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold whitespace-nowrap">
                {activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''}
              </span>
            )}

            {/* Filtre "En promo" */}
            <Suspense fallback={null}>
              <FilterChip
                label="En promo"
                paramKey="promo"
                isActive={promoFilter}
              />
            </Suspense>

            {/* Filtre "En stock" */}
            <Suspense fallback={null}>
              <FilterChip
                label="En stock"
                paramKey="inStock"
                isActive={inStockFilter}
              />
            </Suspense>

            {/* Separateur visuel */}
            <div className="w-px h-6 bg-warm-200 flex-shrink-0" />

            {/* Filtre par fourchette de prix */}
            <Suspense fallback={null}>
              <PriceFilter
                currentMin={minPrice}
                currentMax={maxPrice}
              />
            </Suspense>
          </div>
        </div>

        {/* Grille produits */}
        <Suspense
          fallback={
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-warm-200 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          }
        >
          <ProductGrid
            products={products}
            emptyMessage={
              searchQuery
                ? `Aucun produit trouve pour "${searchQuery}"`
                : 'Aucun produit dans cette categorie'
            }
          />
        </Suspense>
      </div>
    </div>
    </>
  )
}

/**
 * Metadata dynamique basee sur les parametres de recherche et la categorie.
 * Ameliore le SEO pour les pages filtrees par categorie ou recherche.
 */
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams
  const category = params.category
  const search = params.search

  let title = 'Nos Produits | TOKOSSA'
  let description = 'Decouvrez tous nos produits disponibles. Livraison rapide a Cotonou et environs.'

  if (category && category !== 'all') {
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1)
    title = `${categoryName} | TOKOSSA`
    description = `Decouvrez nos produits ${categoryName} sur TOKOSSA. Livraison rapide a Cotonou.`
  }

  if (search) {
    title = `Recherche "${search}" | TOKOSSA`
    description = `Resultats de recherche pour "${search}" sur TOKOSSA.`
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: 'https://tokossa.bj/produits',
      siteName: 'TOKOSSA',
    },
  }
}
