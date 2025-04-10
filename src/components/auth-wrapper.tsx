'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthWrapperProps {
  children: ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { isLoading } = useAuth();
  
  if (isLoading) {
    return null;
  }
  
  return <>{children}</>;
} 