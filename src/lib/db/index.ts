// Dynamic import based on database type
import Database from 'better-sqlite3';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schemaPostgres from './schema';
import * as schemaSQLite from './schema-sqlite';

const isSQLite = process.env.DATABASE_URL?.startsWith('file:');

let db: ReturnType<typeof drizzleSqlite> | ReturnType<typeof drizzleNeon>;
let schema: typeof schemaPostgres | typeof schemaSQLite;

if (isSQLite) {
  // Use SQLite for local development
  schema = schemaSQLite;
  const sqlite = new Database(process.env.DATABASE_URL!.replace('file:', ''));
  db = drizzleSqlite(sqlite, { schema });
} else {
  // Use NeonDB for production
  schema = schemaPostgres;
  const sql = neon(process.env.DATABASE_URL!);
  db = drizzleNeon(sql, { schema });
}

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
} = schema;