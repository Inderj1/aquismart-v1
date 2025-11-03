// API client for business/deal-related endpoints

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export interface BusinessSearchParams {
  q?: string;
  industry?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minRevenue?: number;
  maxRevenue?: number;
  page?: number;
  pageSize?: number;
}

export interface Business {
  id: string;
  name: string;
  industry: string;
  location: string;
  askingPrice: number;
  revenue: number;
  ebitda?: number;
  description: string;
  yearEstablished: number;
  employees?: number;
  matchScore?: number;
  isFeatured?: boolean;
  images?: string[];
  financials?: {
    cashFlow?: number;
    assets?: number;
    liabilities?: number;
  };
  highlights?: string[];
  reasonForSelling?: string;
  status: 'active' | 'pending' | 'sold';
}

export interface SavedBusiness extends Business {
  saved_at: string;
  notes?: string;
  tags?: string[];
}

export interface BuyerProfile {
  id: string;
  userType: 'buy' | 'sell';
  industry: string;
  location: string;
  budgetMin?: number;
  budgetMax?: number;
  experienceLevel?: string;
  preferences?: Record<string, any>;
}

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  // Handle both server-side and client-side requests
  let url: string;
  if (typeof window === 'undefined') {
    // Server-side: use localhost
    url = `http://localhost:3344/api${endpoint}`;
  } else {
    // Client-side: use relative URL
    url = `/api${endpoint}`;
  }

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

export const businessApi = {
  /**
   * Search businesses with filters
   */
  async search(params: BusinessSearchParams) {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = `/businesses/search?${queryParams.toString()}`;
    return fetchAPI(endpoint);
  },

  /**
   * Get business by ID
   */
  async getById(id: string): Promise<{ success: boolean; data: Business }> {
    return fetchAPI(`/businesses/${id}`);
  },

  /**
   * Get AI-matched businesses for buyer
   */
  async getMatches(): Promise<{ success: boolean; data: Business[] }> {
    return fetchAPI('/businesses/matches');
  },

  /**
   * Save business for current user
   */
  async save(id: string, notes?: string, tags?: string[]): Promise<{ success: boolean; data: SavedBusiness }> {
    return fetchAPI(`/businesses/${id}/save`, {
      method: 'POST',
      body: JSON.stringify({ notes, tags }),
    });
  },

  /**
   * Remove saved business
   */
  async unsave(id: string): Promise<{ success: boolean }> {
    return fetchAPI(`/businesses/${id}/save`, {
      method: 'DELETE',
    });
  },

  /**
   * Get user's saved businesses
   */
  async getSaved(): Promise<{ success: boolean; data: SavedBusiness[] }> {
    return fetchAPI('/businesses/saved');
  },

  /**
   * Express interest in a business
   */
  async expressInterest(id: string, message?: string): Promise<{ success: boolean }> {
    return fetchAPI(`/businesses/${id}/interest`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  /**
   * Get buyer profile
   */
  async getBuyerProfile(): Promise<{ success: boolean; data: BuyerProfile }> {
    return fetchAPI('/businesses/users/me/profile');
  },

  /**
   * Update buyer profile
   */
  async updateBuyerProfile(profile: Partial<BuyerProfile>): Promise<{ success: boolean; data: BuyerProfile }> {
    return fetchAPI('/businesses/users/me/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  },

  /**
   * Create buyer profile from onboarding
   */
  async createBuyerProfile(profile: Partial<BuyerProfile>): Promise<{ success: boolean; data: BuyerProfile }> {
    return fetchAPI('/businesses/users/me/profile', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
  },
};
