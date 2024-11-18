'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Component } from 'lucide-react';
import React, { useState } from 'react'

export default function ProviderQuery({
    children,
  }: 
    {children: React.ReactNode}
 ) {
    const [queryClient] = useState(() => new QueryClient());

    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
}
