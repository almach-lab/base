import { type QueryKey, queryOptions } from "@tanstack/react-query";

/**
 * Type-safe query factory. Creates a reusable query definition
 * that can be used with useQuery or prefetched server-side.
 *
 * @example
 * export const userQuery = createQuery({
 *   queryKey: (id: string) => ["users", id],
 *   queryFn: (id) => fetchUser(id),
 * });
 *
 * // In component:
 * const { data } = useQuery(userQuery.options(userId));
 */
export function createQuery<
  TData,
  TArgs extends readonly unknown[] = [],
>(config: {
  queryKey: (...args: TArgs) => QueryKey;
  queryFn: (...args: TArgs) => Promise<TData>;
  staleTime?: number;
  gcTime?: number;
}) {
  return {
    options: (...args: TArgs) =>
      queryOptions({
        queryKey: config.queryKey(...args),
        queryFn: () => config.queryFn(...args),
        // Spread conditionally — exactOptionalPropertyTypes forbids explicit `undefined`
        ...(config.staleTime !== undefined && { staleTime: config.staleTime }),
        ...(config.gcTime !== undefined && { gcTime: config.gcTime }),
      }),
    queryKey: config.queryKey,
  };
}
