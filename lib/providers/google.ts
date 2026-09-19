import type { Filters, LocationQuery } from "@/lib/types";

export interface RawGooglePlace {
  id: string;
  displayName?: { text?: string };
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  types?: string[];
  formattedAddress?: string;
  location?: { latitude?: number; longitude?: number };
  photos?: { name?: string }[];
  googleMapsUri?: string;
}

interface GooglePlacesResponse {
  places?: RawGooglePlace[];
}

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.rating",
  "places.userRatingCount",
  "places.priceLevel",
  "places.types",
  "places.formattedAddress",
  "places.location",
  "places.photos",
  "places.googleMapsUri",
].join(",");

export async function fetchGooglePlaces(params: {
  location: LocationQuery;
  filters: Filters;
}): Promise<RawGooglePlace[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_PLACES_API_KEY is not configured");
  }

  const { location, filters } = params;

  let body: Record<string, unknown>;
  let endpoint: string;

  if (location.mode === "coords" && location.lat != null && location.lng != null) {
    endpoint = "https://places.googleapis.com/v1/places:searchNearby";
    body = {
      includedTypes: ["restaurant"],
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: { latitude: location.lat, longitude: location.lng },
          radius: filters.radiusMeters,
        },
      },
    };
  } else if (location.mode === "text" && location.text) {
    endpoint = "https://places.googleapis.com/v1/places:searchText";
    body = {
      textQuery: `restaurants near ${location.text}`,
      includedType: "restaurant",
      maxResultCount: 20,
    };
  } else {
    throw new Error("Invalid location query for Google Places");
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Google Places request failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as GooglePlacesResponse;
  return data.places ?? [];
}

export function googlePhotoUrl(photoName: string, apiKey: string): string {
  return `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=600&key=${apiKey}`;
}
