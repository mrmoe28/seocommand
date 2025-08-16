import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { googleApiService } from '@/lib/google-api';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const sites = await googleApiService.getSearchConsoleSites(userId);

    return NextResponse.json({ sites });
  } catch (error) {
    console.error('Error fetching Google sites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sites' },
      { status: 500 }
    );
  }
}