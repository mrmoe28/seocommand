import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { googleApiService } from '@/lib/google-api';
import { db } from '@/lib/db';
import { sites, reports } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { siteId } = await request.json();

    // Get site details
    const site = await db
      .select()
      .from(sites)
      .where(eq(sites.id, siteId))
      .limit(1);

    if (!site[0] || site[0].userId !== userId) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    // Sync keyword data
    const syncResult = await googleApiService.syncKeywordData(
      userId,
      siteId,
      site[0].url
    );

    // Calculate SEO score
    const seoData = await googleApiService.calculateSEOScore(siteId);

    // Save report
    await db.insert(reports).values({
      siteId,
      seoScore: seoData.score,
      recommendations: seoData.recommendations,
    });

    return NextResponse.json({
      success: true,
      keywordCount: syncResult.keywordCount,
      seoScore: seoData.score,
      recommendations: seoData.recommendations,
    });
  } catch (error) {
    console.error('Error syncing data:', error);
    return NextResponse.json(
      { error: 'Failed to sync data' },
      { status: 500 }
    );
  }
}