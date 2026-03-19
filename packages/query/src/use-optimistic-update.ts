"use client";

import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { useCallback } from "react";

/**
 * Hook for optimistic updates with automatic rollback on error.
 *
 * @example
 * const { optimisticUpdate } = useOptimisticUpdate<Todo[]>(["todos"]);
 *
 * const mutation = useMutation({
 *   mutationFn: updateTodo,
 *   onMutate: async (newTodo) => {
 *     return optimisticUpdate((prev) =>
 *       prev?.map((t) => t.id === newTodo.id ? { ...t, ...newTodo } : t)
 *     );
 *   },
 *   onError: (_, __, context) => context?.rollback(),
 *   onSettled: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
 * });
 */
export function useOptimisticUpdate<TData>(queryKey: QueryKey) {
  const queryClient = useQueryClient();

  const optimisticUpdate = useCallback(
    async (updater: (prev: TData | undefined) => TData | undefined) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<TData>(queryKey);
      queryClient.setQueryData<TData>(queryKey, updater);

      return {
        rollback: () => queryClient.setQueryData(queryKey, previous),
        previous,
      };
    },
    [queryClient, queryKey]
  );

  return { optimisticUpdate };
}
