export type PriceLevel = 1 | 2 | 3 | 4;

export interface Restaurant {
  id: string;
  name: string;
  rating: number | null;
  reviewCount: number | null;
  priceLevel: PriceLevel | null;
  categories: string[];
  photoUrl: string | null;
  address: string;
  lat: number;
  lng: number;
  distanceMeters: number | null;
  sources: {
    google?: { placeId: string; url: string };
    yelp?: { id: string; alias: string; url: string };
  };
  beliSearchUrl: string;
}

export interface LocationQuery {
  mode: "coords" | "text";
  lat?: number;
  lng?: number;
  text?: string;
}

export interface Filters {
  radiusMeters: number;
  minRating?: number;
  maxPriceLevel?: PriceLevel;
  cuisine?: string;
}

export interface RestaurantSearchRequest {
  location: LocationQuery;
  filters: Filters;
}

export interface RestaurantSearchResponse {
  restaurants: Restaurant[];
  warnings: string[];
}

export const DEFAULT_FILTERS: Filters = {
  radiusMeters: 3218, // ~2 miles
};
