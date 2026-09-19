import { beliSearchUrl } from "@/lib/beli";
import { haversineMeters } from "@/lib/distance";
import { googlePhotoUrl, type RawGooglePlace } from "@/lib/providers/google";
import type { RawYelpBusiness } from "@/lib/providers/yelp";
import type { PriceLevel, Restaurant } from "@/lib/types";

const GOOGLE_PRICE_LEVELS: Record<string, PriceLevel> = {
  PRICE_LEVEL_INEXPENSIVE: 1,
  PRICE_LEVEL_MODERATE: 2,
  PRICE_LEVEL_EXPENSIVE: 3,
  PRICE_LEVEL_VERY_EXPENSIVE: 4,
};

const IGNORED_GOOGLE_TYPES = new Set(["restaurant", "food", "point_of_interest", "establishment"]);

function originDistance(
  lat: number,
  lng: number,
  origin: { lat?: number; lng?: number } | null
): number | null {
  if (!origin || origin.lat == null || origin.lng == null) return null;
  return haversineMeters(origin.lat, origin.lng, lat, lng);
}

export function mapGoogleToRestaurant(
  raw: RawGooglePlace,
  apiKey: string,
  origin: { lat?: number; lng?: number } | null
): Restaurant | null {
  const lat = raw.location?.latitude;
  const lng = raw.location?.longitude;
  const name = raw.displayName?.text;
  if (lat == null || lng == null || !name) return null;

  const address = raw.formattedAddress ?? "";
  return {
    id: `google-${raw.id}`,
    name,
    rating: raw.rating ?? null,
    reviewCount: raw.userRatingCount ?? null,
    priceLevel: raw.priceLevel ? GOOGLE_PRICE_LEVELS[raw.priceLevel] ?? null : null,
    categories: (raw.types ?? []).filter((t) => !IGNORED_GOOGLE_TYPES.has(t)),
    photoUrl: raw.photos?.[0]?.name ? googlePhotoUrl(raw.photos[0].name, apiKey) : null,
    address,
    lat,
    lng,
    distanceMeters: originDistance(lat, lng, origin),
    sources: {
      google: { placeId: raw.id, url: raw.googleMapsUri ?? `https://www.google.com/maps/place/?q=place_id:${raw.id}` },
    },
    beliSearchUrl: beliSearchUrl(name, address),
  };
}

export function mapYelpToRestaurant(
  raw: RawYelpBusiness,
  origin: { lat?: number; lng?: number } | null
): Restaurant | null {
  const lat = raw.coordinates?.latitude;
  const lng = raw.coordinates?.longitude;
  if (lat == null || lng == null || !raw.name) return null;

  const address = raw.location?.display_address?.join(", ") ?? "";
  return {
    id: `yelp-${raw.id}`,
    name: raw.name,
    rating: raw.rating ?? null,
    reviewCount: raw.review_count ?? null,
    priceLevel: raw.price ? (raw.price.length as PriceLevel) : null,
    categories: (raw.categories ?? []).map((c) => c.title),
    photoUrl: raw.image_url ?? null,
    address,
    lat,
    lng,
    distanceMeters: raw.distance ?? originDistance(lat, lng, origin),
    sources: {
      yelp: { id: raw.id, alias: raw.alias, url: raw.url ?? `https://www.yelp.com/biz/${raw.alias}` },
    },
    beliSearchUrl: beliSearchUrl(raw.name, address),
  };
}
