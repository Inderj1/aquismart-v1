import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:15000';

// Cookie options for secure token storage
const COOKIE_OPTIONS = {
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
};

export interface AuthTokens {
  access_token: string;
  id_token: string;
  refresh_token?: string;
  expires_in: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user_sub?: string;
  tokens?: AuthTokens;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'buyer' | 'seller' | 'admin';
  email_verified: boolean;
}

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  setError: (error: string | null) => void;

  // Auth operations
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<AuthResponse>;
  verifyEmail: (email: string, code: string) => Promise<AuthResponse>;
  forgotPassword: (email: string) => Promise<AuthResponse>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<AuthResponse>;
  logout: () => void;
  refreshTokens: () => Promise<AuthResponse>;
  fetchCurrentUser: () => Promise<void>;

  // Token helpers
  getAccessToken: () => string | null;
  getIdToken: () => string | null;
  setTokens: (tokens: AuthTokens) => void;
  clearTokens: () => void;

  // Initialize auth state from cookies
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Basic setters
      setUser: (user) => set({ user }),
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      setLoading: (value) => set({ isLoading: value }),
      setError: (error) => set({ error }),

      // Token helpers
      getAccessToken: () => {
        if (typeof window === 'undefined') return null;
        return getCookie('access_token') as string | null;
      },

      getIdToken: () => {
        if (typeof window === 'undefined') return null;
        return getCookie('id_token') as string | null;
      },

      setTokens: (tokens: AuthTokens) => {
        setCookie('access_token', tokens.access_token, COOKIE_OPTIONS);
        setCookie('id_token', tokens.id_token, COOKIE_OPTIONS);
        if (tokens.refresh_token) {
          setCookie('refresh_token', tokens.refresh_token, {
            ...COOKIE_OPTIONS,
            maxAge: 60 * 60 * 24 * 30, // 30 days for refresh token
          });
        }
        set({ isAuthenticated: true });
      },

      clearTokens: () => {
        deleteCookie('access_token');
        deleteCookie('id_token');
        deleteCookie('refresh_token');
        deleteCookie('user_email');
        set({ isAuthenticated: false, user: null });
      },

      // Initialize auth state from cookies on app load
      initializeAuth: () => {
        if (typeof window === 'undefined') return;
        const accessToken = getCookie('access_token');
        if (accessToken) {
          set({ isAuthenticated: true });
          // Optionally fetch user data
          get().fetchCurrentUser();
        }
      },

      // Login with email and password
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          const data: AuthResponse = await response.json();

          if (data.success && data.tokens) {
            get().setTokens(data.tokens);
            setCookie('user_email', email, COOKIE_OPTIONS);
            await get().fetchCurrentUser();
          } else {
            set({ error: data.message });
          }

          set({ isLoading: false });
          return data;
        } catch (error) {
          const message = 'An error occurred during login';
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },

      // Register a new user
      register: async (email: string, password: string, firstName: string, lastName: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/api/v1/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              password,
              first_name: firstName,
              last_name: lastName,
            }),
          });

          const data: AuthResponse = await response.json();

          if (!data.success) {
            set({ error: data.message });
          }

          set({ isLoading: false });
          return data;
        } catch (error) {
          const message = 'An error occurred during registration';
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },

      // Verify email with code
      verifyEmail: async (email: string, code: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/api/v1/auth/verify-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              confirmation_code: code,
            }),
          });

          const data: AuthResponse = await response.json();

          if (!data.success) {
            set({ error: data.message });
          }

          set({ isLoading: false });
          return data;
        } catch (error) {
          const message = 'An error occurred during verification';
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },

      // Forgot password
      forgotPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/api/v1/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });

          const data: AuthResponse = await response.json();
          set({ isLoading: false });
          return data;
        } catch (error) {
          const message = 'An error occurred';
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },

      // Reset password with code
      resetPassword: async (email: string, code: string, newPassword: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/api/v1/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              confirmation_code: code,
              new_password: newPassword,
            }),
          });

          const data: AuthResponse = await response.json();

          if (!data.success) {
            set({ error: data.message });
          }

          set({ isLoading: false });
          return data;
        } catch (error) {
          const message = 'An error occurred during password reset';
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },

      // Refresh tokens
      refreshTokens: async () => {
        const refreshToken = getCookie('refresh_token');
        const email = getCookie('user_email');

        if (!refreshToken || !email) {
          return { success: false, message: 'No refresh token available' };
        }

        try {
          const response = await fetch(`${API_URL}/api/v1/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              refresh_token: refreshToken,
              email,
            }),
          });

          const data: AuthResponse = await response.json();

          if (data.success && data.tokens) {
            get().setTokens(data.tokens);
          }

          return data;
        } catch (error) {
          return { success: false, message: 'Token refresh failed' };
        }
      },

      // Fetch current user
      fetchCurrentUser: async () => {
        const token = get().getAccessToken();
        if (!token) return;

        try {
          const response = await fetch(`${API_URL}/api/v1/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const user = await response.json();
            set({ user });
          }
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      },

      // Logout
      logout: () => {
        get().clearTokens();
        set({ user: null, isAuthenticated: false, error: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          if (typeof window === 'undefined') return null;
          // We store minimal state in localStorage, tokens are in cookies
          const value = localStorage.getItem(name);
          return value;
        },
        setItem: (name, value) => {
          if (typeof window === 'undefined') return;
          localStorage.setItem(name, value);
        },
        removeItem: (name) => {
          if (typeof window === 'undefined') return;
          localStorage.removeItem(name);
        },
      })),
      partialize: (state) => ({
        // Only persist these fields to localStorage (not tokens)
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Helper function to get Google OAuth URL
export function getGoogleLoginUrl(): string {
  const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN || 'us-east-1xabukafza.auth.us-east-1.amazoncognito.com';
  const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '3g0vsnud4safnmik59vlu72h5n';
  const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI || 'http://localhost:3344/auth/callback');

  return `https://${cognitoDomain}/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&identity_provider=Google&scope=openid+email+profile`;
}
