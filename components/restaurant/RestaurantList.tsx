import { RestaurantCard } from "@/components/restaurant/RestaurantCard";
import type { Restaurant } from "@/lib/types";

export function RestaurantList({
  restaurants,
  eliminatedIds,
  onToggle,
}: {
  restaurants: Restaurant[];
  eliminatedIds: Set<string>;
  onToggle: (id: string) => void;
}) {
  if (restaurants.length === 0) {
    return (
      <div className="rounded-sm border-2 border-dashed border-ink/20 px-4 py-8 text-center text-ink-soft">
        Nothing matches those filters. Loosen them up.
      </div>
    );
  }

  return (
    <div className="divide-y divide-paper-line">
      {restaurants.map((r) => (
        <RestaurantCard
          key={r.id}
          restaurant={r}
          struck={eliminatedIds.has(r.id)}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
