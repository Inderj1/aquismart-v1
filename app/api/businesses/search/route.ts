import { NextRequest, NextResponse } from 'next/server';
import mockBusinessesData from '@/lib/data/mock_businesses.json';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Remove match scores from search results
    let businesses = [...mockBusinessesData].map(b => {
      const { matchScore, ...businessWithoutScore } = b;
      return businessWithoutScore;
    });

    // Apply filters from query parameters
    const industry = searchParams.get('industry');
    const location = searchParams.get('location');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minRevenue = searchParams.get('minRevenue');
    const maxRevenue = searchParams.get('maxRevenue');
    const q = searchParams.get('q');

    if (industry && industry !== 'All Industries') {
      businesses = businesses.filter(b =>
        b.industry.toLowerCase().includes(industry.toLowerCase())
      );
    }

    if (location) {
      businesses = businesses.filter(b =>
        b.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (minPrice) {
      businesses = businesses.filter(b => b.askingPrice >= Number(minPrice));
    }

    if (maxPrice) {
      businesses = businesses.filter(b => b.askingPrice <= Number(maxPrice));
    }

    if (minRevenue) {
      businesses = businesses.filter(b => b.revenue >= Number(minRevenue));
    }

    if (maxRevenue) {
      businesses = businesses.filter(b => b.revenue <= Number(maxRevenue));
    }

    if (q) {
      const query = q.toLowerCase();
      businesses = businesses.filter(b =>
        b.name.toLowerCase().includes(query) ||
        b.description.toLowerCase().includes(query) ||
        b.industry.toLowerCase().includes(query) ||
        b.location.toLowerCase().includes(query)
      );
    }

    // Pagination
    const page = Number(searchParams.get('page')) || 1;
    const pageSize = Number(searchParams.get('pageSize')) || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedBusinesses = businesses.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedBusinesses,
      pagination: {
        page,
        pageSize,
        total: businesses.length,
        totalPages: Math.ceil(businesses.length / pageSize)
      }
    });
  } catch (error) {
    console.error('Error searching businesses:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SEARCH_ERROR',
          message: 'Failed to search businesses'
        }
      },
      { status: 500 }
    );
  }
}
