import { NextRequest, NextResponse } from 'next/server';
import { SEOAnalyzer } from '@/lib/seo-analyzer';

export async function POST(request: NextRequest) {
  try {
    // Temporarily bypass authentication for testing web scraping
    // const session = await auth();
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Analyze the website using web scraping
    const analyzer = new SEOAnalyzer();
    const analysis = await analyzer.analyzeWebsite(url);

    return NextResponse.json({ analysis });

  } catch (error) {
    console.error('SEO Analysis Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze website' },
      { status: 500 }
    );
  }
}