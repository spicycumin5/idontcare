import { haversineMeters } from "@/lib/distance";
import type { Restaurant } from "@/lib/types";

const NAME_SIMILARITY_THRESHOLD = 0.8;
const PROXIMITY_METERS_THRESHOLD = 100;

const GENERIC_SUFFIXES = /\b(restaurant|the|llc|inc|cafe|grill)\b/g;

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(GENERIC_SUFFIXES, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Token-overlap similarity (Sørensen–Dice on word sets) — cheap and good
// enough to catch near-identical names without a full edit-distance library.
function nameSimilarity(a: string, b: string): number {
  const tokensA = new Set(normalizeName(a).split(" ").filter(Boolean));
  const tokensB = new Set(normalizeName(b).split(" ").filter(Boolean));
  if (tokensA.size === 0 || tokensB.size === 0) return 0;
  let overlap = 0;
  for (const t of tokensA) {
    if (tokensB.has(t)) overlap++;
  }
  return (2 * overlap) / (tokensA.size + tokensB.size);
}

function mergePair(a: Restaurant, b: Restaurant): Restaurant {
  const ratings = [a.rating, b.rating].filter((r): r is number => r != null);
  const avgRating = ratings.length ? ratings.reduce((s, r) => s + r, 0) / ratings.length : null;

  return {
    ...a,
    rating: avgRating,
    reviewCount: (a.reviewCount ?? 0) + (b.reviewCount ?? 0) || null,
    priceLevel: a.priceLevel ?? b.priceLevel,
    categories: Array.from(new Set([...a.categories, ...b.categories])),
    photoUrl: a.photoUrl ?? b.photoUrl,
    distanceMeters: a.distanceMeters ?? b.distanceMeters,
    sources: { ...a.sources, ...b.sources },
  };
}

// Best-effort heuristic, not exact matching: chains with multiple nearby
// locations or slightly different name variants can produce a false merge
// or a missed merge. Acceptable for a v1 group-decision tool.
export function mergeAndDedupe(
  googleResults: Restaurant[],
  yelpResults: Restaurant[]
): Restaurant[] {
  const usedYelp = new Set<number>();
  const merged: Restaurant[] = [];

  for (const g of googleResults) {
    let matchIndex = -1;
    for (let i = 0; i < yelpResults.length; i++) {
      if (usedYelp.has(i)) continue;
      const y = yelpResults[i];
      const distance = haversineMeters(g.lat, g.lng, y.lat, y.lng);
      const similarity = nameSimilarity(g.name, y.name);
      if (similarity > NAME_SIMILARITY_THRESHOLD && distance < PROXIMITY_METERS_THRESHOLD) {
        matchIndex = i;
        break;
      }
    }
    if (matchIndex >= 0) {
      usedYelp.add(matchIndex);
      merged.push(mergePair(g, yelpResults[matchIndex]));
    } else {
      merged.push(g);
    }
  }

  yelpResults.forEach((y, i) => {
    if (!usedYelp.has(i)) merged.push(y);
  });

  return merged;
}
