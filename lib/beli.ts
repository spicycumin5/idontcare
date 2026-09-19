/**
 * Beli has no public API. This only builds a search-results deep link so the
 * group can look the place up manually — it is never guaranteed to match,
 * and no Beli data (rating, existence, etc.) is ever fetched or implied.
 */
export function beliSearchUrl(name: string, address: string): string {
  const query = `${name} ${address}`.trim();
  return `https://beliapp.co/search?q=${encodeURIComponent(query)}`;
}
