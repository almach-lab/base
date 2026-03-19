"use client";

import { useState } from "react";

/**
 * Hook to copy text to clipboard with a reset delay.
 */
export function useCopyToClipboard(resetDelay = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string) => {
    if (!navigator.clipboard) return false;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), resetDelay);
      return true;
    } catch {
      return false;
    }
  };

  return { copy, copied };
}
