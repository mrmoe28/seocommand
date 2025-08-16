import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sites, googleTokens, reports } from '@/lib/db/schema';
import { googleApiService } from '@/lib/google-api';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Verify this is a Vercel cron request
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting daily keyword sync...');

    // Get all sites that need syncing
    const allSites = await (db as any)
      .select()
      .from(sites);

    let syncedSites = 0;
    let errors = 0;

    for (const site of allSites) {
      const userId = site.userId;
      
      // Check if user has Google tokens
      const userTokens = await (db as any)
        .select()
        .from(googleTokens)
        .where(eq(googleTokens.userId, userId))
        .limit(1);
      
      if (userTokens.length === 0) {
        console.log(`Skipping site ${site.domain} - no Google tokens found for user ${userId}`);
        continue;
      }
      
      try {
        console.log(`Syncing data for site: ${site.domain}`);
        
        // Sync keyword data
        const syncResult = await googleApiService.syncKeywordData(
          userId,
          site.id,
          site.url
        );

        // Calculate and save SEO score
        const seoData = await googleApiService.calculateSEOScore(site.id);
        
        await db.insert(reports).values({
          siteId: site.id,
          seoScore: seoData.score,
          recommendations: seoData.recommendations,
        });

        syncedSites++;
        console.log(`Successfully synced ${syncResult.keywordCount} keywords for ${site.domain}`);
      } catch (error) {
        console.error(`Error syncing site ${site.domain}:`, error);
        errors++;
      }
    }

    console.log(`Sync complete. ${syncedSites} sites synced, ${errors} errors`);

    return NextResponse.json({
      success: true,
      syncedSites,
      errors,
      message: `Successfully synced ${syncedSites} sites with ${errors} errors`,
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Failed to run sync job' },
      { status: 500 }
    );
  }
}

// Handle POST requests as well for manual triggering
export async function POST(request: NextRequest) {
  return GET(request);
}