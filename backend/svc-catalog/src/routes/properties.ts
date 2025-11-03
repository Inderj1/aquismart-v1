import express, { Request, Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../../../shared/middleware/auth';
import propertyService from '../services/propertyService';
import { logger } from '../../../shared/utils/logger';
import { z } from 'zod';

const router = express.Router();

// Validation schemas
const searchSchema = z.object({
  q: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  bedrooms: z.number().int().positive().optional(),
  bathrooms: z.number().positive().optional(),
  propertyType: z.enum(['single_family', 'condo', 'townhouse', 'multi_family', 'land', 'commercial']).optional(),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().max(100).optional(),
});

const savePropertySchema = z.object({
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

/**
 * GET /properties/search
 * Public endpoint - Search properties
 */
router.get('/search', async (req: Request, res: Response) => {
  try {
    // Parse and validate query parameters
    const params = {
      q: req.query.q as string,
      city: req.query.city as string,
      state: req.query.state as string,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
      bedrooms: req.query.bedrooms ? parseInt(req.query.bedrooms as string) : undefined,
      bathrooms: req.query.bathrooms ? parseFloat(req.query.bathrooms as string) : undefined,
      propertyType: req.query.propertyType as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string) : 20,
    };

    const validated = searchSchema.parse(params);

    const { properties, total } = await propertyService.searchProperties(validated);

    res.json({
      success: true,
      data: properties,
      metadata: {
        total,
        page: validated.page || 1,
        pageSize: validated.pageSize || 20,
        hasMore: total > (validated.page || 1) * (validated.pageSize || 20),
      },
    });
  } catch (error) {
    logger.error('Property search error', { error });

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid search parameters',
          details: error.errors,
        },
      });
    }

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

    const property = await propertyService.getPropertyById(id);

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
    logger.error('Get property error', { error, propertyId: req.params.id });

    res.status(500).json({
      success: false,
      error: {
        code: 'GET_PROPERTY_ERROR',
        message: 'Failed to retrieve property',
      },
    });
  }
});

/**
 * POST /properties/:id/save
 * Protected endpoint - Save property for user
 */
router.post('/:id/save', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const validated = savePropertySchema.parse(req.body);

    // Check if property exists
    const property = await propertyService.getPropertyById(id);
    if (!property) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Property not found',
        },
      });
    }

    const savedProperty = await propertyService.savePropertyForUser(
      userId,
      id,
      validated.notes,
      validated.tags
    );

    res.json({
      success: true,
      data: savedProperty,
      message: 'Property saved successfully',
    });
  } catch (error) {
    logger.error('Save property error', { error, propertyId: req.params.id });

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: error.errors,
        },
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'SAVE_ERROR',
        message: 'Failed to save property',
      },
    });
  }
});

/**
 * DELETE /properties/:id/save
 * Protected endpoint - Remove saved property
 */
router.delete('/:id/save', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const removed = await propertyService.removeSavedProperty(userId, id);

    if (!removed) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Saved property not found',
        },
      });
    }

    res.json({
      success: true,
      message: 'Property removed from saved list',
    });
  } catch (error) {
    logger.error('Remove saved property error', { error, propertyId: req.params.id });

    res.status(500).json({
      success: false,
      error: {
        code: 'REMOVE_ERROR',
        message: 'Failed to remove saved property',
      },
    });
  }
});

/**
 * GET /properties/users/me/saved
 * Protected endpoint - Get user's saved properties
 */
router.get('/users/me/saved', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const properties = await propertyService.getUserSavedProperties(userId);

    res.json({
      success: true,
      data: properties,
    });
  } catch (error) {
    logger.error('Get saved properties error', { error });

    res.status(500).json({
      success: false,
      error: {
        code: 'GET_SAVED_ERROR',
        message: 'Failed to retrieve saved properties',
      },
    });
  }
});

/**
 * GET /properties/users/me/valuations
 * Protected endpoint - Get user's property valuations
 */
router.get('/users/me/valuations', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const valuations = await propertyService.getUserPropertyValuations(userId);

    res.json({
      success: true,
      data: valuations,
    });
  } catch (error) {
    logger.error('Get valuations error', { error });

    res.status(500).json({
      success: false,
      error: {
        code: 'GET_VALUATIONS_ERROR',
        message: 'Failed to retrieve valuations',
      },
    });
  }
});

/**
 * POST /properties/seed
 * Protected endpoint - Create sample properties (for development)
 */
router.post('/seed', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;
    const userId = req.user!.id;

    await propertyService.createSampleProperties(tenantId, userId);

    res.json({
      success: true,
      message: 'Sample properties created successfully',
    });
  } catch (error) {
    logger.error('Seed properties error', { error });

    res.status(500).json({
      success: false,
      error: {
        code: 'SEED_ERROR',
        message: 'Failed to create sample properties',
      },
    });
  }
});

export default router;
