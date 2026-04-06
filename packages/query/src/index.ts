// Core factory

export type {
  InfiniteData,
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
// Re-export TanStack Query for convenience
export {
  infiniteQueryOptions,
  keepPreviousData,
  QueryClient,
  QueryClientProvider,
  queryOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
export type { CreateMutationOptions } from "./create-mutation.js";
export { createMutation } from "./create-mutation.js";
export { createQuery } from "./create-query.js";
export type { ServerActionOptions } from "./create-server-action.js";
export { createServerAction } from "./create-server-action.js";
export type { BasedQueryProviderProps } from "./provider.js";
// Provider
export { BasedQueryProvider } from "./provider.js";
// Types
export type {
  ActionError,
  ActionResult,
  MutationConfig,
  QueryConfig,
  ServerActionConfig,
} from "./types.js";
// Hooks
export { useInvalidate } from "./use-invalidate.js";
export { useOptimisticUpdate } from "./use-optimistic-update.js";
