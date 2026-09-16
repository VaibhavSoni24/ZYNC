import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

declare global {
  // eslint-disable-next-line no-var
  var prismaBase: PrismaClient | undefined;
}

const baseClient =
  globalThis.prismaBase ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaBase = baseClient;
}

// Auto-retry extension for Neon serverless idle socket closure
export const prisma = baseClient.$extends({
  query: {
    $allModels: {
      async $allOperations({ operation, model, args, query }) {
        try {
          return await query(args);
        } catch (err: any) {
          const errMsg = err?.message || '';
          if (
            errMsg.includes('Closed') ||
            errMsg.includes('kind: Closed') ||
            errMsg.includes('Connection pool') ||
            errMsg.includes('connection closed') ||
            errMsg.includes('Engine not ready')
          ) {
            logger.warn(`Retrying Prisma ${model}.${operation} after connection reset`);
            return await query(args);
          }
          throw err;
        }
      }
    }
  }
}) as unknown as PrismaClient;

// Connect on boot
baseClient.$connect()
  .then(() => {
    logger.info('PostgreSQL connected successfully via Prisma');
  })
  .catch((err: any) => {
    logger.warn('Prisma database connection warning:', err.message);
  });

