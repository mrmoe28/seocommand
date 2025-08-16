-- NextAuth tables
CREATE TABLE IF NOT EXISTS "user" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "emailVerified" INTEGER,
  "name" TEXT,
  "image" TEXT
);

CREATE TABLE IF NOT EXISTS "account" (
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,
  PRIMARY KEY ("provider", "providerAccountId")
);

CREATE TABLE IF NOT EXISTS "session" (
  "sessionToken" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "expires" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "verificationToken" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "expires" INTEGER NOT NULL,
  PRIMARY KEY ("identifier", "token")
);

-- Application tables
CREATE TABLE IF NOT EXISTS "sites" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "url" TEXT NOT NULL,
  "domain" TEXT NOT NULL,
  "created_at" INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS "keywords" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "site_id" INTEGER NOT NULL REFERENCES "sites"("id") ON DELETE CASCADE,
  "keyword" TEXT NOT NULL,
  "position" REAL,
  "clicks" INTEGER DEFAULT 0,
  "impressions" INTEGER DEFAULT 0,
  "ctr" REAL DEFAULT 0,
  "date" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "reports" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "site_id" INTEGER NOT NULL REFERENCES "sites"("id") ON DELETE CASCADE,
  "seo_score" INTEGER NOT NULL,
  "recommendations" TEXT NOT NULL,
  "created_at" INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS "google_tokens" (
  "user_id" TEXT PRIMARY KEY REFERENCES "user"("id") ON DELETE CASCADE,
  "access_token" TEXT NOT NULL,
  "refresh_token" TEXT NOT NULL,
  "expires_at" INTEGER NOT NULL
);