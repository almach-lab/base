"use client";

import { type QueryKey, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

/**
 * Returns a stable invalidate function for one or more query keys.
 *
 * @example
 * const invalidateUsers = useInvalidate(["users"]);
 * await invalidateUsers();
 */
export function useInvalidate(...keys: QueryKey[]) {
  const queryClient = useQueryClient();

  return useCallback(async () => {
    await Promise.all(
      keys.map((key) => queryClient.invalidateQueries({ queryKey: key })),
    );
  }, [queryClient, ...keys, keys.map]); // eslint-disable-line react-hooks/exhaustive-deps
}
