import express from 'express';
import mockBusinessesData from '../data/mock_businesses.json';

const router = express.Router();

// GET /businesses/matches - Get AI-matched businesses (MUST be before /:id route)
router.get('/matches', (req, res) => {
  try {
    // In production, this would use the user's profile to calculate match scores
    // For now, just sort by the mock match scores and return top 5
    const matches = [...mockBusinessesData]
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5)
      .map((business, index) => ({
        ...business,
        // Ensure match scores are realistic (99, 95, 90, 85, 82)
        matchScore: 99 - (index * 4) - Math.floor(Math.random() * 3)
      }));

    res.json({
      success: true,
      data: matches
    });
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'MATCHES_ERROR',
        message: 'Failed to fetch matches'
      }
    });
  }
});

// GET /businesses/users/me/saved - Get user's saved businesses (before /:id)
router.get('/users/me/saved', (req, res) => {
  try {
    // Return first 2 businesses as saved for demo
    const saved = mockBusinessesData.slice(0, 2).map(b => ({
      ...b,
      saved_at: new Date().toISOString(),
      notes: 'Interesting opportunity',
      tags: ['high-priority']
    }));

    res.json({
      success: true,
      data: saved
    });
  } catch (error) {
    console.error('Error fetching saved businesses:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch saved businesses'
      }
    });
  }
});

// GET /businesses/search - Search businesses with filters
router.get('/search', (req, res) => {
  try {
    // Remove match scores from search results - they should only appear after onboarding
    let businesses = [...mockBusinessesData].map(b => {
      const { matchScore, ...businessWithoutScore } = b;
      return businessWithoutScore;
    });

    // Apply filters from query parameters
    const { industry, location, minPrice, maxPrice, minRevenue, maxRevenue, q } = req.query;

    if (industry && industry !== 'All Industries') {
      businesses = businesses.filter(b =>
        b.industry.toLowerCase().includes((industry as string).toLowerCase())
      );
    }

    if (location) {
      businesses = businesses.filter(b =>
        b.location.toLowerCase().includes((location as string).toLowerCase())
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
      const query = (q as string).toLowerCase();
      businesses = businesses.filter(b =>
        b.name.toLowerCase().includes(query) ||
        b.description.toLowerCase().includes(query) ||
        b.industry.toLowerCase().includes(query) ||
        b.location.toLowerCase().includes(query)
      );
    }

    // Pagination
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedBusinesses = businesses.slice(startIndex, endIndex);

    res.json({
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
    res.status(500).json({
      success: false,
      error: {
        code: 'SEARCH_ERROR',
        message: 'Failed to search businesses'
      }
    });
  }
});

// GET /businesses/:id - Get business by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const business = mockBusinessesData.find(b => b.id === id);

    if (!business) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Business not found'
        }
      });
    }

    res.json({
      success: true,
      data: business
    });
  } catch (error) {
    console.error('Error fetching business:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch business'
      }
    });
  }
});

// POST /businesses/:id/save - Save a business
router.post('/:id/save', (req, res) => {
  try {
    const { id } = req.params;
    const { notes, tags } = req.body;

    const business = mockBusinessesData.find(b => b.id === id);

    if (!business) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Business not found'
        }
      });
    }

    // In a real app, this would save to database
    const savedBusiness = {
      ...business,
      saved_at: new Date().toISOString(),
      notes,
      tags
    };

    res.json({
      success: true,
      data: savedBusiness
    });
  } catch (error) {
    console.error('Error saving business:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SAVE_ERROR',
        message: 'Failed to save business'
      }
    });
  }
});

// DELETE /businesses/:id/save - Unsave a business
router.delete('/:id/save', (req, res) => {
  try {
    res.json({
      success: true
    });
  } catch (error) {
    console.error('Error unsaving business:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'UNSAVE_ERROR',
        message: 'Failed to unsave business'
      }
    });
  }
});

// POST /businesses/:id/interest - Express interest
router.post('/:id/interest', (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Interest expressed successfully'
    });
  } catch (error) {
    console.error('Error expressing interest:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTEREST_ERROR',
        message: 'Failed to express interest'
      }
    });
  }
});

export default router;
