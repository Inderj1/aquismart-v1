// Auth service for connecting to the backend API

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:15000';

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

// Register a new user
export async function register(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<AuthResponse> {
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

  return response.json();
}

// Verify email with code
export async function verifyEmail(email: string, code: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/v1/auth/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      confirmation_code: code,
    }),
  });

  return response.json();
}

// Login with email and password
export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (data.success && data.tokens) {
    // Store tokens
    localStorage.setItem('access_token', data.tokens.access_token);
    localStorage.setItem('id_token', data.tokens.id_token);
    if (data.tokens.refresh_token) {
      localStorage.setItem('refresh_token', data.tokens.refresh_token);
    }
    localStorage.setItem('isLoggedIn', 'true');
  }

  return data;
}

// Forgot password
export async function forgotPassword(email: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/v1/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  return response.json();
}

// Reset password with code
export async function resetPassword(
  email: string,
  code: string,
  newPassword: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/v1/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      confirmation_code: code,
      new_password: newPassword,
    }),
  });

  return response.json();
}

// Refresh tokens
export async function refreshTokens(): Promise<AuthResponse> {
  const refreshToken = localStorage.getItem('refresh_token');
  const email = localStorage.getItem('user_email');

  if (!refreshToken || !email) {
    return { success: false, message: 'No refresh token available' };
  }

  const response = await fetch(`${API_URL}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      refresh_token: refreshToken,
      email,
    }),
  });

  const data = await response.json();

  if (data.success && data.tokens) {
    localStorage.setItem('access_token', data.tokens.access_token);
    localStorage.setItem('id_token', data.tokens.id_token);
  }

  return data;
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  const token = localStorage.getItem('access_token');
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/api/v1/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

// Logout
export function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('id_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('user_email');
  localStorage.removeItem('userType');
}

// Check if logged in
export function isLoggedIn(): boolean {
  return localStorage.getItem('isLoggedIn') === 'true' && !!localStorage.getItem('access_token');
}

// Get Google OAuth URL
export function getGoogleLoginUrl(): string {
  const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN || 'us-east-1xabukafza.auth.us-east-1.amazoncognito.com';
  const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '3g0vsnud4safnmik59vlu72h5n';
  const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI || 'http://localhost:3344/auth/callback');

  return `https://${cognitoDomain}/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&identity_provider=Google&scope=openid+email+profile`;
}
