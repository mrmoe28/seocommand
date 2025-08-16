// Database configuration for Vercel deployment
import { drizzle as drizzleNeon, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schemaPostgres from './schema';

let dbInstance: NeonHttpDatabase<typeof schemaPostgres> | null = null;

export function getDb(): NeonHttpDatabase<typeof schemaPostgres> {
  // During build time, return a mock database
  if (process.env.BUILD_TIME === 'true') {
    console.warn('Build time detected, using mock database');
    return {
      select: () => ({ from: () => ({ where: () => ({ limit: () => Promise.resolve([]) }) }) }),
      insert: () => ({ values: () => ({ onConflictDoUpdate: () => Promise.resolve() }) }),
      update: () => ({ set: () => ({ where: () => Promise.resolve() }) }),
      delete: () => ({ where: () => Promise.resolve() }),
    } as unknown as NeonHttpDatabase<typeof schemaPostgres>;
  }

  if (!dbInstance) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    const sql = neon(process.env.DATABASE_URL);
    dbInstance = drizzleNeon(sql, { schema: schemaPostgres }) as NeonHttpDatabase<typeof schemaPostgres>;
  }
  return dbInstance;
}

// Export all schema items
export const { 
  users, 
  accounts, 
  sessions, 
  verificationTokens, 
  sites, 
  keywords, 
  reports, 
  googleTokens 
} = schemaPostgres;