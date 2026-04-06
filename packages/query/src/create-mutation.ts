import {
  type QueryKey,
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export interface CreateMutationOptions<TData, TError, TVariables, TContext>
  extends UseMutationOptions<TData, TError, TVariables, TContext> {
  /** Keys to invalidate on success */
  invalidates?: QueryKey[];
}

/**
 * Mutation factory with automatic query invalidation.
 *
 * @example
 * export const useCreateUser = createMutation({
 *   mutationFn: (data: CreateUserInput) => createUser(data),
 *   invalidates: [["users"]],
 * });
 */
export function createMutation<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown,
>(options: CreateMutationOptions<TData, TError, TVariables, TContext>) {
  return function useMutationHook() {
    const queryClient = useQueryClient();
    const { invalidates, onSuccess, ...rest } = options;

    return useMutation<TData, TError, TVariables, TContext>({
      ...rest,
      onSuccess: async (...args) => {
        if (invalidates) {
          await Promise.all(
            invalidates.map((key) =>
              queryClient.invalidateQueries({ queryKey: key }),
            ),
          );
        }
        await onSuccess?.(...args);
      },
    });
  };
}
