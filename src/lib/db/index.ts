// Database configuration for Netlify deployment
// Uses NeonDB (PostgreSQL) exclusively for better compatibility
import { drizzle as drizzleNeon, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schemaPostgres from './schema';

// For Netlify deployment, we use NeonDB exclusively
// SQLite is not supported in static exports
const sql = neon(process.env.DATABASE_URL!);
const db = drizzleNeon(sql, { schema: schemaPostgres }) as NeonHttpDatabase<typeof schemaPostgres>;

export { db };
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