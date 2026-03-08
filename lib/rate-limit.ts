/**
 * Rate Limiter simple en memoire pour les routes API sensibles.
 * Utilise une Map IP -> timestamps pour limiter les requetes.
 *
 * En production, utiliser un systeme distribue (Redis, Upstash).
 * Ce rate limiter est adapte pour un deploiement serverless Vercel
 * ou les instances partagent la memoire pendant leur duree de vie.
 */

interface RateLimitEntry {
  timestamps: number[]
}

// Map globale partagee entre les requetes (dans le meme process)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Nettoyage periodique pour eviter les fuites memoire
const CLEANUP_INTERVAL = 60 * 1000 // 1 minute
let lastCleanup = Date.now()

function cleanup(windowMs: number) {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return

  lastCleanup = now
  const cutoff = now - windowMs

  const keys = Array.from(rateLimitStore.keys())
  for (const key of keys) {
    const entry = rateLimitStore.get(key)
    if (!entry) continue
    entry.timestamps = entry.timestamps.filter((t: number) => t > cutoff)
    if (entry.timestamps.length === 0) {
      rateLimitStore.delete(key)
    }
  }
}

/**
 * Options du rate limiter
 */
export interface RateLimitOptions {
  /** Nombre max de requetes dans la fenetre */
  max: number
  /** Taille de la fenetre en millisecondes */
  windowMs: number
}

/**
 * Verifie si une requete est autorisee par le rate limiter.
 *
 * @param identifier - Identifiant unique (IP, telephone, etc.)
 * @param routeKey - Cle de la route (pour separer les limites par route)
 * @param options - Options de rate limiting
 * @returns true si la requete est autorisee, false si rate-limited
 */
export function checkRateLimit(
  identifier: string,
  routeKey: string,
  options: RateLimitOptions
): boolean {
  const { max, windowMs } = options
  const key = `${routeKey}:${identifier}`
  const now = Date.now()

  // Nettoyage periodique
  cleanup(windowMs)

  const entry = rateLimitStore.get(key)

  if (!entry) {
    rateLimitStore.set(key, { timestamps: [now] })
    return true
  }

  // Filtrer les timestamps dans la fenetre
  entry.timestamps = entry.timestamps.filter((t) => t > now - windowMs)

  if (entry.timestamps.length >= max) {
    return false // Rate limited
  }

  entry.timestamps.push(now)
  return true
}

/**
 * Extraire l'IP d'une requete Next.js
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  return 'unknown'
}

// ============================================
// Presets de rate limiting par type de route
// ============================================

/** Rate limit pour les reviews : 3 requetes par minute */
export const RATE_LIMIT_REVIEWS: RateLimitOptions = {
  max: 3,
  windowMs: 60 * 1000,
}

/** Rate limit pour la validation de promos : 10 requetes par minute */
export const RATE_LIMIT_PROMOS: RateLimitOptions = {
  max: 10,
  windowMs: 60 * 1000,
}

/** Rate limit pour la fidelite : 5 requetes par minute */
export const RATE_LIMIT_LOYALTY: RateLimitOptions = {
  max: 5,
  windowMs: 60 * 1000,
}

/** Rate limit pour le login : 5 tentatives par minute */
export const RATE_LIMIT_LOGIN: RateLimitOptions = {
  max: 5,
  windowMs: 60 * 1000,
}

/** Rate limit pour les commandes : 5 par minute */
export const RATE_LIMIT_ORDERS: RateLimitOptions = {
  max: 5,
  windowMs: 60 * 1000,
}

/** Rate limit pour le webhook : 30 par minute */
export const RATE_LIMIT_WEBHOOK: RateLimitOptions = {
  max: 30,
  windowMs: 60 * 1000,
}
