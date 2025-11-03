import express, { Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../../../shared/middleware/auth';
import { logger } from '../../../shared/utils/logger';
import { z } from 'zod';
import axios from 'axios';
import { query } from '../../../svc-catalog/src/db/client';

const router = express.Router();

const valuationRequestSchema = z.object({
  propertyId: z.string().uuid(),
});

/**
 * POST /property
 * Protected endpoint - Generate property valuation using AI
 */
router.post('/property', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const tenantId = req.user!.tenantId;

    const validated = valuationRequestSchema.parse(req.body);
    const { propertyId } = validated;

    // 1. Fetch property details
    const propertyResult = await query(
      'SELECT * FROM properties WHERE id = $1',
      [propertyId]
    );

    if (propertyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Property not found',
        },
      });
    }

    const property = propertyResult.rows[0];

    // 2. Call AI valuation service
    const aiServiceUrl = process.env.AI_VALUATION_SERVICE_URL || 'http://svc-ai-valuation:8003';

    let aiValuation;
    try {
      const aiResponse = await axios.post(
        `${aiServiceUrl}/api/valuation/property`,
        {
          property_id: propertyId,
          features: {
            sqft: property.sqft,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            year_built: property.year_built,
            lot_size: property.lot_size,
            latitude: property.latitude,
            longitude: property.longitude,
            property_type: property.property_type,
            city: property.city,
            state: property.state,
          },
        },
        {
          timeout: 30000, // 30 second timeout
        }
      );

      aiValuation = aiResponse.data;
    } catch (aiError: any) {
      logger.error('AI valuation service error', {
        error: aiError.message,
        propertyId,
      });

      // Fallback to simple valuation if AI service is unavailable
      aiValuation = generateFallbackValuation(property);
    }

    // 3. Store valuation result
    const valuationResult = await query(
      `INSERT INTO property_valuations (
        tenant_id, property_id, user_id, method, estimated_value,
        confidence, comparables, driver_attribution, price_range,
        model_version, valuation_date, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        tenantId,
        propertyId,
        userId,
        'hybrid', // valuation method
        aiValuation.estimated_value,
        aiValuation.confidence || 0.85,
        JSON.stringify(aiValuation.comparables || []),
        JSON.stringify(aiValuation.driver_attribution || []),
        JSON.stringify(aiValuation.price_range || {
          low: aiValuation.estimated_value * 0.9,
          high: aiValuation.estimated_value * 1.1,
        }),
        aiValuation.model_version || 'v1.0',
        new Date(),
        userId,
      ]
    );

    const valuation = valuationResult.rows[0];

    // 4. Return result with property details
    res.json({
      success: true,
      data: {
        valuation_id: valuation.id,
        property: {
          id: property.id,
          address: property.address,
          city: property.city,
          state: property.state,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          sqft: property.sqft,
        },
        estimated_value: valuation.estimated_value,
        confidence: valuation.confidence,
        price_range: valuation.price_range,
        comparables: valuation.comparables,
        driver_attribution: valuation.driver_attribution,
        valuation_date: valuation.valuation_date,
      },
    });
  } catch (error) {
    logger.error('Property valuation error', { error });

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
        code: 'VALUATION_ERROR',
        message: 'Failed to generate valuation',
      },
    });
  }
});

/**
 * GET /property/:propertyId/history
 * Protected endpoint - Get valuation history for a property
 */
router.get('/property/:propertyId/history', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user!.id;

    const result = await query(
      `SELECT * FROM property_valuations
       WHERE property_id = $1 AND user_id = $2
       ORDER BY valuation_date DESC`,
      [propertyId, userId]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    logger.error('Get valuation history error', { error });

    res.status(500).json({
      success: false,
      error: {
        code: 'HISTORY_ERROR',
        message: 'Failed to retrieve valuation history',
      },
    });
  }
});

/**
 * Fallback valuation function when AI service is unavailable
 * Uses simple comparable-based estimation
 */
function generateFallbackValuation(property: any) {
  // Simple price per square foot estimation
  const avgPricePerSqft = getAveragePricePerSqft(property.city, property.state);
  const baseValue = property.sqft * avgPricePerSqft;

  // Adjustments
  let adjustedValue = baseValue;

  // Bedroom/bathroom adjustment
  if (property.bedrooms >= 4) adjustedValue *= 1.1;
  if (property.bathrooms >= 3) adjustedValue *= 1.05;

  // Age adjustment
  const age = new Date().getFullYear() - (property.year_built || 2000);
  if (age < 10) adjustedValue *= 1.1;
  else if (age > 50) adjustedValue *= 0.9;

  // Property type adjustment
  if (property.property_type === 'single_family') adjustedValue *= 1.05;
  else if (property.property_type === 'condo') adjustedValue *= 0.95;

  return {
    estimated_value: Math.round(adjustedValue),
    confidence: 0.75, // Lower confidence for fallback
    price_range: {
      low: Math.round(adjustedValue * 0.85),
      high: Math.round(adjustedValue * 1.15),
    },
    comparables: [],
    driver_attribution: [
      { driver: 'sqft', contribution: baseValue * 0.6, percentage: 60 },
      { driver: 'location', contribution: baseValue * 0.25, percentage: 25 },
      { driver: 'features', contribution: baseValue * 0.15, percentage: 15 },
    ],
    model_version: 'fallback-v1.0',
  };
}

/**
 * Get average price per square foot for a location
 * In production, this would query a database of market data
 */
function getAveragePricePerSqft(city: string, state: string): number {
  // Simple lookup table for demo purposes
  const marketData: Record<string, number> = {
    'Boston-MA': 650,
    'Cambridge-MA': 700,
    'Somerville-MA': 550,
    'New York-NY': 850,
    'San Francisco-CA': 950,
    'Los Angeles-CA': 600,
    'Chicago-IL': 350,
    'Austin-TX': 400,
  };

  const key = `${city}-${state}`;
  return marketData[key] || 400; // Default $400/sqft
}

export default router;
