// Dynamic import based on database type
import Database from 'better-sqlite3';
import { drizzle as drizzleSqlite, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzleNeon, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schemaPostgres from './schema';
import * as schemaSQLite from './schema-sqlite';

const isSQLite = process.env.DATABASE_URL?.startsWith('file:');

type DatabaseType = BetterSQLite3Database<typeof schemaSQLite> | NeonHttpDatabase<typeof schemaPostgres>;

let db: DatabaseType;
let schema: typeof schemaPostgres | typeof schemaSQLite;

if (isSQLite) {
  // Use SQLite for local development
  schema = schemaSQLite;
  const sqlite = new Database(process.env.DATABASE_URL!.replace('file:', ''));
  db = drizzleSqlite(sqlite, { schema }) as BetterSQLite3Database<typeof schemaSQLite>;
} else {
  // Use NeonDB for production
  schema = schemaPostgres;
  const sql = neon(process.env.DATABASE_URL!);
  db = drizzleNeon(sql, { schema }) as NeonHttpDatabase<typeof schemaPostgres>;
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