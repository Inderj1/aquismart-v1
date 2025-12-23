import { create } from 'zustand';
import { Business, BusinessSearchParams, businessApi } from '@/lib/api/businesses';

interface BusinessState {
  // State
  businesses: Business[];
  featuredBusinesses: Business[];
  matchedBusinesses: Business[];
  currentBusiness: Business | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;

  // Cache settings
  cacheExpiry: number; // milliseconds

  // Actions
  setBusinesses: (businesses: Business[]) => void;
  setFeaturedBusinesses: (businesses: Business[]) => void;
  setMatchedBusinesses: (businesses: Business[]) => void;
  setCurrentBusiness: (business: Business | null) => void;
  setLoading: (value: boolean) => void;
  setError: (error: string | null) => void;

  // Business operations
  fetchBusinesses: (params?: BusinessSearchParams, force?: boolean) => Promise<void>;
  fetchBusinessById: (id: string) => Promise<Business | null>;
  fetchMatches: () => Promise<void>;
  refreshBusinesses: () => Promise<void>;

  // Cache helpers
  isCacheValid: () => boolean;
  clearCache: () => void;

  // Computed
  getBusinessById: (id: string) => Business | undefined;
  getBusinessesByIndustry: (industry: string) => Business[];
  getFeaturedCount: () => number;
}

export const useBusinessStore = create<BusinessState>()((set, get) => ({
  // Initial state
  businesses: [],
  featuredBusinesses: [],
  matchedBusinesses: [],
  currentBusiness: null,
  isLoading: false,
  error: null,
  lastFetched: null,
  cacheExpiry: 5 * 60 * 1000, // 5 minutes

  // Basic setters
  setBusinesses: (businesses) => set({ businesses, lastFetched: Date.now() }),
  setFeaturedBusinesses: (businesses) => set({ featuredBusinesses: businesses }),
  setMatchedBusinesses: (businesses) => set({ matchedBusinesses: businesses }),
  setCurrentBusiness: (business) => set({ currentBusiness: business }),
  setLoading: (value) => set({ isLoading: value }),
  setError: (error) => set({ error }),

  // Check if cache is still valid
  isCacheValid: () => {
    const { lastFetched, cacheExpiry, businesses } = get();
    if (!lastFetched || businesses.length === 0) return false;
    return Date.now() - lastFetched < cacheExpiry;
  },

  // Clear cache
  clearCache: () => {
    set({
      businesses: [],
      featuredBusinesses: [],
      matchedBusinesses: [],
      currentBusiness: null,
      lastFetched: null,
    });
  },

  // Fetch businesses with caching
  fetchBusinesses: async (params?: BusinessSearchParams, force = false) => {
    const state = get();

    // Return cached data if valid and no specific params
    if (!force && !params && state.isCacheValid()) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await businessApi.search(params || {});

      if (response.success) {
        const businesses = response.data;

        set({
          businesses,
          featuredBusinesses: businesses.filter((b: Business) => b.isFeatured),
          lastFetched: Date.now(),
        });
      } else {
        throw new Error('Failed to fetch businesses');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load businesses';
      set({ error: message });
      console.error('Error fetching businesses:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch single business by ID
  fetchBusinessById: async (id: string) => {
    // First check if we have it in cache
    const cached = get().getBusinessById(id);
    if (cached) {
      set({ currentBusiness: cached });
      return cached;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await businessApi.getById(id);

      if (response.success) {
        set({ currentBusiness: response.data });
        return response.data;
      } else {
        throw new Error('Business not found');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load business';
      set({ error: message });
      console.error('Error fetching business:', error);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch AI-matched businesses
  fetchMatches: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await businessApi.getMatches();

      if (response.success) {
        set({ matchedBusinesses: response.data });
      } else {
        throw new Error('Failed to fetch matches');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load matches';
      set({ error: message });
      console.error('Error fetching matches:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Force refresh businesses
  refreshBusinesses: async () => {
    await get().fetchBusinesses(undefined, true);
  },

  // Get business by ID from cache
  getBusinessById: (id: string) => {
    const { businesses, matchedBusinesses } = get();
    return (
      businesses.find((b) => b.id === id) ||
      matchedBusinesses.find((b) => b.id === id)
    );
  },

  // Get businesses by industry
  getBusinessesByIndustry: (industry: string) => {
    return get().businesses.filter(
      (b) => b.industry.toLowerCase() === industry.toLowerCase()
    );
  },

  // Get featured count
  getFeaturedCount: () => {
    return get().featuredBusinesses.length;
  },
}));
