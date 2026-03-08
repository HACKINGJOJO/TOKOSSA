/**
 * @jest-environment node
 */

/**
 * Tests unitaires pour les API routes de fidelite
 * - GET /api/loyalty : consulter les points
 * - POST /api/loyalty : crediter des points apres achat
 * - POST /api/loyalty/redeem : utiliser des points
 *
 * Prisma est entierement mocke (pas de base de donnees reelle).
 * Utilise l'environnement Node (pas jsdom) car les API Routes Next.js
 * dependent de Request/Response natifs Web.
 */

import mockPrisma from '@/__mocks__/prisma'

// Mock du module lib/db pour injecter notre mock Prisma
jest.mock('@/lib/db', () => ({
  __esModule: true,
  default: mockPrisma,
}))

// Import des handlers APRES le mock
import { GET, POST } from '@/app/api/loyalty/route'
import { POST as POST_REDEEM } from '@/app/api/loyalty/redeem/route'

// Reinitialiser tous les mocks avant chaque test
beforeEach(() => {
  jest.clearAllMocks()
})

// ============================================================
// Fonction utilitaire pour creer une Request simulee
// ============================================================
function createRequest(url: string, options?: RequestInit): Request {
  return new Request(url, options)
}

// ============================================================
// GET /api/loyalty — Consulter les points
// ============================================================
describe('GET /api/loyalty', () => {
  it('retourne 400 si le telephone est absent', async () => {
    const request = createRequest('http://localhost/api/loyalty')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Telephone requis')
  })

  it('retourne 0 points pour un utilisateur inexistant', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null)

    const request = createRequest('http://localhost/api/loyalty?phone=0197000000')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.points).toBe(0)
    expect(data.name).toBeNull()
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { phone: '0197000000' },
      select: { loyaltyPoints: true, name: true },
    })
  })

  it('retourne les points pour un utilisateur existant', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      loyaltyPoints: 1250,
      name: 'Koffi',
    })

    const request = createRequest('http://localhost/api/loyalty?phone=0197000000')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.points).toBe(1250)
    expect(data.name).toBe('Koffi')
  })

  it('retourne 500 en cas d\'erreur serveur', async () => {
    mockPrisma.user.findUnique.mockRejectedValue(new Error('DB connection failed'))

    const request = createRequest('http://localhost/api/loyalty?phone=0197000000')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Erreur serveur')
  })
})

// ============================================================
// POST /api/loyalty — Crediter des points apres achat
// ============================================================
describe('POST /api/loyalty', () => {
  it('retourne 400 si les donnees sont manquantes', async () => {
    const request = createRequest('http://localhost/api/loyalty', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Donnees manquantes')
  })

  it('credite 50 points pour un achat de 5000 FCFA (100 FCFA = 1 point)', async () => {
    mockPrisma.user.upsert.mockResolvedValue({
      id: 'user-123',
      phone: '0197000000',
      loyaltyPoints: 50,
    })
    mockPrisma.loyaltyPoint.create.mockResolvedValue({})
    mockPrisma.order.update.mockResolvedValue({})

    const request = createRequest('http://localhost/api/loyalty', {
      method: 'POST',
      body: JSON.stringify({
        phone: '0197000000',
        orderId: 'order-456',
        orderTotal: 5000,
      }),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.pointsEarned).toBe(50)
    expect(data.totalPoints).toBe(50)

    // Verification des appels Prisma
    expect(mockPrisma.user.upsert).toHaveBeenCalledWith({
      where: { phone: '0197000000' },
      update: { loyaltyPoints: { increment: 50 } },
      create: { phone: '0197000000', loyaltyPoints: 50 },
    })

    expect(mockPrisma.loyaltyPoint.create).toHaveBeenCalledWith({
      data: {
        userId: 'user-123',
        points: 50,
        type: 'EARN',
        reason: 'purchase',
        orderId: 'order-456',
      },
    })
  })

  it('credite 1 point pour un achat de 100 FCFA', async () => {
    mockPrisma.user.upsert.mockResolvedValue({
      id: 'user-123',
      phone: '0197000000',
      loyaltyPoints: 1,
    })
    mockPrisma.loyaltyPoint.create.mockResolvedValue({})

    const request = createRequest('http://localhost/api/loyalty', {
      method: 'POST',
      body: JSON.stringify({
        phone: '0197000000',
        orderTotal: 100,
      }),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(data.pointsEarned).toBe(1)
  })

  it('retourne 0 points pour un achat de moins de 100 FCFA', async () => {
    const request = createRequest('http://localhost/api/loyalty', {
      method: 'POST',
      body: JSON.stringify({
        phone: '0197000000',
        orderTotal: 50,
      }),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.pointsEarned).toBe(0)
    // Ne doit pas appeler upsert si 0 points
    expect(mockPrisma.user.upsert).not.toHaveBeenCalled()
  })

  it('fonctionne sans orderId (achat sans commande formelle)', async () => {
    mockPrisma.user.upsert.mockResolvedValue({
      id: 'user-123',
      phone: '0197000000',
      loyaltyPoints: 20,
    })
    mockPrisma.loyaltyPoint.create.mockResolvedValue({})

    const request = createRequest('http://localhost/api/loyalty', {
      method: 'POST',
      body: JSON.stringify({
        phone: '0197000000',
        orderTotal: 2000,
      }),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(data.pointsEarned).toBe(20)

    // Verifie que l'historique stocke null pour orderId
    expect(mockPrisma.loyaltyPoint.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          orderId: null,
        }),
      })
    )
  })
})

// ============================================================
// POST /api/loyalty/redeem — Utiliser des points
// ============================================================
describe('POST /api/loyalty/redeem', () => {
  it('retourne 400 si les donnees sont manquantes', async () => {
    const request = createRequest('http://localhost/api/loyalty/redeem', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST_REDEEM(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Donnees manquantes')
  })

  it('rejette si moins de 500 points demandes', async () => {
    const request = createRequest('http://localhost/api/loyalty/redeem', {
      method: 'POST',
      body: JSON.stringify({
        phone: '0197000000',
        pointsToRedeem: 300,
      }),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST_REDEEM(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain('Minimum 500 points')
  })

  it('retourne 404 si le client est introuvable', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null)

    const request = createRequest('http://localhost/api/loyalty/redeem', {
      method: 'POST',
      body: JSON.stringify({
        phone: '0197999999',
        pointsToRedeem: 500,
      }),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST_REDEEM(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Client introuvable')
  })

  it('rejette si solde insuffisant', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-123',
      loyaltyPoints: 300,
    })

    const request = createRequest('http://localhost/api/loyalty/redeem', {
      method: 'POST',
      body: JSON.stringify({
        phone: '0197000000',
        pointsToRedeem: 500,
      }),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST_REDEEM(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain('Solde insuffisant')
    expect(data.error).toContain('300')
  })

  it('utilise 500 points avec succes (1 point = 1 FCFA)', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-123',
      loyaltyPoints: 1200,
    })
    mockPrisma.user.update.mockResolvedValue({})
    mockPrisma.loyaltyPoint.create.mockResolvedValue({})

    const request = createRequest('http://localhost/api/loyalty/redeem', {
      method: 'POST',
      body: JSON.stringify({
        phone: '0197000000',
        pointsToRedeem: 500,
      }),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST_REDEEM(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.discount).toBe(500) // 1 point = 1 FCFA
    expect(data.pointsUsed).toBe(500)
    expect(data.remainingPoints).toBe(700) // 1200 - 500

    // Verifie le debit
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { phone: '0197000000' },
      data: { loyaltyPoints: { decrement: 500 } },
    })

    // Verifie l'historique
    expect(mockPrisma.loyaltyPoint.create).toHaveBeenCalledWith({
      data: {
        userId: 'user-123',
        points: -500,
        type: 'REDEEM',
        reason: 'redeem',
      },
    })
  })

  it('utilise exactement le minimum de 500 points', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-123',
      loyaltyPoints: 500,
    })
    mockPrisma.user.update.mockResolvedValue({})
    mockPrisma.loyaltyPoint.create.mockResolvedValue({})

    const request = createRequest('http://localhost/api/loyalty/redeem', {
      method: 'POST',
      body: JSON.stringify({
        phone: '0197000000',
        pointsToRedeem: 500,
      }),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST_REDEEM(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.remainingPoints).toBe(0)
  })
})
