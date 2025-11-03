import { NextRequest, NextResponse } from 'next/server';
import mockBusinessesData from '@/lib/data/mock_businesses.json';

// In-memory storage for interest expressions (per session)
// In production, this would be stored in a database
interface InterestData {
  businessId: string;
  userId: string;
  message?: string;
  timestamp: string;
}

const interestLog: InterestData[] = [];

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Verify business exists
    const business = mockBusinessesData.find(b => b.id === id);
    if (!business) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Business not found'
          }
        },
        { status: 404 }
      );
    }

    // Get user ID from headers or session (mock implementation)
    const userId = request.headers.get('x-user-id') || 'default-user';

    // Parse request body for optional message
    const body = await request.json().catch(() => ({}));
    const message = body.message || '';

    // Log interest
    interestLog.push({
      businessId: id,
      userId,
      message,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'Interest expressed successfully'
    });
  } catch (error) {
    console.error('Error expressing interest:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTEREST_ERROR',
          message: 'Failed to express interest'
        }
      },
      { status: 500 }
    );
  }
}
