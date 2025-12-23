import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface SearchFilters {
  industry: string;
  location: string;
  minPrice: number | null;
  maxPrice: number | null;
  minRevenue: number | null;
  maxRevenue: number | null;
  sortBy: 'relevance' | 'price_asc' | 'price_desc' | 'revenue_desc' | 'newest';
}

export interface SearchHistoryItem {
  query: string;
  filters: Partial<SearchFilters>;
  timestamp: number;
  resultCount: number;
}

interface SearchState {
  // Current search state
  query: string;
  filters: SearchFilters;
  isSearching: boolean;

  // Search history (persisted)
  searchHistory: SearchHistoryItem[];
  recentSearches: string[];

  // Actions
  setQuery: (query: string) => void;
  setFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  setSearching: (value: boolean) => void;

  // History actions
  addToHistory: (item: Omit<SearchHistoryItem, 'timestamp'>) => void;
  addRecentSearch: (query: string) => void;
  clearHistory: () => void;
  clearRecentSearches: () => void;

  // Getters
  getActiveFilterCount: () => number;
  hasActiveFilters: () => boolean;
}

const DEFAULT_FILTERS: SearchFilters = {
  industry: 'All Industries',
  location: '',
  minPrice: null,
  maxPrice: null,
  minRevenue: null,
  maxRevenue: null,
  sortBy: 'relevance',
};

const MAX_HISTORY_ITEMS = 50;
const MAX_RECENT_SEARCHES = 10;

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      // Initial state
      query: '',
      filters: { ...DEFAULT_FILTERS },
      isSearching: false,
      searchHistory: [],
      recentSearches: [],

      // Set search query
      setQuery: (query) => set({ query }),

      // Set a single filter
      setFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),

      // Set multiple filters at once
      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),

      // Reset all filters to defaults
      resetFilters: () =>
        set({
          filters: { ...DEFAULT_FILTERS },
        }),

      // Set searching state
      setSearching: (value) => set({ isSearching: value }),

      // Add search to history
      addToHistory: (item) =>
        set((state) => {
          const newItem: SearchHistoryItem = {
            ...item,
            timestamp: Date.now(),
          };

          // Avoid duplicates (same query + filters within last minute)
          const isDuplicate = state.searchHistory.some(
            (h) =>
              h.query === newItem.query &&
              JSON.stringify(h.filters) === JSON.stringify(newItem.filters) &&
              Date.now() - h.timestamp < 60000
          );

          if (isDuplicate) {
            return state;
          }

          const newHistory = [newItem, ...state.searchHistory].slice(0, MAX_HISTORY_ITEMS);
          return { searchHistory: newHistory };
        }),

      // Add to recent searches (just query strings)
      addRecentSearch: (query) =>
        set((state) => {
          const trimmed = query.trim();
          if (!trimmed) return state;

          // Remove if already exists, then add to front
          const filtered = state.recentSearches.filter((s) => s !== trimmed);
          const newRecent = [trimmed, ...filtered].slice(0, MAX_RECENT_SEARCHES);
          return { recentSearches: newRecent };
        }),

      // Clear all history
      clearHistory: () => set({ searchHistory: [] }),

      // Clear recent searches
      clearRecentSearches: () => set({ recentSearches: [] }),

      // Get count of active (non-default) filters
      getActiveFilterCount: () => {
        const { filters } = get();
        let count = 0;

        if (filters.industry !== 'All Industries') count++;
        if (filters.location) count++;
        if (filters.minPrice !== null) count++;
        if (filters.maxPrice !== null) count++;
        if (filters.minRevenue !== null) count++;
        if (filters.maxRevenue !== null) count++;
        if (filters.sortBy !== 'relevance') count++;

        return count;
      },

      // Check if any filters are active
      hasActiveFilters: () => {
        return get().getActiveFilterCount() > 0;
      },
    }),
    {
      name: 'search-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist history, not current search state
      partialize: (state) => ({
        searchHistory: state.searchHistory,
        recentSearches: state.recentSearches,
      }),
    }
  )
);

// Industry categories for consistent use across the app
export const INDUSTRY_CATEGORIES = [
  'All Industries',
  'SaaS & Software',
  'E-commerce',
  'Healthcare',
  'Manufacturing',
  'Food & Beverage',
  'Professional Services',
  'Technology',
  'Real Estate',
  'Retail',
  'Construction',
  'Transportation',
  'Education',
  'Entertainment',
] as const;

// Price range options for dropdowns
export const PRICE_RANGES = [
  { label: 'Any', min: null, max: null },
  { label: 'Under $500K', min: 0, max: 500000 },
  { label: '$500K - $1M', min: 500000, max: 1000000 },
  { label: '$1M - $5M', min: 1000000, max: 5000000 },
  { label: '$5M - $10M', min: 5000000, max: 10000000 },
  { label: 'Over $10M', min: 10000000, max: null },
] as const;

// Revenue range options for dropdowns
export const REVENUE_RANGES = [
  { label: 'Any', min: null, max: null },
  { label: 'Under $500K', min: 0, max: 500000 },
  { label: '$500K - $1M', min: 500000, max: 1000000 },
  { label: '$1M - $3M', min: 1000000, max: 3000000 },
  { label: '$3M - $10M', min: 3000000, max: 10000000 },
  { label: 'Over $10M', min: 10000000, max: null },
] as const;

// Sort options
export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'revenue_desc', label: 'Highest Revenue' },
  { value: 'newest', label: 'Newest First' },
] as const;
