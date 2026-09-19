import { useReducer } from "react";

import { DEFAULT_FILTERS, type Filters, type LocationQuery, type Restaurant } from "@/lib/types";

export type Step = "start" | "location" | "fetching" | "filter-eliminate" | "deciding" | "result";

export interface AppState {
  step: Step;
  location: LocationQuery | null;
  filters: Filters;
  allRestaurants: Restaurant[];
  eliminatedIds: Set<string>;
  winner: Restaurant | null;
  error: string | null;
  warnings: string[];
}

export type Action =
  | { type: "START" }
  | { type: "SET_LOCATION_AND_FETCH"; location: LocationQuery }
  | { type: "FETCH_SUCCESS"; restaurants: Restaurant[]; warnings: string[] }
  | { type: "FETCH_ERROR"; error: string }
  | { type: "UPDATE_FILTERS"; filters: Partial<Filters> }
  | { type: "ELIMINATE"; id: string }
  | { type: "RESTORE"; id: string }
  | { type: "RESET_ELIMINATIONS" }
  | { type: "DECIDE" }
  | { type: "REVEAL_WINNER"; winner: Restaurant }
  | { type: "START_OVER" };

const initialState: AppState = {
  step: "start",
  location: null,
  filters: DEFAULT_FILTERS,
  allRestaurants: [],
  eliminatedIds: new Set(),
  winner: null,
  error: null,
  warnings: [],
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "START":
      return { ...initialState, step: "location" };
    case "SET_LOCATION_AND_FETCH":
      return { ...state, step: "fetching", location: action.location, error: null };
    case "FETCH_SUCCESS":
      return {
        ...state,
        step: "filter-eliminate",
        allRestaurants: action.restaurants,
        eliminatedIds: new Set(),
        warnings: action.warnings,
      };
    case "FETCH_ERROR":
      return { ...state, step: "location", error: action.error };
    case "UPDATE_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.filters } };
    case "ELIMINATE": {
      const next = new Set(state.eliminatedIds);
      next.add(action.id);
      return { ...state, eliminatedIds: next };
    }
    case "RESTORE": {
      const next = new Set(state.eliminatedIds);
      next.delete(action.id);
      return { ...state, eliminatedIds: next };
    }
    case "RESET_ELIMINATIONS":
      return { ...state, eliminatedIds: new Set() };
    case "DECIDE":
      return { ...state, step: "deciding" };
    case "REVEAL_WINNER":
      return { ...state, step: "result", winner: action.winner };
    case "START_OVER":
      return { ...initialState, step: "location", location: state.location };
    default:
      return state;
  }
}

function passesFilters(r: Restaurant, filters: Filters): boolean {
  if (filters.minRating != null && (r.rating == null || r.rating < filters.minRating)) {
    return false;
  }
  if (filters.maxPriceLevel != null && r.priceLevel != null && r.priceLevel > filters.maxPriceLevel) {
    return false;
  }
  if (filters.cuisine) {
    const needle = filters.cuisine.toLowerCase();
    const haystack = `${r.name} ${r.categories.join(" ")}`.toLowerCase();
    if (!haystack.includes(needle)) return false;
  }
  return true;
}

export function useAppState() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const visible = state.allRestaurants.filter((r) => passesFilters(r, state.filters));
  const remaining = visible.filter((r) => !state.eliminatedIds.has(r.id));

  return { state, visible, remaining, dispatch };
}
