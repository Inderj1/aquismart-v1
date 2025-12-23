import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Business, SavedBusiness, businessApi } from '@/lib/api/businesses';

export interface ContactedBusiness extends Business {
  contacted_at: string;
  last_message_at?: string;
  inquiry_status?: 'pending' | 'responded' | 'in_progress' | 'closed';
}

export interface StarredBusiness extends Business {
  starred_at: string;
  priority?: 'high' | 'medium' | 'low';
}

interface SavedItemsState {
  // State
  savedBusinesses: SavedBusiness[];
  contactedBusinesses: ContactedBusiness[];
  starredBusinesses: StarredBusiness[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;

  // Actions
  setSavedBusinesses: (businesses: SavedBusiness[]) => void;
  setContactedBusinesses: (businesses: ContactedBusiness[]) => void;
  setStarredBusinesses: (businesses: StarredBusiness[]) => void;
  setLoading: (value: boolean) => void;
  setError: (error: string | null) => void;

  // Business operations
  fetchSavedBusinesses: () => Promise<void>;
  saveBusiness: (businessId: string, notes?: string, tags?: string[]) => Promise<boolean>;
  unsaveBusiness: (businessId: string) => Promise<boolean>;
  toggleSaved: (business: Business) => Promise<boolean>;

  // Starred operations (local-only for now)
  starBusiness: (business: Business, priority?: 'high' | 'medium' | 'low') => void;
  unstarBusiness: (businessId: string) => void;
  toggleStarred: (business: Business) => void;

  // Contacted operations (local tracking until backend supports it)
  markAsContacted: (business: Business) => void;
  updateContactStatus: (businessId: string, status: ContactedBusiness['inquiry_status']) => void;

  // Notes and tags
  updateBusinessNotes: (businessId: string, notes: string) => Promise<boolean>;
  updateBusinessTags: (businessId: string, tags: string[]) => Promise<boolean>;

  // Getters
  isSaved: (businessId: string) => boolean;
  isStarred: (businessId: string) => boolean;
  isContacted: (businessId: string) => boolean;
  getSavedCount: () => number;
  getStarredCount: () => number;
  getContactedCount: () => number;

  // Clear
  clearAll: () => void;
}

export const useSavedItemsStore = create<SavedItemsState>()(
  persist(
    (set, get) => ({
      // Initial state
      savedBusinesses: [],
      contactedBusinesses: [],
      starredBusinesses: [],
      isLoading: false,
      error: null,
      lastFetched: null,

      // Basic setters
      setSavedBusinesses: (businesses) => set({ savedBusinesses: businesses }),
      setContactedBusinesses: (businesses) => set({ contactedBusinesses: businesses }),
      setStarredBusinesses: (businesses) => set({ starredBusinesses: businesses }),
      setLoading: (value) => set({ isLoading: value }),
      setError: (error) => set({ error }),

      // Fetch saved businesses from API
      fetchSavedBusinesses: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await businessApi.getSaved();

          if (response.success) {
            set({
              savedBusinesses: response.data,
              lastFetched: Date.now(),
            });
          } else {
            throw new Error('Failed to fetch saved businesses');
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to load saved businesses';
          set({ error: message });
          console.error('Error fetching saved businesses:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      // Save a business
      saveBusiness: async (businessId, notes, tags) => {
        set({ isLoading: true, error: null });

        try {
          const response = await businessApi.save(businessId, notes, tags);

          if (response.success) {
            set((state) => ({
              savedBusinesses: [...state.savedBusinesses, response.data],
            }));
            return true;
          }
          return false;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to save business';
          set({ error: message });
          console.error('Error saving business:', error);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      // Unsave a business
      unsaveBusiness: async (businessId) => {
        set({ isLoading: true, error: null });

        try {
          const response = await businessApi.unsave(businessId);

          if (response.success) {
            set((state) => ({
              savedBusinesses: state.savedBusinesses.filter((b) => b.id !== businessId),
            }));
            return true;
          }
          return false;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to unsave business';
          set({ error: message });
          console.error('Error unsaving business:', error);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      // Toggle saved state
      toggleSaved: async (business) => {
        const { isSaved, saveBusiness, unsaveBusiness } = get();

        if (isSaved(business.id)) {
          return await unsaveBusiness(business.id);
        } else {
          return await saveBusiness(business.id);
        }
      },

      // Star a business (local)
      starBusiness: (business, priority = 'medium') => {
        const { isStarred } = get();
        if (isStarred(business.id)) return;

        const starredBusiness: StarredBusiness = {
          ...business,
          starred_at: new Date().toISOString(),
          priority,
        };

        set((state) => ({
          starredBusinesses: [...state.starredBusinesses, starredBusiness],
        }));
      },

      // Unstar a business (local)
      unstarBusiness: (businessId) => {
        set((state) => ({
          starredBusinesses: state.starredBusinesses.filter((b) => b.id !== businessId),
        }));
      },

      // Toggle starred state
      toggleStarred: (business) => {
        const { isStarred, starBusiness, unstarBusiness } = get();

        if (isStarred(business.id)) {
          unstarBusiness(business.id);
        } else {
          starBusiness(business);
        }
      },

      // Mark as contacted (local)
      markAsContacted: (business) => {
        const { isContacted } = get();
        if (isContacted(business.id)) return;

        const contactedBusiness: ContactedBusiness = {
          ...business,
          contacted_at: new Date().toISOString(),
          inquiry_status: 'pending',
        };

        set((state) => ({
          contactedBusinesses: [...state.contactedBusinesses, contactedBusiness],
        }));
      },

      // Update contact status
      updateContactStatus: (businessId, status) => {
        set((state) => ({
          contactedBusinesses: state.contactedBusinesses.map((b) =>
            b.id === businessId
              ? { ...b, inquiry_status: status, last_message_at: new Date().toISOString() }
              : b
          ),
        }));
      },

      // Update notes for a saved business
      updateBusinessNotes: async (businessId, notes) => {
        try {
          // Re-save with updated notes
          const business = get().savedBusinesses.find((b) => b.id === businessId);
          if (!business) return false;

          const response = await businessApi.save(businessId, notes, business.tags);
          if (response.success) {
            set((state) => ({
              savedBusinesses: state.savedBusinesses.map((b) =>
                b.id === businessId ? { ...b, notes } : b
              ),
            }));
            return true;
          }
          return false;
        } catch (error) {
          console.error('Error updating notes:', error);
          return false;
        }
      },

      // Update tags for a saved business
      updateBusinessTags: async (businessId, tags) => {
        try {
          const business = get().savedBusinesses.find((b) => b.id === businessId);
          if (!business) return false;

          const response = await businessApi.save(businessId, business.notes, tags);
          if (response.success) {
            set((state) => ({
              savedBusinesses: state.savedBusinesses.map((b) =>
                b.id === businessId ? { ...b, tags } : b
              ),
            }));
            return true;
          }
          return false;
        } catch (error) {
          console.error('Error updating tags:', error);
          return false;
        }
      },

      // Check if a business is saved
      isSaved: (businessId) => {
        return get().savedBusinesses.some((b) => b.id === businessId);
      },

      // Check if a business is starred
      isStarred: (businessId) => {
        return get().starredBusinesses.some((b) => b.id === businessId);
      },

      // Check if a business has been contacted
      isContacted: (businessId) => {
        return get().contactedBusinesses.some((b) => b.id === businessId);
      },

      // Get counts
      getSavedCount: () => get().savedBusinesses.length,
      getStarredCount: () => get().starredBusinesses.length,
      getContactedCount: () => get().contactedBusinesses.length,

      // Clear all saved items
      clearAll: () => {
        set({
          savedBusinesses: [],
          contactedBusinesses: [],
          starredBusinesses: [],
          error: null,
          lastFetched: null,
        });
      },
    }),
    {
      name: 'saved-items-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist starred and contacted (saved comes from API)
      partialize: (state) => ({
        starredBusinesses: state.starredBusinesses,
        contactedBusinesses: state.contactedBusinesses,
      }),
    }
  )
);
