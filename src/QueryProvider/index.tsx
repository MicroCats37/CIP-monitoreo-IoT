'use client'
import { QueryClient, QueryClientProvider, HydrationBoundary ,dehydrate} from '@tanstack/react-query';
import React, { useState } from 'react'

export default function ProviderQuery({
  children,
}:
  { children: React.ReactNode }
) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        {children}
      </HydrationBoundary>

    </QueryClientProvider>
  );
}
