import type {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

export interface QueryConfig<TData, TError = Error>
  extends Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn"> {
  queryKey: QueryKey;
  queryFn: () => Promise<TData>;
}

export interface MutationConfig<TData, TError = Error, TVariables = void>
  extends UseMutationOptions<TData, TError, TVariables> {}

export interface ServerActionConfig<TData, TVariables = void> {
  action: (input: TVariables) => Promise<ActionResult<TData>>;
}

/** Standard result type for server actions */
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: ActionError };

export interface ActionError {
  code?: string;
  message: string;
  fields?: Record<string, string[]>;
}
