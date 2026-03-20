"use client";

import { toast } from "sonner";

/** @deprecated Import `toast` from `@almach/ui` directly instead. */
export function useToast(): { toast: typeof toast } {
	return { toast };
}
