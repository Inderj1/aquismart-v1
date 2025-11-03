import { query } from '../db/client';
import { Property, PropertyValuation, SavedProperty, SearchQuery, ApiResponse } from '../../../shared/types';
import { logger } from '../../../shared/utils/logger';

export class PropertyService {
  /**
   * Search properties with filters
   */
  async searchProperties(searchParams: {
    q?: string;
    city?: string;
    state?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    propertyType?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ properties: Property[]; total: number }> {
    const {
      q,
      city,
      state,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      propertyType,
      page = 1,
      pageSize = 20,
    } = searchParams;

    let whereClauses: string[] = ["status = 'active'"];
    let params: any[] = [];
    let paramIndex = 1;

    // Text search on address or city
    if (q) {
      whereClauses.push(`(address ILIKE $${paramIndex} OR city ILIKE $${paramIndex})`);
      params.push(`%${q}%`);
      paramIndex++;
    }

    if (city) {
      whereClauses.push(`city ILIKE $${paramIndex}`);
      params.push(`%${city}%`);
      paramIndex++;
    }

    if (state) {
      whereClauses.push(`state = $${paramIndex}`);
      params.push(state);
      paramIndex++;
    }

    if (minPrice !== undefined) {
      whereClauses.push(`list_price >= $${paramIndex}`);
      params.push(minPrice);
      paramIndex++;
    }

    if (maxPrice !== undefined) {
      whereClauses.push(`list_price <= $${paramIndex}`);
      params.push(maxPrice);
      paramIndex++;
    }

    if (bedrooms !== undefined) {
      whereClauses.push(`bedrooms >= $${paramIndex}`);
      params.push(bedrooms);
      paramIndex++;
    }

    if (bathrooms !== undefined) {
      whereClauses.push(`bathrooms >= $${paramIndex}`);
      params.push(bathrooms);
      paramIndex++;
    }

    if (propertyType) {
      whereClauses.push(`property_type = $${paramIndex}`);
      params.push(propertyType);
      paramIndex++;
    }

    const whereClause = whereClauses.join(' AND ');
    const offset = (page - 1) * pageSize;

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM properties WHERE ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].total);

    // Get properties
    const result = await query(
      `SELECT * FROM properties
       WHERE ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, pageSize, offset]
    );

    return {
      properties: result.rows,
      total,
    };
  }

  /**
   * Get property by ID
   */
  async getPropertyById(id: string): Promise<Property | null> {
    const result = await query(
      'SELECT * FROM properties WHERE id = $1',
      [id]
    );

    return result.rows[0] || null;
  }

  /**
   * Save property for user
   */
  async savePropertyForUser(
    userId: string,
    propertyId: string,
    notes?: string,
    tags?: string[]
  ): Promise<SavedProperty> {
    const result = await query(
      `INSERT INTO user_saved_properties (user_id, property_id, notes, tags)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, property_id)
       DO UPDATE SET notes = $3, tags = $4, saved_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, propertyId, notes, tags]
    );

    return result.rows[0];
  }

  /**
   * Get user's saved properties
   */
  async getUserSavedProperties(userId: string): Promise<Property[]> {
    const result = await query(
      `SELECT p.*, usp.saved_at, usp.notes, usp.tags
       FROM properties p
       INNER JOIN user_saved_properties usp ON p.id = usp.property_id
       WHERE usp.user_id = $1
       ORDER BY usp.saved_at DESC`,
      [userId]
    );

    return result.rows;
  }

  /**
   * Remove saved property
   */
  async removeSavedProperty(userId: string, propertyId: string): Promise<boolean> {
    const result = await query(
      'DELETE FROM user_saved_properties WHERE user_id = $1 AND property_id = $2',
      [userId, propertyId]
    );

    return (result.rowCount || 0) > 0;
  }

  /**
   * Get property valuations for a user
   */
  async getUserPropertyValuations(userId: string): Promise<PropertyValuation[]> {
    const result = await query(
      `SELECT pv.*, p.address, p.city, p.state
       FROM property_valuations pv
       INNER JOIN properties p ON pv.property_id = p.id
       WHERE pv.user_id = $1
       ORDER BY pv.valuation_date DESC`,
      [userId]
    );

    return result.rows;
  }

  /**
   * Get valuation by property ID
   */
  async getPropertyValuation(propertyId: string, userId: string): Promise<PropertyValuation | null> {
    const result = await query(
      `SELECT * FROM property_valuations
       WHERE property_id = $1 AND user_id = $2
       ORDER BY valuation_date DESC
       LIMIT 1`,
      [propertyId, userId]
    );

    return result.rows[0] || null;
  }

  /**
   * Create sample properties (for development/testing)
   */
  async createSampleProperties(tenantId: string, createdBy: string): Promise<void> {
    const sampleProperties = [
      {
        address: '123 Main Street',
        city: 'Boston',
        state: 'MA',
        zipCode: '02101',
        propertyType: 'single_family',
        bedrooms: 3,
        bathrooms: 2.5,
        sqft: 2200,
        latitude: 42.3601,
        longitude: -71.0589,
        listPrice: 850000,
        photos: ['/property1.jpeg'],
        description: 'Beautiful single family home in downtown Boston'
      },
      {
        address: '456 Oak Avenue',
        city: 'Cambridge',
        state: 'MA',
        zipCode: '02138',
        propertyType: 'condo',
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1400,
        latitude: 42.3736,
        longitude: -71.1097,
        listPrice: 625000,
        photos: [],
        description: 'Modern condo near Harvard Square'
      },
      {
        address: '789 Elm Street',
        city: 'Somerville',
        state: 'MA',
        zipCode: '02144',
        propertyType: 'townhouse',
        bedrooms: 4,
        bathrooms: 3,
        sqft: 2800,
        latitude: 42.3876,
        longitude: -71.0995,
        listPrice: 975000,
        photos: [],
        description: 'Spacious townhouse with parking'
      }
    ];

    for (const prop of sampleProperties) {
      await query(
        `INSERT INTO properties (
          tenant_id, address, city, state, zip_code, country,
          property_type, bedrooms, bathrooms, sqft, latitude, longitude,
          list_price, photos, description, status, created_by, updated_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        ON CONFLICT DO NOTHING`,
        [
          tenantId,
          prop.address,
          prop.city,
          prop.state,
          prop.zipCode,
          'USA',
          prop.propertyType,
          prop.bedrooms,
          prop.bathrooms,
          prop.sqft,
          prop.latitude,
          prop.longitude,
          prop.listPrice,
          prop.photos,
          prop.description,
          'active',
          createdBy,
          createdBy
        ]
      );
    }

    logger.info('Sample properties created', { count: sampleProperties.length });
  }
}

export default new PropertyService();
