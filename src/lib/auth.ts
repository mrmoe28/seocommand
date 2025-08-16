import NextAuth from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { getDb, users, googleTokens } from '@/lib/db';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { eq } from 'drizzle-orm';

// Create a conditional adapter that safely handles build time
function createAdapter() {
  // During build time or when DATABASE_URL is not available, return undefined
  if (process.env.BUILD_TIME === 'true' || !process.env.DATABASE_URL) {
    return undefined;
  }
  
  try {
    return DrizzleAdapter(getDb());
  } catch (error) {
    console.error('Failed to initialize database adapter:', error);
    return undefined;
  }
}

const adapter = createAdapter();

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter,
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/webmasters.readonly https://www.googleapis.com/auth/analytics.readonly',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user?.id) {
        try {
          // Only attempt to store tokens if we have a database connection
          if (process.env.BUILD_TIME !== 'true' && process.env.DATABASE_URL) {
            const db = getDb();
            await db
              .insert(googleTokens)
              .values({
                userId: user.id,
                accessToken: account.access_token!,
                refreshToken: account.refresh_token!,
                expiresAt: account.expires_at ? new Date(account.expires_at * 1000) : new Date(),
              })
              .onConflictDoUpdate({
                target: [googleTokens.userId],
                set: {
                  accessToken: account.access_token!,
                  refreshToken: account.refresh_token!,
                  expiresAt: account.expires_at ? new Date(account.expires_at * 1000) : new Date(),
                },
              });
          }
        } catch (error) {
          console.error('Error storing Google tokens:', error);
          // Don't fail sign-in if token storage fails
        }
      }
      return true;
    },
    async session({ session }) {
      if (session?.user?.email) {
        try {
          // Only attempt database operations if we have a connection
          if (process.env.BUILD_TIME !== 'true' && process.env.DATABASE_URL) {
            const db = getDb();
            
            // Get user from database
            const dbUser = await db
              .select()
              .from(users)
              .where(eq(users.email, session.user.email))
              .limit(1);

            if (dbUser[0]) {
              session.user.id = dbUser[0].id;
              
              // Check if user has Google tokens
              const tokens = await db
                .select()
                .from(googleTokens)
                .where(eq(googleTokens.userId, dbUser[0].id))
                .limit(1);

              // Add custom property to session
              (session.user as typeof session.user & { hasGoogleTokens: boolean }).hasGoogleTokens = tokens.length > 0;
            }
          } else {
            // During build time, set default values
            (session.user as typeof session.user & { hasGoogleTokens: boolean }).hasGoogleTokens = false;
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Set default values on error
          (session.user as typeof session.user & { hasGoogleTokens: boolean }).hasGoogleTokens = false;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify',
  },
});