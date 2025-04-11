import { SWRConfig } from 'swr';
import { ReactNode } from 'react';

const swrOptions = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  dedupingInterval: 60000, // 1 minute
  refreshInterval: 300000, // 5 minutes
  errorRetryCount: 3,
};

export function SwrProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig value={swrOptions}>
      {children}
    </SWRConfig>
  );
} 