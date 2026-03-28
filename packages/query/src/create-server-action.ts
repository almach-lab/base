"use client";

import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import type { ActionResult, ActionError } from "./types.js";

export interface ServerActionOptions<TData, TVariables> {
  action: (input: TVariables) => Promise<ActionResult<TData>>;
  invalidates?: QueryKey[];
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>;
  onError?: (error: ActionError, variables: TVariables) => void;
}

/**
 * Wraps a server action (Next.js style) in a TanStack mutation.
 * Handles the ActionResult discriminated union automatically.
 *
 * @example
 * export function useCreatePost() {
 *   return createServerAction({
 *     action: createPostAction,  // Server action returning ActionResult<Post>
 *     invalidates: [["posts"]],
 *     onSuccess: () => router.push("/posts"),
 *   });
 * }
 */
export function createServerAction<TData, TVariables = void>(
  options: ServerActionOptions<TData, TVariables>,
) {
  return function useServerActionHook() {
    const queryClient = useQueryClient();

    return useMutation<TData, ActionError, TVariables>({
      mutationFn: async (variables) => {
        const result = await options.action(variables);
        if (!result.success) {
          throw result.error;
        }
        return result.data;
      },
      onSuccess: async (data, variables) => {
        if (options.invalidates) {
          await Promise.all(
            options.invalidates.map((key) =>
              queryClient.invalidateQueries({ queryKey: key }),
            ),
          );
        }
        await options.onSuccess?.(data, variables);
      },
      onError: (error, variables) => {
        options.onError?.(error, variables);
      },
    });
  };
}
