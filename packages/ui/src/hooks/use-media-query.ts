"use client";

import { useEffect, useState } from "react";

/**
 * Hook to check if a media query matches.
 * SSR-safe: returns false during server rendering.
 */
function getInitialMatch(query: string): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(query).matches;
}

export function useMediaQuery(query: string): boolean {
  // Lazy-init from matchMedia directly instead of always starting at `false`:
  // starting wrong and flipping true post-mount remounts anything keyed on
  // this value (e.g. Modal swapping Dialog<->Drawer) right after first paint.
  const [matches, setMatches] = useState(() => getInitialMatch(query));

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

export function useIsMobile() {
  return useMediaQuery("(max-width: 768px)");
}
