import axiosInstance from '../lib/axios';
import { setCookie, deleteCookie, getCookie } from 'cookies-next';
import { LoginCredentials, RegisterCredentials, AuthResponse, ForgotPasswordCredentials, ResetPasswordCredentials, AuthTokens } from '@/types/auth';

// User type
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// Auth response type
export interface AuthResponse {
  user: User;
  token: string;
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

// Reset password request type
export interface ResetPasswordRequest {
  token: string;
  password: string;
}

// Verify email request type
export interface VerifyEmailRequest {
  token: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

/**
 * Authenticates a user with email and password
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Falha no login');
  }

  return response.json();
};

/**
 * Registers a new user
 */
export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Falha no registro');
  }

  return response.json();
};

/**
 * Refreshes the authentication token
 */
export const refreshToken = async (refreshToken: string): Promise<AuthTokens> => {
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Falha ao atualizar o token');
  }

  return response.json();
};

/**
 * Logs out the user
 */
export const logout = async (refreshToken: string, accessToken: string): Promise<void> => {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Falha ao fazer logout');
  }
};

/**
 * Sends a password reset email
 */
export const forgotPassword = async (credentials: ForgotPasswordCredentials): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Falha ao enviar email de recuperação');
  }

  return {
    success: true,
    message: 'Email de recuperação enviado com sucesso'
  };
};

/**
 * Resets the user's password
 */
export const resetPassword = async (credentials: ResetPasswordCredentials): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Falha ao redefinir a senha');
  }

  return {
    success: true,
    message: 'Senha redefinida com sucesso'
  };
};

/**
 * Verifies the user's email
 */
export const verifyEmail = async (credentials: { token: string }): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${API_URL}/auth/verify-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Falha na verificação do email');
  }

  return {
    success: true,
    message: 'Email verificado com sucesso'
  };
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
    setCookie('authToken', response.data.token);
    setCookie('refreshToken', response.data.refreshToken);

    return response.data;
  },

  // Refresh token
  async refreshToken(data: RefreshTokenRequest): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>('/auth/refresh', data);

    // Update tokens in cookies
    setCookie('authToken', response.data.token);
    setCookie('refreshToken', response.data.refreshToken);

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