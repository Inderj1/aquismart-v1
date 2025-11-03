import { NextRequest, NextResponse } from 'next/server';
import mockBusinessesData from '@/lib/data/mock_businesses.json';

// In-memory storage for saved businesses (per session)
// In production, this would be stored in a database with user authentication
const savedBusinessesMap = new Map<string, Set<string>>();

export async function GET(request: NextRequest) {
  try {
    // Get user ID from headers or session (mock implementation)
    const userId = request.headers.get('x-user-id') || 'default-user';

    const savedIds = savedBusinessesMap.get(userId) || new Set();
    const savedBusinesses = mockBusinessesData.filter(b => savedIds.has(b.id));

    return NextResponse.json({
      success: true,
      data: savedBusinesses
    });
  } catch (error) {
    console.error('Error fetching saved businesses:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch saved businesses'
        }
      },
      { status: 500 }
    );
  }
}
