// API client for property-related endpoints

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface PropertySearchParams {
  q?: string;
  city?: string;
  state?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: 'single_family' | 'condo' | 'townhouse' | 'multi_family' | 'land' | 'commercial';
  page?: number;
  pageSize?: number;
}

export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  lotSize?: number;
  yearBuilt?: number;
  latitude: number;
  longitude: number;
  neighborhood?: string;
  listPrice?: number;
  lastSalePrice?: number;
  lastSaleDate?: string;
  features?: Record<string, any>;
  photos: string[];
  description?: string;
  status: string;
  listedAt?: string;
}

export interface PropertyValuation {
  valuation_id: string;
  property: {
    id: string;
    address: string;
    city: string;
    state: string;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
  };
  estimated_value: number;
  confidence: number;
  price_range: {
    low: number;
    high: number;
  };
  comparables?: any[];
  driver_attribution?: Array<{
    driver: string;
    contribution: number;
    percentage: number;
  }>;
  valuation_date: string;
}

export interface SavedProperty extends Property {
  saved_at: string;
  notes?: string;
  tags?: string[];
}

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'API request failed');
  }

  return data;
}

export const propertyApi = {
  /**
   * Search properties with filters
   */
  async search(params: PropertySearchParams) {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = `/properties/search?${queryParams.toString()}`;
    return fetchAPI(endpoint);
  },

  /**
   * Get property by ID
   */
  async getById(id: string): Promise<{ success: boolean; data: Property }> {
    return fetchAPI(`/properties/${id}`);
  },

  /**
   * Save property for current user
   */
  async save(id: string, notes?: string, tags?: string[]): Promise<{ success: boolean; data: SavedProperty }> {
    return fetchAPI(`/properties/${id}/save`, {
      method: 'POST',
      body: JSON.stringify({ notes, tags }),
    });
  },

  /**
   * Remove saved property
   */
  async unsave(id: string): Promise<{ success: boolean }> {
    return fetchAPI(`/properties/${id}/save`, {
      method: 'DELETE',
    });
  },

  /**
   * Get user's saved properties
   */
  async getSaved(): Promise<{ success: boolean; data: SavedProperty[] }> {
    return fetchAPI('/properties/users/me/saved');
  },

  /**
   * Generate property valuation
   */
  async valuate(propertyId: string): Promise<{ success: boolean; data: PropertyValuation }> {
    return fetchAPI('/property', {
      method: 'POST',
      body: JSON.stringify({ propertyId }),
    });
  },

  /**
   * Get user's property valuations
   */
  async getValuations(): Promise<{ success: boolean; data: PropertyValuation[] }> {
    return fetchAPI('/properties/users/me/valuations');
  },

  /**
   * Get valuation history for a property
   */
  async getValuationHistory(propertyId: string): Promise<{ success: boolean; data: PropertyValuation[] }> {
    return fetchAPI(`/property/${propertyId}/history`);
  },
};
