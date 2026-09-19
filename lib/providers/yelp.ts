import type { Filters, LocationQuery } from "@/lib/types";

export interface RawYelpBusiness {
  id: string;
  alias: string;
  name: string;
  rating?: number;
  review_count?: number;
  price?: string;
  categories?: { alias: string; title: string }[];
  image_url?: string;
  location?: { display_address?: string[] };
  coordinates?: { latitude?: number; longitude?: number };
  url?: string;
  distance?: number;
}

interface YelpSearchResponse {
  businesses?: RawYelpBusiness[];
}

const YELP_MAX_RADIUS_METERS = 40000;

export async function fetchYelpBusinesses(params: {
  location: LocationQuery;
  filters: Filters;
}): Promise<RawYelpBusiness[]> {
  const apiKey = process.env.YELP_API_KEY;
  if (!apiKey) {
    throw new Error("YELP_API_KEY is not configured");
  }

  const { location, filters } = params;
  const search = new URLSearchParams();
  search.set("categories", "restaurants");
  search.set("limit", "20");
  search.set(
    "radius",
    String(Math.min(filters.radiusMeters, YELP_MAX_RADIUS_METERS))
  );

  if (location.mode === "coords" && location.lat != null && location.lng != null) {
    search.set("latitude", String(location.lat));
    search.set("longitude", String(location.lng));
  } else if (location.mode === "text" && location.text) {
    search.set("location", location.text);
  } else {
    throw new Error("Invalid location query for Yelp");
  }

  if (filters.cuisine) {
    search.set("term", filters.cuisine);
  }
  if (filters.maxPriceLevel) {
    const prices = Array.from({ length: filters.maxPriceLevel }, (_, i) => i + 1);
    search.set("price", prices.join(","));
  }

  const res = await fetch(
    `https://api.yelp.com/v3/businesses/search?${search.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Yelp request failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as YelpSearchResponse;
  return data.businesses ?? [];
}
