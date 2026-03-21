"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
        retry: (failureCount, error) => {
          // Don't retry on 4xx errors
          if (error instanceof Error && "status" in error) {
            const status = (error as Record<string, unknown>)["status"];
            if (typeof status === "number" && status >= 400 && status < 500) return false;
          }
          return failureCount < 3;
        },
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: reuse client
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export interface BasedQueryProviderProps {
  children: React.ReactNode;
  client?: QueryClient;
}

/**
 * Drop-in QueryClientProvider with sensible defaults.
 * Supports both client and server rendering (RSC-compatible).
 */
export function BasedQueryProvider({ children, client }: BasedQueryProviderProps) {
  const queryClient = client ?? getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
