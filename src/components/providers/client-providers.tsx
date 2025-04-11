'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/auth-context';
import { SwrProvider } from './swr-provider';

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <SwrProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </SwrProvider>
  );
} 