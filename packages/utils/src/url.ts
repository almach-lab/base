/**
 * Create a URL with search params merged in.
 */
export function createUrl(
  base: string,
  params: Record<string, string | number | boolean | null | undefined>,
): string {
  const url = new URL(base, "http://placeholder");
  for (const [key, value] of Object.entries(params)) {
    if (value != null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }
  return url.pathname + (url.search ? url.search : "");
}

/**
 * Parse URL search params into a typed object.
 */
export function parseSearchParams(
  params: URLSearchParams | string,
): Record<string, string> {
  const sp = typeof params === "string" ? new URLSearchParams(params) : params;
  return Object.fromEntries(sp.entries());
}

/**
 * Convert an object to URLSearchParams.
 */
export function toSearchParams(
  obj: Record<string, string | number | boolean | null | undefined>,
): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(obj)) {
    if (value != null && value !== "") {
      params.set(key, String(value));
    }
  }
  return params;
}
