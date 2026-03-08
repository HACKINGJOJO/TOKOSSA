import { Suspense } from 'react'
import prisma from '@/lib/db'
import { notFound } from 'next/navigation'
import ProductDetail from '@/components/shop/ProductDetail'
import AdPromoBanner from '@/components/shop/AdPromoBanner'
import type { Metadata } from 'next'

/**
 * Page detail produit — Server Component.
 * Fetch les donnees Prisma cote serveur et les passe
 * au Client Component ProductDetail pour l'interactivite.
 */

interface PageProps {
  params: Promise<{ slug: string }>
}

// Metadata dynamique pour le SEO et Open Graph
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, description: true, images: true },
  })

  if (!product) {
    return { title: 'Produit non trouve | TOKOSSA' }
  }

  return {
    title: `${product.name} | TOKOSSA`,
    description: product.description?.slice(0, 160),
    openGraph: {
      images: product.images[0] ? [product.images[0]] : [],
    },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params

  // Recuperer le produit par son slug
  const product = await prisma.product.findUnique({
    where: { slug },
  })

  if (!product) notFound()

  // Recuperer les produits recommandes (cross-sell)
  // 1. Chercher d'abord dans la meme categorie
  const sameCategoryProducts = await prisma.product.findMany({
    where: {
      category: product.category,
      id: { not: product.id },
      isActive: true,
    },
    take: 4,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      oldPrice: true,
      images: true,
      stock: true,
      category: true,
    },
  })

  // 2. Si pas assez dans la meme categorie, completer avec d'autres categories
  let relatedProducts = sameCategoryProducts
  if (sameCategoryProducts.length < 4) {
    const remainingCount = 4 - sameCategoryProducts.length
    const existingIds = [product.id, ...sameCategoryProducts.map((p) => p.id)]
    const otherProducts = await prisma.product.findMany({
      where: {
        id: { notIn: existingIds },
        isActive: true,
      },
      take: remainingCount,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        oldPrice: true,
        images: true,
        stock: true,
        category: true,
      },
    })
    relatedProducts = [...sameCategoryProducts, ...otherProducts]
  }

  // Recuperer la moyenne et le nombre d'avis pour le JSON-LD
  const reviewStats = await prisma.review.aggregate({
    where: { productId: product.id },
    _avg: { rating: true },
    _count: { rating: true },
  })

  // Serialiser le produit pour le Client Component
  // (Prisma renvoie des objets avec des types Date qu'il faut convertir)
  const serializedProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    oldPrice: product.oldPrice,
    images: product.images,
    stock: product.stock,
    category: product.category,
    isFeatured: product.isFeatured,
  }

  // Construction du JSON-LD Product (donnees structurees SEO)
  const productUrl = `https://tokossa.bj/produits/${product.slug}`

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'TOKOSSA',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'XOF',
      availability: product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: productUrl,
      seller: {
        '@type': 'Organization',
        name: 'TOKOSSA',
      },
    },
  }

  // Ajouter aggregateRating si des avis existent
  if (reviewStats._count.rating > 0 && reviewStats._avg.rating !== null) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Math.round(reviewStats._avg.rating * 10) / 10,
      reviewCount: reviewStats._count.rating,
      bestRating: 5,
      worstRating: 1,
    }
  }

  return (
    <>
      {/* JSON-LD — Donnees structurees Product pour le SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Banniere promo Meta Ads (UTM tracking) */}
      <Suspense fallback={null}>
        <AdPromoBanner />
      </Suspense>

      <ProductDetail
        product={serializedProduct}
        relatedProducts={relatedProducts}
      />
    </>
  )
}
