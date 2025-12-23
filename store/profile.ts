import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type UserType = 'buyer' | 'seller' | '';

export interface BuyerPreferences {
  budget?: string;
  industries?: string;
  location?: string;
  businessSize?: string;
  revenuePreference?: string;
  profitability?: string;
  involvement?: string;
  timeline?: string;
  experience?: string;
  financing?: string;
}

export interface SellerPreferences {
  businessType?: string;
  yearsInBusiness?: string;
  businessSize?: string;
  revenue?: string;
  profitMargin?: string;
  askingPrice?: string;
  growthTrend?: string;
  timeline?: string;
  reason?: string;
  involvement?: string;
}

export interface UserProfile {
  id?: string;
  userType: UserType;
  industry?: string;
  location?: string;
  budgetMin?: number;
  budgetMax?: number;
  experienceLevel?: string;
  buyerPreferences?: BuyerPreferences;
  sellerPreferences?: SellerPreferences;
  onboardingCompleted?: boolean;
  expertModeCompleted?: boolean;
}

interface ProfileState {
  // State
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setProfile: (profile: UserProfile | null) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setLoading: (value: boolean) => void;
  setError: (error: string | null) => void;

  // Profile operations
  initializeProfile: () => void;
  saveOnboardingData: (data: Record<string, any>) => void;
  saveExpertModeData: (data: Record<string, any>) => void;
  clearProfile: () => void;

  // Getters
  hasProfile: () => boolean;
  isBuyer: () => boolean;
  isSeller: () => boolean;
  getBudgetRange: () => { min: number; max: number } | null;
}

// Budget string to numeric range mapping
const budgetRanges: Record<string, { min: number; max: number }> = {
  'Under $500K': { min: 0, max: 500000 },
  '$500K - $1M': { min: 500000, max: 1000000 },
  '$1M - $5M': { min: 1000000, max: 5000000 },
  '$5M - $10M': { min: 5000000, max: 10000000 },
  'Over $10M': { min: 10000000, max: Infinity },
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      // Initial state
      profile: null,
      isLoading: false,
      error: null,

      // Basic setters
      setProfile: (profile) => set({ profile }),
      updateProfile: (updates) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : updates as UserProfile,
        })),
      setLoading: (value) => set({ isLoading: value }),
      setError: (error) => set({ error }),

      // Initialize profile from legacy localStorage data
      initializeProfile: () => {
        if (typeof window === 'undefined') return;

        const currentProfile = get().profile;
        if (currentProfile) return; // Already initialized

        // Try to migrate from legacy localStorage
        const welcomeProfile = localStorage.getItem('welcomeProfile');
        const buyerProfile = localStorage.getItem('buyerProfile');
        const expertModeProfile = localStorage.getItem('expertModeProfile');

        let profile: UserProfile | null = null;

        if (welcomeProfile) {
          try {
            const data = JSON.parse(welcomeProfile);
            profile = {
              userType: data.userType || '',
              buyerPreferences: data.userType === 'buyer' ? data : undefined,
              sellerPreferences: data.userType === 'seller' ? data : undefined,
              onboardingCompleted: true,
            };
          } catch (e) {
            console.error('Failed to parse welcomeProfile:', e);
          }
        }

        if (buyerProfile) {
          try {
            const data = JSON.parse(buyerProfile);
            profile = {
              ...profile,
              id: data.id,
              userType: data.userType || 'buyer',
              industry: data.industry,
              location: data.location,
            };
          } catch (e) {
            console.error('Failed to parse buyerProfile:', e);
          }
        }

        if (expertModeProfile) {
          try {
            const data = JSON.parse(expertModeProfile);
            profile = {
              ...(profile || { userType: 'buyer' as UserType }),
              expertModeCompleted: true,
              buyerPreferences: {
                ...profile?.buyerPreferences,
                ...data,
              },
            };
          } catch (e) {
            console.error('Failed to parse expertModeProfile:', e);
          }
        }

        if (profile) {
          set({ profile });
        }
      },

      // Save onboarding questionnaire data
      saveOnboardingData: (data) => {
        const userType = data.userType as UserType;

        const profile: UserProfile = {
          userType,
          industry: data.industries || data.businessType,
          location: data.location,
          onboardingCompleted: true,
          buyerPreferences: userType === 'buyer' ? {
            budget: data.budget,
            industries: data.industries,
            location: data.location,
            businessSize: data.businessSize,
            revenuePreference: data.revenuePreference,
            profitability: data.profitability,
            involvement: data.involvement,
            timeline: data.timeline,
            experience: data.experience,
            financing: data.financing,
          } : undefined,
          sellerPreferences: userType === 'seller' ? {
            businessType: data.businessType,
            yearsInBusiness: data.yearsInBusiness,
            businessSize: data.businessSize,
            revenue: data.revenue,
            profitMargin: data.profitMargin,
            askingPrice: data.askingPrice,
            growthTrend: data.growthTrend,
            timeline: data.timeline,
            reason: data.reason,
            involvement: data.involvement,
          } : undefined,
        };

        // Set budget range for buyers
        if (userType === 'buyer' && data.budget && budgetRanges[data.budget]) {
          profile.budgetMin = budgetRanges[data.budget].min;
          profile.budgetMax = budgetRanges[data.budget].max;
        }

        set({ profile });

        // Also save to legacy localStorage for backwards compatibility
        if (typeof window !== 'undefined') {
          localStorage.setItem('welcomeProfile', JSON.stringify(data));
          if (userType === 'buyer') {
            localStorage.setItem('buyerProfile', JSON.stringify({
              id: 'profile-' + Date.now(),
              userType,
              industry: data.industries,
              location: data.location,
            }));
          }
        }
      },

      // Save expert mode questionnaire data
      saveExpertModeData: (data) => {
        set((state) => ({
          profile: state.profile ? {
            ...state.profile,
            expertModeCompleted: true,
            buyerPreferences: {
              ...state.profile.buyerPreferences,
              ...data,
            },
          } : {
            userType: 'buyer',
            expertModeCompleted: true,
            buyerPreferences: data,
          },
        }));

        // Also save to legacy localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('expertModeProfile', JSON.stringify(data));
        }
      },

      // Clear profile
      clearProfile: () => {
        set({ profile: null, error: null });

        // Also clear legacy localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('welcomeProfile');
          localStorage.removeItem('buyerProfile');
          localStorage.removeItem('expertModeProfile');
        }
      },

      // Getters
      hasProfile: () => {
        const profile = get().profile;
        return !!(profile && profile.userType);
      },

      isBuyer: () => {
        const profile = get().profile;
        return profile?.userType === 'buyer';
      },

      isSeller: () => {
        const profile = get().profile;
        return profile?.userType === 'seller';
      },

      getBudgetRange: () => {
        const profile = get().profile;
        if (!profile) return null;

        if (profile.budgetMin !== undefined && profile.budgetMax !== undefined) {
          return { min: profile.budgetMin, max: profile.budgetMax };
        }

        const budgetStr = profile.buyerPreferences?.budget;
        if (budgetStr && budgetRanges[budgetStr]) {
          return budgetRanges[budgetStr];
        }

        return null;
      },
    }),
    {
      name: 'profile-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
