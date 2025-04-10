'use client';

import { AuthProvider as ClientAuthProvider } from '@/contexts/AuthContext';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import { AuthTokens } from '@/types/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [initialAuthState, setInitialAuthState] = useState<AuthTokens | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        // First try to get from cookie
        const authTokenCookie = getCookie('auth_tokens');
        
        if (authTokenCookie) {
          try {
            const parsedToken = JSON.parse(authTokenCookie.toString());
            console.log('Parsed token:', parsedToken);
            
            // Validate the token structure
            if (parsedToken && parsedToken.accessToken) {
              console.log('Found valid auth token in cookie:', parsedToken);
              setInitialAuthState(parsedToken);
            } else {
              console.error('Invalid token structure in cookie');
              setInitialAuthState(null);
            }
          } catch (parseError) {
            console.error('Error parsing auth token from cookie:', parseError);
            setInitialAuthState(null);
          }
        } else {
          console.log('No auth token found in cookie, checking localStorage');
          
          // If no cookie, try localStorage (client-side only)
          if (typeof window !== 'undefined') {
            const storedTokens = localStorage.getItem('auth_tokens');
            if (storedTokens) {
              try {
                const parsedTokens = JSON.parse(storedTokens);
                if (parsedTokens && parsedTokens.accessToken) {
                  console.log('Found valid auth token in localStorage:', parsedTokens);
                  setInitialAuthState(parsedTokens);
                } else {
                  console.error('Invalid token structure in localStorage');
                  setInitialAuthState(null);
                }
              } catch (parseError) {
                console.error('Error parsing auth token from localStorage:', parseError);
                setInitialAuthState(null);
              }
            } else {
              console.log('No auth token found in localStorage');
              setInitialAuthState(null);
            }
          } else {
            setInitialAuthState(null);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setInitialAuthState(null);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  // Don't render anything until we've initialized
  if (!isInitialized) {
    return null;
  }

  console.log('Rendering ClientAuthProvider with initialAuthState:', initialAuthState);
  
  return (
    <ClientAuthProvider initialAuthState={initialAuthState}>
      {children}
    </ClientAuthProvider>
  );
} 