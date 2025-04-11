import useSWR from 'swr';
import { axiosInstance } from '../lib/axios';

interface FetcherConfig {
  url: string;
  token?: string;
}

// Fetcher function for SWR
const fetcher = async ({ url, token }: FetcherConfig) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await axiosInstance.get(url, { headers });
  return response.data;
};

// Default cache configuration
const defaultOptions = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  dedupingInterval: 60000, // 1 minute
  refreshInterval: 300000, // 5 minutes
  errorRetryCount: 3,
};

// Generic hook for fetching data with SWR
export function useSwrApi<T>(url: string | null, token?: string, options = {}) {
  return useSWR<T>(
    url ? { url, token } : null,
    fetcher,
    {
      ...defaultOptions,
      ...options,
    }
  );
}

// Hook for fetching data with SWR and error handling
export function useSwrApiWithError<T>(url: string | null, token?: string, options = {}) {
  const { data, error, isLoading, mutate } = useSwrApi<T>(url, token, options);

  return {
    data,
    error: error?.response?.data?.message || error?.message,
    isLoading,
    mutate,
    isError: !!error,
  };
} 