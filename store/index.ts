// Re-export all stores for cleaner imports
export { useAuthStore, getGoogleLoginUrl } from './auth';
export { useProfileStore } from './profile';
export type { UserProfile, BuyerPreferences, SellerPreferences, UserType } from './profile';

export { useBusinessStore } from './business';

export { useSearchStore, INDUSTRY_CATEGORIES, PRICE_RANGES, REVENUE_RANGES, SORT_OPTIONS } from './search';
export type { SearchFilters, SearchHistoryItem } from './search';

export { useSavedItemsStore } from './savedItems';
export type { ContactedBusiness, StarredBusiness } from './savedItems';
