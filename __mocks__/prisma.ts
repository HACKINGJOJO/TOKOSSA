/**
 * Mock Prisma Client pour les tests unitaires.
 * Chaque methode est un jest.fn() pour pouvoir controler les retours.
 */

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    upsert: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  },
  loyaltyPoint: {
    create: jest.fn(),
  },
  order: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  product: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
}

export default mockPrisma
