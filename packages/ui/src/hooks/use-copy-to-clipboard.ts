"use client";

import { useEffect, useRef, useState } from "react";

export function useCopyToClipboard(resetDelay = 2000) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!copied) return;
    timerRef.current = setTimeout(() => setCopied(false), resetDelay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [copied, resetDelay]);

  const copy = async (text: string) => {
    if (!navigator.clipboard) return false;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      return true;
    } catch {
      return false;
    }
  };

  return { copy, copied };
}
