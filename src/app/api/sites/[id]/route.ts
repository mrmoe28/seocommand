import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { sites, keywords, reports } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const siteId = parseInt(params.id);

    if (isNaN(siteId)) {
      return NextResponse.json({ error: 'Invalid site ID' }, { status: 400 });
    }

    // Verify site belongs to user
    const site = await db
      .select()
      .from(sites)
      .where(and(eq(sites.id, siteId), eq(sites.userId, userId)))
      .limit(1);

    if (!site[0]) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    // Delete associated keywords and reports (cascade)
    await db.delete(keywords).where(eq(keywords.siteId, siteId));
    await db.delete(reports).where(eq(reports.siteId, siteId));
    
    // Delete the site
    await db.delete(sites).where(eq(sites.id, siteId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting site:', error);
    return NextResponse.json(
      { error: 'Failed to delete site' },
      { status: 500 }
    );
  }
}