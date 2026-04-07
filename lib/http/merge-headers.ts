/**
 * Builds a `Headers` instance from a base map plus optional `HeadersInit`, for use in `fetch`
 * init objects (avoids invalid object spread when `HeadersInit` is an array or `Headers`).
 */
export function mergeHeaders(
  base: Record<string, string>,
  extra?: HeadersInit
): Headers {
  const headers = new Headers(base);
  if (!extra) return headers;

  if (extra instanceof Headers) {
    extra.forEach((value, key) => {
      headers.set(key, value);
    });
    return headers;
  }

  if (Array.isArray(extra)) {
    for (const [key, value] of extra) {
      headers.set(key, value);
    }
    return headers;
  }

  for (const [key, value] of Object.entries(extra)) {
    headers.set(key, value);
  }

  return headers;
}
