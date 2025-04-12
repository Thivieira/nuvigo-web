'use client';

import { useAuth } from '@/contexts/auth-context';
import { useCallback } from 'react';
import useSWR from 'swr';
import { axiosInstance } from '../lib/axios';
import { AxiosRequestConfig } from 'axios';

interface RequestOptions extends Omit<AxiosRequestConfig, 'url'> {
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
    const { requireAuth = true, ...axiosOptions } = options;

    const headers: Record<string, string> = {};

    if (requireAuth && tokens?.accessToken) {
      headers['Authorization'] = `Bearer ${tokens.accessToken}`;
    }

    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await axiosInstance({
        url,
        ...axiosOptions,
        headers: {
          ...axiosOptions.headers,
          ...headers,
        },
      });

      return response;
    } catch (error: any) {
      // Handle token expiration
      if (error.response?.status === 401 && requireAuth) {
        try {
          await refreshToken();
          // Retry the request with new token
          headers['Authorization'] = `Bearer ${tokens?.accessToken}`;
          return axiosInstance({
            url,
            ...axiosOptions,
            headers: {
              ...axiosOptions.headers,
              ...headers,
            },
          });
        } catch {
          throw new Error('Authentication failed');
        }
      }
      throw error;
    }
  }, [tokens, refreshToken]);

  return { fetchWithAuth };
} 