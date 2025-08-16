// Dynamic import based on database type
const isSQLite = process.env.DATABASE_URL?.startsWith('file:');

let db: any;
let schema: any;

if (isSQLite) {
  // Use SQLite for local development
  const Database = require('better-sqlite3');
  const { drizzle } = require('drizzle-orm/better-sqlite3');
  schema = require('./schema-sqlite');
  
  const sqlite = new Database(process.env.DATABASE_URL!.replace('file:', ''));
  db = drizzle(sqlite, { schema });
} else {
  // Use NeonDB for production
  const { drizzle } = require('drizzle-orm/neon-http');
  const { neon } = require('@neondatabase/serverless');
  schema = require('./schema');
  
  const sql = neon(process.env.DATABASE_URL!);
  db = drizzle(sql, { schema });
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