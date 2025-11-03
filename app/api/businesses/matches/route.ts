import { NextRequest, NextResponse } from 'next/server';
import mockBusinessesData from '@/lib/data/mock_businesses.json';

export async function GET(request: NextRequest) {
  try {
    // Get top 5 matches with highest match scores
    const topMatches = [...mockBusinessesData]
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
      .slice(0, 5);

    return NextResponse.json({
      success: true,
      data: topMatches
    });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'MATCHES_ERROR',
          message: 'Failed to fetch matches'
        }
      },
      { status: 500 }
    );
  }
}
