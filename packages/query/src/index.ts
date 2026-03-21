// Core factory
export { createQuery } from "./create-query";
export { createMutation } from "./create-mutation";
export { createServerAction } from "./create-server-action";

// Hooks
export { useInvalidate } from "./use-invalidate";
export { useOptimisticUpdate } from "./use-optimistic-update";

// Provider
export { BasedQueryProvider } from "./provider";
export type { BasedQueryProviderProps } from "./provider";

// Types
export type {
  QueryConfig,
  MutationConfig,
  ServerActionConfig,
  ActionResult,
  ActionError,
} from "./types";
export type { CreateMutationOptions } from "./create-mutation";
export type { ServerActionOptions } from "./create-server-action";

// Re-export TanStack Query for convenience
export {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  useSuspenseQuery,
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
  infiniteQueryOptions,
  queryOptions,
} from "@tanstack/react-query";
export type {
  UseQueryOptions,
  UseMutationOptions,
  QueryKey,
  InfiniteData,
} from "@tanstack/react-query";
