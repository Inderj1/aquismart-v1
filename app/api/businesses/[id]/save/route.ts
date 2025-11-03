import { NextRequest, NextResponse } from 'next/server';
import mockBusinessesData from '@/lib/data/mock_businesses.json';

// In-memory storage for saved businesses (per session)
// In production, this would be stored in a database with user authentication
const savedBusinessesMap = new Map<string, Set<string>>();

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

    // Add to saved businesses
    if (!savedBusinessesMap.has(userId)) {
      savedBusinessesMap.set(userId, new Set());
    }
    savedBusinessesMap.get(userId)!.add(id);

    return NextResponse.json({
      success: true,
      message: 'Business saved successfully'
    });
  } catch (error) {
    console.error('Error saving business:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SAVE_ERROR',
          message: 'Failed to save business'
        }
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Get user ID from headers or session (mock implementation)
    const userId = request.headers.get('x-user-id') || 'default-user';

    // Remove from saved businesses
    const savedIds = savedBusinessesMap.get(userId);
    if (savedIds) {
      savedIds.delete(id);
    }

    return NextResponse.json({
      success: true,
      message: 'Business unsaved successfully'
    });
  } catch (error) {
    console.error('Error unsaving business:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UNSAVE_ERROR',
          message: 'Failed to unsave business'
        }
      },
      { status: 500 }
    );
  }
}
