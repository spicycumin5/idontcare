"use client";

import { DecideRevealScreen } from "@/components/steps/DecideRevealScreen";
import { FetchingScreen } from "@/components/steps/FetchingScreen";
import { FilterEliminateScreen } from "@/components/steps/FilterEliminateScreen";
import { LocationInput } from "@/components/steps/LocationInput";
import { ResultScreen } from "@/components/steps/ResultScreen";
import { StartScreen } from "@/components/steps/StartScreen";
import { useAppState } from "@/hooks/useAppState";
import { DEFAULT_FILTERS, type LocationQuery, type RestaurantSearchResponse } from "@/lib/types";

export function AppFlow() {
  const { state, visible, remaining, dispatch } = useAppState();

  function handleToggle(id: string) {
    dispatch(state.eliminatedIds.has(id) ? { type: "RESTORE", id } : { type: "ELIMINATE", id });
  }

  async function handleLocationSubmit(location: LocationQuery) {
    dispatch({ type: "SET_LOCATION_AND_FETCH", location });
    try {
      const res = await fetch("/api/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location, filters: { radiusMeters: DEFAULT_FILTERS.radiusMeters } }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `Search failed (${res.status})`);
      }
      const data: RestaurantSearchResponse = await res.json();
      if (data.restaurants.length === 0) {
        dispatch({ type: "FETCH_ERROR", error: "No restaurants found nearby. Try a different place." });
        return;
      }
      dispatch({ type: "FETCH_SUCCESS", restaurants: data.restaurants, warnings: data.warnings });
    } catch (err) {
      dispatch({
        type: "FETCH_ERROR",
        error: err instanceof Error ? err.message : "Something went wrong. Try again.",
      });
    }
  }

  switch (state.step) {
    case "start":
      return <StartScreen onStart={() => dispatch({ type: "START" })} />;

    case "location":
      return <LocationInput onSubmit={handleLocationSubmit} error={state.error} />;

    case "fetching":
      return <FetchingScreen />;

    case "filter-eliminate":
      return (
        <FilterEliminateScreen
          visible={visible}
          remaining={remaining}
          eliminatedIds={state.eliminatedIds}
          filters={state.filters}
          warnings={state.warnings}
          onFiltersChange={(filters) => dispatch({ type: "UPDATE_FILTERS", filters })}
          onToggle={handleToggle}
          onResetEliminations={() => dispatch({ type: "RESET_ELIMINATIONS" })}
          onDecide={() => dispatch({ type: "DECIDE" })}
        />
      );

    case "deciding":
      return (
        <DecideRevealScreen
          candidates={remaining}
          onRevealed={(winner) => dispatch({ type: "REVEAL_WINNER", winner })}
        />
      );

    case "result":
      return state.winner ? (
        <ResultScreen winner={state.winner} onStartOver={() => dispatch({ type: "START_OVER" })} />
      ) : null;

    default:
      return null;
  }
}
