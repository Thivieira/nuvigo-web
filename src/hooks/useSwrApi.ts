import useSWR from 'swr';
import axiosInstance from '../lib/axios';

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const response = await axiosInstance.get(url);
  return response.data;
};

// Generic hook for fetching data with SWR
export function useSwrApi<T>(url: string | null, options = {}) {
  return useSWR<T>(url, fetcher, {
    revalidateOnFocus: false,
    ...options,
  });
}

// Hook for fetching data with SWR and error handling
export function useSwrApiWithError<T>(url: string | null, options = {}) {
  const { data, error, isLoading, mutate } = useSwrApi<T>(url, options);

  return {
    data,
    error: error?.response?.data?.message || error?.message,
    isLoading,
    mutate,
    isError: !!error,
  };
} 