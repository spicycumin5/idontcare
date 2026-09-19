import { NextResponse } from "next/server";
import { z } from "zod";

import { mergeAndDedupe } from "@/lib/dedupe";
import { mapGoogleToRestaurant, mapYelpToRestaurant } from "@/lib/normalize";
import { fetchGooglePlaces } from "@/lib/providers/google";
import { fetchYelpBusinesses } from "@/lib/providers/yelp";
import type { Restaurant, RestaurantSearchResponse } from "@/lib/types";

const locationSchema = z
  .object({
    mode: z.enum(["coords", "text"]),
    lat: z.number().optional(),
    lng: z.number().optional(),
    text: z.string().optional(),
  })
  .refine(
    (loc) =>
      (loc.mode === "coords" && loc.lat != null && loc.lng != null) ||
      (loc.mode === "text" && !!loc.text),
    { message: "coords mode requires lat/lng, text mode requires text" }
  );

const filtersSchema = z.object({
  radiusMeters: z.number().min(500).max(40000),
  minRating: z.number().min(0).max(5).optional(),
  maxPriceLevel: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
  cuisine: z.string().optional(),
});

const requestSchema = z.object({
  location: locationSchema,
  filters: filtersSchema,
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = requestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { location, filters } = parsed.data;
  const origin = location.mode === "coords" ? { lat: location.lat, lng: location.lng } : null;
  const warnings: string[] = [];
  const googleApiKey = process.env.GOOGLE_PLACES_API_KEY ?? "";

  const [googleResult, yelpResult] = await Promise.allSettled([
    fetchGooglePlaces({ location, filters }),
    fetchYelpBusinesses({ location, filters }),
  ]);

  let googleRestaurants: Restaurant[] = [];
  if (googleResult.status === "fulfilled") {
    googleRestaurants = googleResult.value
      .map((raw) => mapGoogleToRestaurant(raw, googleApiKey, origin))
      .filter((r): r is Restaurant => r != null);
  } else {
    warnings.push(`Google Places unavailable: ${googleResult.reason?.message ?? "unknown error"}`);
  }

  let yelpRestaurants: Restaurant[] = [];
  if (yelpResult.status === "fulfilled") {
    yelpRestaurants = yelpResult.value
      .map((raw) => mapYelpToRestaurant(raw, origin))
      .filter((r): r is Restaurant => r != null);
  } else {
    warnings.push(`Yelp unavailable: ${yelpResult.reason?.message ?? "unknown error"}`);
  }

  if (googleResult.status === "rejected" && yelpResult.status === "rejected") {
    return NextResponse.json(
      { error: "Both restaurant providers failed", warnings },
      { status: 502 }
    );
  }

  let restaurants = mergeAndDedupe(googleRestaurants, yelpRestaurants);

  if (filters.minRating != null) {
    restaurants = restaurants.filter((r) => r.rating != null && r.rating >= filters.minRating!);
  }
  if (filters.maxPriceLevel != null) {
    restaurants = restaurants.filter(
      (r) => r.priceLevel == null || r.priceLevel <= filters.maxPriceLevel!
    );
  }

  restaurants.sort((a, b) => {
    if (a.distanceMeters == null) return 1;
    if (b.distanceMeters == null) return -1;
    return a.distanceMeters - b.distanceMeters;
  });

  const response: RestaurantSearchResponse = { restaurants, warnings };
  return NextResponse.json(response);
}
