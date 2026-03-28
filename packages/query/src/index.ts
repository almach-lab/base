// Core factory
export { createQuery } from "./create-query.js";
export { createMutation } from "./create-mutation.js";
export { createServerAction } from "./create-server-action.js";

// Hooks
export { useInvalidate } from "./use-invalidate.js";
export { useOptimisticUpdate } from "./use-optimistic-update.js";

// Provider
export { BasedQueryProvider } from "./provider.js";
export type { BasedQueryProviderProps } from "./provider.js";

// Types
export type {
  QueryConfig,
  MutationConfig,
  ServerActionConfig,
  ActionResult,
  ActionError,
} from "./types.js";
export type { CreateMutationOptions } from "./create-mutation.js";
export type { ServerActionOptions } from "./create-server-action.js";

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
