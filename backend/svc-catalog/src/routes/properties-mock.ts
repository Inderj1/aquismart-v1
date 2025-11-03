import express, { Request, Response } from 'express';

const router = express.Router();

// Mock property data
const mockProperties = [
  {
    id: '1',
    address: '123 Main Street',
    city: 'Boston',
    state: 'MA',
    zipCode: '02101',
    country: 'USA',
    propertyType: 'single_family',
    bedrooms: 3,
    bathrooms: 2.5,
    sqft: 2200,
    latitude: 42.3601,
    longitude: -71.0589,
    listPrice: 850000,
    photos: ['/property1.jpeg'],
    description: 'Beautiful single family home in downtown Boston',
    status: 'active',
  },
  {
    id: '2',
    address: '456 Oak Avenue',
    city: 'Cambridge',
    state: 'MA',
    zipCode: '02138',
    country: 'USA',
    propertyType: 'condo',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1400,
    latitude: 42.3736,
    longitude: -71.1097,
    listPrice: 625000,
    photos: [],
    description: 'Modern condo near Harvard Square',
    status: 'active',
  },
  {
    id: '3',
    address: '789 Elm Street',
    city: 'Somerville',
    state: 'MA',
    zipCode: '02144',
    country: 'USA',
    propertyType: 'townhouse',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2800,
    latitude: 42.3876,
    longitude: -71.0995,
    listPrice: 975000,
    photos: [],
    description: 'Spacious townhouse with parking',
    status: 'active',
  },
];

/**
 * GET /properties/search
 * Public endpoint - Search properties
 */
router.get('/search', async (req: Request, res: Response) => {
  try {
    let filtered = [...mockProperties];

    // Apply filters
    if (req.query.city) {
      filtered = filtered.filter(p =>
        p.city.toLowerCase().includes((req.query.city as string).toLowerCase())
      );
    }

    if (req.query.minPrice) {
      const minPrice = parseFloat(req.query.minPrice as string);
      filtered = filtered.filter(p => (p.listPrice || 0) >= minPrice);
    }

    if (req.query.maxPrice) {
      const maxPrice = parseFloat(req.query.maxPrice as string);
      filtered = filtered.filter(p => (p.listPrice || 0) <= maxPrice);
    }

    if (req.query.bedrooms) {
      const bedrooms = parseInt(req.query.bedrooms as string);
      filtered = filtered.filter(p => p.bedrooms >= bedrooms);
    }

    res.json({
      success: true,
      data: filtered,
      metadata: {
        total: filtered.length,
        page: 1,
        pageSize: 20,
        hasMore: false,
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SEARCH_ERROR',
        message: 'Failed to search properties',
      },
    });
  }
});

/**
 * GET /properties/:id
 * Public endpoint - Get property details
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const property = mockProperties.find(p => p.id === id);

    if (!property) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Property not found',
        },
      });
    }

    res.json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_PROPERTY_ERROR',
        message: 'Failed to retrieve property',
      },
    });
  }
});

// Other endpoints return empty/mock data for now
router.post('/:id/save', (req, res) => {
  res.json({ success: true, message: 'Property saved (mock)' });
});

router.delete('/:id/save', (req, res) => {
  res.json({ success: true, message: 'Property removed (mock)' });
});

router.get('/users/me/saved', (req, res) => {
  res.json({ success: true, data: [] });
});

router.get('/users/me/valuations', (req, res) => {
  res.json({ success: true, data: [] });
});

export default router;
