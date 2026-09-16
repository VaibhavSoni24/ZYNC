import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma =
  globalThis.prismaGlobal ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

// Test connectivity on boot without throwing hard unhandled crash
prisma.$connect()
  .then(() => {
    logger.info('PostgreSQL connected successfully via Prisma');
  })
  .catch((err) => {
    logger.warn('Prisma database connection warning (is DATABASE_URL active?):', err.message);
  });
