import { axiosInstance } from '../lib/axios';
import { setCookie, deleteCookie, getCookie } from 'cookies-next';

// User type
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// Auth tokens type
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Login credentials type
export interface LoginCredentials {
  email: string;
  password: string;
}

// Register credentials type
export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

// Auth response type
export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// Forgot password credentials type
export interface ForgotPasswordCredentials {
  email: string;
}

// Reset password credentials type
export interface ResetPasswordCredentials {
  token: string;
  password: string;
}

// Server auth response type
export interface ServerAuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Register request type
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// Login request type
export interface LoginRequest {
  email: string;
  password: string;
}

// Refresh token request type
export interface RefreshTokenRequest {
  refreshToken: string;
}

// Forgot password request type
export interface ForgotPasswordRequest {
  email: string;
}

// Verify email request type
export interface VerifyEmailRequest {
  token: string;
}

// Reset password request type
export interface ResetPasswordRequest {
  token: string;
  password: string;
}

/**
 * Login user with email and password
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<ServerAuthResponse>('/auth/login', credentials);

    // Store tokens in cookies
    setCookie('authToken', response.data.accessToken);
    setCookie('refreshToken', response.data.refreshToken);

    return {
      user: response.data.user,
      tokens: {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken
      }
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Register new user
 */
export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<ServerAuthResponse>('/auth/register', credentials);

    // Store tokens in cookies
    setCookie('authToken', response.data.accessToken);
    setCookie('refreshToken', response.data.refreshToken);

    return {
      user: response.data.user,
      tokens: {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken
      }
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Logout user
 */
export const logout = async (accessToken: string): Promise<void> => {
  try {
    await axiosInstance.post('/auth/logout', null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Clear cookies
    deleteCookie('authToken');
    deleteCookie('refreshToken');
  } catch (error) {
    throw error;
  }
};

/**
 * Refresh access token
 */
export const refreshToken = async (refreshToken: string): Promise<AuthTokens> => {
  try {
    const response = await axiosInstance.post<AuthTokens>('/auth/refresh', { refreshToken });

    // Update tokens in cookies
    setCookie('authToken', response.data.accessToken);
    setCookie('refreshToken', response.data.refreshToken);

    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Request password reset
 */
export const forgotPassword = async (credentials: ForgotPasswordCredentials): Promise<void> => {
  try {
    await axiosInstance.post('/auth/forgot-password', credentials);
  } catch (error) {
    throw error;
  }
};

/**
 * Reset password with token
 */
export const resetPassword = async (credentials: ResetPasswordRequest): Promise<void> => {
  try {
    await axiosInstance.post('/auth/reset-password', credentials);
  } catch (error) {
    throw error;
  }
};

/**
 * Verify email with token
 */
export const verifyEmail = async (token: string): Promise<void> => {
  try {
    await axiosInstance.post('/auth/verify-email', { token });
  } catch (error) {
    throw error;
  }
};

// Auth service functions
export const authService = {
  // Register a new user
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  // Login user
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', data);

    // Store tokens in cookies
    setCookie('authToken', response.data.tokens.accessToken);
    setCookie('refreshToken', response.data.tokens.refreshToken);

    return response.data;
  },

  // Refresh token
  async refreshToken(data: RefreshTokenRequest): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>('/auth/refresh', data);

    // Update tokens in cookies
    setCookie('authToken', response.data.tokens.accessToken);
    setCookie('refreshToken', response.data.tokens.refreshToken);

    return response.data;
  },

  // Logout
  async logout(): Promise<void> {
    const refreshToken = getCookie('refreshToken');
    await axiosInstance.post('/auth/logout', { refreshToken });

    // Clear tokens from cookies
    deleteCookie('authToken');
    deleteCookie('refreshToken');
  },

  // Verify email
  async verifyEmail(data: VerifyEmailRequest): Promise<void> {
    await axiosInstance.post('/auth/verify-email', data);
  },

  // Forgot password
  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    await axiosInstance.post('/auth/forgot-password', data);
  },

  // Reset password
  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    await axiosInstance.post('/auth/reset-password', data);
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!getCookie('authToken');
  }
}; 