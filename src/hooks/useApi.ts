'use client';

import { useAuth } from '@/contexts/auth-context';
import { useCallback } from 'react';
import useSWR from 'swr';
import axiosInstance from '../lib/axios';

interface RequestOptions extends RequestInit {
  requireAuth?: boolean;
}

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const response = await axiosInstance.get(url);
  return response.data;
};

// Generic hook for fetching data with SWR
export function useApi<T>(url: string | null, options = {}) {
  return useSWR<T>(url, fetcher, {
    revalidateOnFocus: false,
    ...options,
  });
}

// Hook for fetching data with SWR and error handling
export function useApiWithError<T>(url: string | null, options = {}) {
  const { data, error, isLoading, mutate } = useApi<T>(url, options);

  return {
    data,
    error: error?.response?.data?.message || error?.message,
    isLoading,
    mutate,
    isError: !!error,
  };
}

export function useApiOld() {
  const { tokens, refreshToken } = useAuth();

  const fetchWithAuth = useCallback(async (url: string, options: RequestOptions = {}) => {
    const { requireAuth = true, ...fetchOptions } = options;

    const headers = new Headers(fetchOptions.headers);

    if (requireAuth && tokens?.accessToken) {
      headers.set('Authorization', `Bearer ${tokens.accessToken}`);
    }

    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      // Handle token expiration
      if (response.status === 401 && requireAuth) {
        try {
          await refreshToken();
          // Retry the request with new token
          headers.set('Authorization', `Bearer ${tokens?.accessToken}`);
          return fetch(url, {
            ...fetchOptions,
            headers,
          });
        } catch (error) {
          throw new Error('Authentication failed');
        }
      }

      return response;
    } catch (error) {
      throw error;
    }
  }, [tokens, refreshToken]);

  return { fetchWithAuth };
} 