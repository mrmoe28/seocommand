import { google } from 'googleapis';
import { db } from '@/lib/db';
import { googleTokens, keywords, sites } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export class GoogleAPIService {
  private async getOAuth2Client(userId: string) {
    const tokens = await db
      .select()
      .from(googleTokens)
      .where(eq(googleTokens.userId, userId))
      .limit(1);

    if (!tokens[0]) {
      throw new Error('No Google tokens found for user');
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.NEXTAUTH_URL + '/api/auth/callback/google'
    );

    oauth2Client.setCredentials({
      access_token: tokens[0].accessToken,
      refresh_token: tokens[0].refreshToken,
    });

    // Handle token refresh
    oauth2Client.on('tokens', async (newTokens) => {
      if (newTokens.access_token) {
        await db
          .update(googleTokens)
          .set({
            accessToken: newTokens.access_token,
            expiresAt: new Date(Date.now() + (newTokens.expiry_date || 3600000)),
          })
          .where(eq(googleTokens.userId, userId));
      }
    });

    return oauth2Client;
  }

  async getSearchConsoleSites(userId: string) {
    const auth = await this.getOAuth2Client(userId);
    const searchconsole = google.searchconsole({ version: 'v1', auth });

    try {
      const response = await searchconsole.sites.list();
      return response.data.siteEntry?.filter(site => 
        site.permissionLevel === 'siteOwner' || site.permissionLevel === 'siteFullUser'
      ) || [];
    } catch (error) {
      console.error('Error fetching Search Console sites:', error);
      throw error;
    }
  }

  async getSearchConsoleData(userId: string, siteUrl: string, startDate: string, endDate: string) {
    const auth = await this.getOAuth2Client(userId);
    const searchconsole = google.searchconsole({ version: 'v1', auth });

    try {
      // Get query performance data
      const queryResponse = await searchconsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate,
          endDate,
          dimensions: ['query'],
          rowLimit: 1000,
        },
      });

      // Get page performance data
      const pageResponse = await searchconsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate,
          endDate,
          dimensions: ['page'],
          rowLimit: 1000,
        },
      });

      return {
        queries: queryResponse.data.rows || [],
        pages: pageResponse.data.rows || [],
      };
    } catch (error) {
      console.error('Error fetching Search Console data:', error);
      throw error;
    }
  }

  async syncKeywordData(userId: string, siteId: number, siteUrl: string) {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    try {
      const data = await this.getSearchConsoleData(userId, siteUrl, startDate, endDate);
      
      // Process and save keyword data
      const keywordPromises = data.queries.map(async (query: any) => {
        const position = query.position || 0;
        const clicks = query.clicks || 0;
        const impressions = query.impressions || 0;
        const ctr = query.ctr || 0;

        return db
          .insert(keywords)
          .values({
            siteId,
            keyword: query.keys[0],
            position,
            clicks,
            impressions,
            ctr,
            date: endDate,
          })
          .onConflictDoUpdate({
            target: [keywords.siteId, keywords.keyword, keywords.date],
            set: {
              position,
              clicks,
              impressions,
              ctr,
            },
          });
      });

      await Promise.all(keywordPromises);
      return { success: true, keywordCount: data.queries.length };
    } catch (error) {
      console.error('Error syncing keyword data:', error);
      throw error;
    }
  }

  async getAnalyticsData(userId: string, propertyId: string, startDate: string, endDate: string) {
    const auth = await this.getOAuth2Client(userId);
    const analytics = google.analyticsdata({ version: 'v1beta', auth });

    try {
      const response = await analytics.properties.runReport({
        property: `properties/${propertyId}`,
        requestBody: {
          dateRanges: [{ startDate, endDate }],
          metrics: [
            { name: 'sessions' },
            { name: 'pageviews' },
            { name: 'bounceRate' },
            { name: 'averageSessionDuration' },
          ],
          dimensions: [
            { name: 'date' },
          ],
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching Analytics data:', error);
      throw error;
    }
  }

  async calculateSEOScore(siteId: number): Promise<{ score: number; recommendations: string[] }> {
    // Get recent keyword data
    const recentKeywords = await db
      .select()
      .from(keywords)
      .where(eq(keywords.siteId, siteId))
      .limit(100);

    if (recentKeywords.length === 0) {
      return {
        score: 0,
        recommendations: ['No keyword data available. Connect Google Search Console to start tracking.'],
      };
    }

    let score = 0;
    const recommendations: string[] = [];

    // Calculate average position
    const avgPosition = recentKeywords.reduce((sum, k) => sum + (k.position || 0), 0) / recentKeywords.length;
    
    // Score based on average position (0-40 points)
    if (avgPosition <= 3) score += 40;
    else if (avgPosition <= 10) score += 30;
    else if (avgPosition <= 20) score += 20;
    else score += 10;

    if (avgPosition > 10) {
      recommendations.push('Improve keyword rankings - many keywords are ranking below position 10');
    }

    // Score based on CTR (0-30 points)
    const avgCTR = recentKeywords.reduce((sum, k) => sum + (k.ctr || 0), 0) / recentKeywords.length;
    
    if (avgCTR >= 0.05) score += 30;
    else if (avgCTR >= 0.03) score += 20;
    else if (avgCTR >= 0.01) score += 10;

    if (avgCTR < 0.03) {
      recommendations.push('Optimize meta titles and descriptions to improve click-through rates');
    }

    // Score based on keyword diversity (0-30 points)
    const uniqueKeywords = new Set(recentKeywords.map(k => k.keyword)).size;
    
    if (uniqueKeywords >= 50) score += 30;
    else if (uniqueKeywords >= 25) score += 20;
    else if (uniqueKeywords >= 10) score += 10;

    if (uniqueKeywords < 25) {
      recommendations.push('Expand keyword targeting to cover more search terms');
    }

    // Additional recommendations based on data
    const topKeywords = recentKeywords
      .filter(k => k.position && k.position <= 10)
      .length;

    if (topKeywords < recentKeywords.length * 0.3) {
      recommendations.push('Focus on improving content quality for better rankings');
    }

    const lowCTRKeywords = recentKeywords
      .filter(k => k.ctr && k.ctr < 0.02)
      .length;

    if (lowCTRKeywords > recentKeywords.length * 0.5) {
      recommendations.push('Review and optimize page titles and meta descriptions');
    }

    return {
      score: Math.min(100, score),
      recommendations: recommendations.length > 0 ? recommendations : ['Great job! Your SEO performance is looking good.'],
    };
  }
}

export const googleApiService = new GoogleAPIService();