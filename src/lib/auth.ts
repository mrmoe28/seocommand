import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/lib/db';
import { users, googleTokens } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
        auth: {
          user: process.env.EMAIL_SERVER_USER || '',
          pass: process.env.EMAIL_SERVER_PASSWORD || '',
        },
      },
      from: process.env.EMAIL_FROM,
      // In development, log the magic link to console
      sendVerificationRequest: async ({ identifier, url }) => {
        console.log('\n==========================================');
        console.log('🔐 MAGIC LINK FOR:', identifier);
        console.log('📧 Click this link to sign in:');
        console.log(url);
        console.log('==========================================\n');
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/webmasters.readonly https://www.googleapis.com/auth/analytics.readonly',
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account?.provider === 'google' && account.access_token && account.refresh_token) {
        // Store Google tokens
        if (user?.id) {
          await db
            .insert(googleTokens)
            .values({
              userId: user.id,
              accessToken: account.access_token,
              refreshToken: account.refresh_token,
              expiresAt: new Date(account.expires_at! * 1000),
            })
            .onConflictDoUpdate({
              target: googleTokens.userId,
              set: {
                accessToken: account.access_token,
                refreshToken: account.refresh_token,
                expiresAt: new Date(account.expires_at! * 1000),
              },
            });
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user?.email) {
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

          (session as any).hasGoogleAccess = tokens.length > 0;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify',
  },
  session: {
    strategy: 'jwt',
  },
});