import { PrismaClient } from '@prisma/client'

// Check if we're in Edge runtime
const isEdgeRuntime = typeof EdgeRuntime !== 'undefined'

let prisma

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  // In development, reuse existing instance
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

// Only add process handlers in Node.js environment (not Edge)
if (!isEdgeRuntime && process.env.NODE_ENV !== 'production') {
  const shutdown = async () => {
    console.log('Disconnecting Prisma client...')
    await prisma.$disconnect()
    process.exit(0)
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

export { prisma }