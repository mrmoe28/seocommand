import { NextRequest, NextResponse } from 'next/server';
import { getDb, sites } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    // Temporarily bypass authentication for testing web scraping
    // const session = await auth();
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    // const userId = session.user.id;
    
    const userId = "demo-user"; // Use demo user for testing
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL format
    let validUrl: URL;
    try {
      validUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // For now, skip Google Search Console requirement - just validate URL format
    // TODO: Implement Google Search Console integration when ready

    // Check if site is already added
    const existingSite = await getDb()
      .select()
      .from(sites)
      .where(eq(sites.url, validUrl.href))
      .limit(1);

    if (existingSite.length > 0) {
      return NextResponse.json(
        { error: 'Website already added' }, 
        { status: 400 }
      );
    }

    // TODO: Add Google Search Console verification here when needed

    // Add site to database
    const domain = validUrl.hostname;
    const [newSite] = await getDb()
      .insert(sites)
      .values({
        userId,
        url: validUrl.href,
        domain,
        createdAt: new Date(),
      })
      .returning();

    return NextResponse.json({ site: newSite });
  } catch (error) {
    console.error('Error adding site:', error);
    return NextResponse.json(
      { error: 'Failed to add website' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Temporarily bypass authentication for testing web scraping
    // const session = await auth();
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    // const userId = session.user.id;
    
    const userId = "demo-user"; // Use demo user for testing

    const userSites = await getDb()
      .select()
      .from(sites)
      .where(eq(sites.userId, userId));

    return NextResponse.json({ sites: userSites });
  } catch (error) {
    console.error('Error fetching sites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sites' },
      { status: 500 }
    );
  }
}