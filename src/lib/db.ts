/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
let PrismaClient: any
let prisma: any

try {
  // Try to import PrismaClient
  const PrismaModule = require('@prisma/client')
  PrismaClient = PrismaModule.PrismaClient
  
  const globalForPrisma = globalThis as unknown as {
    prisma: any | undefined
  }

  prisma = globalForPrisma.prisma ?? new PrismaClient()

  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
} catch (error) {
  console.warn('Prisma client not available:', (error as Error).message)
  // Create a mock prisma object that throws meaningful errors
  prisma = {
    entry: {
      findMany: () => { throw new Error('Database not available - Prisma client not initialized') },
      aggregate: () => { throw new Error('Database not available - Prisma client not initialized') },
      findUnique: () => { throw new Error('Database not available - Prisma client not initialized') },
      create: () => { throw new Error('Database not available - Prisma client not initialized') },
      update: () => { throw new Error('Database not available - Prisma client not initialized') },
      delete: () => { throw new Error('Database not available - Prisma client not initialized') },
    },
    user: {
      findUnique: () => { throw new Error('Database not available - Prisma client not initialized') },
      create: () => { throw new Error('Database not available - Prisma client not initialized') },
      update: () => { throw new Error('Database not available - Prisma client not initialized') },
    },
    $disconnect: () => Promise.resolve(),
  }
}

export { prisma }