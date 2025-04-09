'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useCallback } from 'react';

interface RequestOptions extends RequestInit {
  requireAuth?: boolean;
}

export function useApi() {
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