'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthTokens, LoginCredentials, RegisterCredentials, AuthResponse, ForgotPasswordCredentials, ResetPasswordCredentials, ServerAuthResponse } from '@/types/auth';
import { setCookie, deleteCookie } from 'cookies-next';
import { axiosInstance } from '@/lib/axios';

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
      const { data: userData } = await axiosInstance.get<User>('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('User data fetched successfully:', userData);
      setUser(userData);
      setIsAuthenticated(true);
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

      const { data: responseData } = await axiosInstance.post<ServerAuthResponse>('/auth/login', credentials);

      // Transform the response to match the expected structure
      const transformedResponse: AuthResponse = {
        user: responseData.user,
        tokens: {
          accessToken: responseData.accessToken,
          refreshToken: responseData.refreshToken
        }
      };

      setUser(transformedResponse.user);
      setTokens(transformedResponse.tokens);
      setIsAuthenticated(true);
      setCookieAndLocalStorage(transformedResponse.tokens);

      console.log('Auth state updated after login:', {
        user: transformedResponse.user,
        tokens: transformedResponse.tokens,
        isAuthenticated: true
      });

      return transformedResponse;
    } catch (error: any) {
      console.error('Login error:', error);
      // Handle the specific error format from the server
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      const { data: responseData } = await axiosInstance.post<ServerAuthResponse>('/auth/register', credentials);

      // Transform the response to match the expected structure
      const transformedResponse: AuthResponse = {
        user: responseData.user,
        tokens: {
          accessToken: responseData.accessToken,
          refreshToken: responseData.refreshToken
        }
      };

      setUser(transformedResponse.user);
      setTokens(transformedResponse.tokens);
      setIsAuthenticated(true);
      setCookieAndLocalStorage(transformedResponse.tokens);

      return transformedResponse;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    if (tokens?.refreshToken) {
      try {
        await axiosInstance.post('/auth/logout', { refreshToken: tokens.refreshToken }, {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    handleLogout();
  };

  const refreshToken = async (): Promise<AuthTokens> => {
    try {
      const { data } = await axiosInstance.post<AuthTokens>('/auth/refresh', {
        refreshToken: tokens?.refreshToken,
      });

      setTokens(data);
      setCookieAndLocalStorage(data);
      return data;
    } catch (error) {
      console.error('Token refresh error:', error);
      handleLogout();
      throw error;
    }
  };

  const forgotPassword = async (credentials: ForgotPasswordCredentials) => {
    try {
      await axiosInstance.post('/auth/forgot-password', credentials);
      return {
        success: true,
        message: 'Email de recuperação enviado com sucesso'
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Falha ao enviar email de recuperação');
    }
  };

  const resetPassword = async (credentials: ResetPasswordCredentials) => {
    try {
      await axiosInstance.post('/auth/reset-password', credentials);
      return {
        success: true,
        message: 'Senha redefinida com sucesso'
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Falha ao redefinir a senha');
    }
  };

  const verifyEmail = async (credentials: { token: string }) => {
    try {
      await axiosInstance.post('/auth/verify-email', credentials);
      return {
        success: true,
        message: 'Email verificado com sucesso'
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Falha na verificação do email');
    }
  };

  const value = {
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 