'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthTokens, LoginCredentials, RegisterCredentials, AuthResponse, ForgotPasswordCredentials, ResetPasswordCredentials } from '@/types/auth';
import { setCookie, deleteCookie } from 'cookies-next';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  tokens: AuthTokens | null;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (credentials: RegisterCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<AuthTokens>;
  forgotPassword: (credentials: ForgotPasswordCredentials) => Promise<{ success: boolean; message: string }>;
  resetPassword: (credentials: ResetPasswordCredentials) => Promise<{ success: boolean; message: string }>;
  verifyEmail: (credentials: { token: string }) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

interface AuthProviderProps {
  children: ReactNode;
  initialAuthState?: AuthTokens | null;
}

export function AuthProvider({ children, initialAuthState = null }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tokens, setTokens] = useState<AuthTokens | null>(initialAuthState);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!initialAuthState?.accessToken);

  // Log the initial state for debugging
  useEffect(() => {
    console.log('AuthProvider initialized with:', {
      initialAuthState,
      tokens,
      isAuthenticated
    });
  }, [initialAuthState, tokens, isAuthenticated]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (initialAuthState?.accessToken) {
          console.log('Initializing auth with provided tokens:', initialAuthState);
          setTokens(initialAuthState);
          await fetchUserData(initialAuthState.accessToken);
        } else {
          // Check for stored tokens on mount
          const storedTokens = localStorage.getItem('auth_tokens');
          if (storedTokens) {
            try {
              const parsedTokens = JSON.parse(storedTokens);
              if (parsedTokens?.accessToken) {
                console.log('Found valid tokens in localStorage:', parsedTokens);
                setTokens(parsedTokens);
                // Fetch user data
                await fetchUserData(parsedTokens.accessToken);
              } else {
                console.log('Invalid token structure in localStorage');
                // Don't call handleLogout here, just clear the state
                setUser(null);
                setTokens(null);
                setIsAuthenticated(false);
              }
            } catch (error) {
              console.error('Error parsing stored tokens:', error);
              // Don't call handleLogout here, just clear the state
              setUser(null);
              setTokens(null);
              setIsAuthenticated(false);
            }
          } else {
            console.log('No tokens found in localStorage');
            // Don't call handleLogout here, just clear the state
            setUser(null);
            setTokens(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Don't call handleLogout here, just clear the state
        setUser(null);
        setTokens(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [initialAuthState]);

  const fetchUserData = async (token: string) => {
    try {
      console.log('Fetching user data with token');
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('User data fetched successfully:', userData);
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        console.error('Failed to fetch user data:', response.status);
        // If token is invalid, clear everything but don't delete from storage
        setUser(null);
        setTokens(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // If token is invalid, clear everything but don't delete from storage
      setUser(null);
      setTokens(null);
      setIsAuthenticated(false);
    }
  };

  const handleLogout = () => {
    console.log('Logging out user');
    setUser(null);
    setTokens(null);
    setIsAuthenticated(false);
    localStorage.removeItem('auth_tokens');
    deleteCookie('auth_tokens', { path: '/' });
  };

  const setCookieAndLocalStorage = (tokens: AuthTokens) => {
    try {
      console.log('Setting auth tokens in localStorage and cookies:', tokens);
      localStorage.setItem('auth_tokens', JSON.stringify(tokens));
      setCookie('auth_tokens', JSON.stringify(tokens), {
        maxAge: 86400, // 1 day
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
    } catch (error) {
      console.error('Error setting auth tokens:', error);
      // Don't call handleLogout here, just log the error
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      console.log('Attempting login with:', credentials.email);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        console.error('Login failed with status:', response.status);
        throw new Error('Login failed');
      }

      const responseData = await response.json();
      console.log('Login successful, received data:', responseData);

      // Check if the response has the expected structure
      if (!responseData.accessToken) {
        console.error('Invalid token structure received from server');
        throw new Error('Invalid token structure received from server');
      }

      // Create the AuthResponse structure from the server response
      const authResponse: AuthResponse = {
        user: responseData.user,
        tokens: {
          accessToken: responseData.accessToken,
          refreshToken: responseData.refreshToken
        }
      };

      setUser(authResponse.user);
      setTokens(authResponse.tokens);
      setIsAuthenticated(true);
      setCookieAndLocalStorage(authResponse.tokens);

      console.log('Auth state updated after login:', {
        user: authResponse.user,
        tokens: authResponse.tokens,
        isAuthenticated: true
      });

      return authResponse;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const responseData = await response.json();

      if (!responseData.accessToken) {
        throw new Error('Invalid token structure received from server');
      }

      // Create the AuthResponse structure from the server response
      const authResponse: AuthResponse = {
        user: responseData.user,
        tokens: {
          accessToken: responseData.accessToken,
          refreshToken: responseData.refreshToken
        }
      };

      setUser(authResponse.user);
      setTokens(authResponse.tokens);
      setIsAuthenticated(true);
      setCookieAndLocalStorage(authResponse.tokens);

      return authResponse;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    if (tokens?.refreshToken) {
      try {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokens.accessToken}`,
          },
          body: JSON.stringify({ refreshToken: tokens.refreshToken }),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    handleLogout();
  };

  const refreshToken = async (): Promise<AuthTokens> => {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: tokens?.refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const responseData = await response.json();

      if (!responseData.accessToken) {
        throw new Error('Invalid token structure received from server');
      }

      const newTokens: AuthTokens = {
        accessToken: responseData.accessToken,
        refreshToken: responseData.refreshToken
      };

      setTokens(newTokens);
      setIsAuthenticated(true);
      setCookieAndLocalStorage(newTokens);

      return newTokens;
    } catch (error) {
      console.error('Error refreshing token:', error);
      // Don't call handleLogout here, just clear the state
      setUser(null);
      setTokens(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const forgotPassword = async (credentials: ForgotPasswordCredentials) => {
    try {
      console.log('Requesting password reset for email:', credentials.email);

      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Forgot password request failed:', data);
        return {
          success: false,
          message: data.message || 'Falha ao solicitar redefinição de senha'
        };
      }

      console.log('Password reset email sent successfully');
      return {
        success: true,
        message: 'Email de redefinição de senha enviado com sucesso'
      };
    } catch (error) {
      console.error('Error in forgotPassword:', error);
      return {
        success: false,
        message: 'Ocorreu um erro ao solicitar redefinição de senha'
      };
    }
  };

  const resetPassword = async (credentials: ResetPasswordCredentials) => {
    try {
      console.log('Resetting password with token');

      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Password reset failed:', data);
        return {
          success: false,
          message: data.message || 'Falha ao redefinir a senha'
        };
      }

      console.log('Password reset successful');
      return {
        success: true,
        message: 'Senha redefinida com sucesso'
      };
    } catch (error) {
      console.error('Error in resetPassword:', error);
      return {
        success: false,
        message: 'Ocorreu um erro ao redefinir a senha'
      };
    }
  };

  const verifyEmail = async (credentials: { token: string }) => {
    try {
      console.log('Verifying email with token');

      const response = await fetch(`${API_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Email verification failed:', data);
        return {
          success: false,
          message: data.message || 'Falha na verificação do email'
        };
      }

      console.log('Email verification successful');
      return {
        success: true,
        message: 'Email verificado com sucesso'
      };
    } catch (error) {
      console.error('Error in verifyEmail:', error);
      return {
        success: false,
        message: 'Ocorreu um erro ao verificar o email'
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        tokens,
        login,
        register,
        logout,
        refreshToken,
        forgotPassword,
        resetPassword,
        verifyEmail,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 