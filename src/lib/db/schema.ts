import { pgTable, serial, text, timestamp, integer, real, date, json, primaryKey } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

// NextAuth required tables
export const users = pgTable('user', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  name: text('name'),
  image: text('image'),
});

export const accounts = pgTable('account', {
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
}, (account) => ({
  compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
}));

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable('verificationToken', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
}, (verificationToken) => ({
  compositePk: primaryKey({ columns: [verificationToken.identifier, verificationToken.token] }),
}));

// Application specific tables
export const sites = pgTable('sites', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  domain: text('domain').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const keywords = pgTable('keywords', {
  id: serial('id').primaryKey(),
  siteId: integer('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  keyword: text('keyword').notNull(),
  position: real('position'),
  clicks: integer('clicks').default(0),
  impressions: integer('impressions').default(0),
  ctr: real('ctr').default(0),
  date: date('date').notNull(),
});

export const reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  siteId: integer('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  seoScore: integer('seo_score').notNull(),
  recommendations: json('recommendations').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const googleTokens = pgTable('google_tokens', {
  userId: text('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertSiteSchema = createInsertSchema(sites);
export const selectSiteSchema = createSelectSchema(sites);
export const insertKeywordSchema = createInsertSchema(keywords);
export const selectKeywordSchema = createSelectSchema(keywords);
export const insertReportSchema = createInsertSchema(reports);
export const selectReportSchema = createSelectSchema(reports);
export const insertGoogleTokenSchema = createInsertSchema(googleTokens);
export const selectGoogleTokenSchema = createSelectSchema(googleTokens);

export type User = typeof users.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type VerificationToken = typeof verificationTokens.$inferSelect;
export type Site = typeof sites.$inferSelect;
export type Keyword = typeof keywords.$inferSelect;
export type Report = typeof reports.$inferSelect;
export type GoogleToken = typeof googleTokens.$inferSelect;