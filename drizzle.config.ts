import { defineConfig } from 'drizzle-kit';

const isSQLite = process.env.DATABASE_URL?.startsWith('file:');

export default defineConfig({
  schema: isSQLite ? './src/lib/db/schema-sqlite.ts' : './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: isSQLite ? 'sqlite' : 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});