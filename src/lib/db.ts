/**
 * Prisma Client Singleton with Graceful Degradation
 * ============================================================================
 * Provides a single PrismaClient instance throughout the application.
 * In development, this prevents multiple instances from being created
 * during hot reloading.
 *
 * If DATABASE_URL is not configured, exports `db = null` to allow
 * the application to run without database functionality.
 * ============================================================================
 */

import { PrismaClient } from '@prisma/client';

// Check if database is configured
const hasDatabaseUrl = !!process.env.DATABASE_URL;

// Declare global type for the prisma client to prevent TypeScript errors
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined | null;
}

/**
 * Creates or returns the existing PrismaClient instance.
 * In production, a new client is created.
 * In development, the client is cached on the global object to survive hot reloads.
 * Returns null if DATABASE_URL is not configured.
 */
export const prisma: PrismaClient | null = hasDatabaseUrl
  ? global.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
  : null;

// Cache the client in development to prevent connection exhaustion
if (process.env.NODE_ENV !== 'production' && hasDatabaseUrl) {
  global.prisma = prisma;
}

/**
 * Database client - null if DATABASE_URL is not configured
 */
export const db = prisma;

export default db;
