import type { Restaurant } from "@/lib/types";

function formatDistance(meters: number | null): string | null {
  if (meters == null) return null;
  const miles = meters / 1609.344;
  return miles < 0.1 ? "nearby" : `${miles.toFixed(1)} mi`;
}

function priceLabel(level: number | null): string | null {
  if (level == null) return null;
  return "$".repeat(level);
}

export function RestaurantCard({
  restaurant,
  struck = false,
  onToggle,
  highlighted = false,
}: {
  restaurant: Restaurant;
  struck?: boolean;
  onToggle?: (id: string) => void;
  highlighted?: boolean;
}) {
  const distance = formatDistance(restaurant.distanceMeters);
  const price = priceLabel(restaurant.priceLevel);
  const meta = [restaurant.rating != null ? `★${restaurant.rating.toFixed(1)}` : null, price, distance]
    .filter(Boolean)
    .join("  ");

  const Tag = onToggle ? "button" : "div";

  return (
    <Tag
      type={onToggle ? "button" : undefined}
      onClick={onToggle ? () => onToggle(restaurant.id) : undefined}
      aria-pressed={onToggle ? struck : undefined}
      className={`group flex w-full items-baseline gap-2 py-2.5 text-left ${onToggle ? "cursor-pointer" : ""} ${
        highlighted ? "-mx-2 rounded-sm bg-stamp/10 px-2" : ""
      }`}
    >
      <span
        className={`min-w-0 flex-1 truncate ${
          struck ? "text-ink-faint line-through decoration-stamp decoration-2" : "text-ink"
        } ${highlighted ? "font-semibold" : ""}`}
      >
        {restaurant.name}
      </span>
      <span className="dotted-leader mb-1 hidden flex-1 sm:block" aria-hidden="true" />
      <span
        className={`shrink-0 font-mono text-xs ${struck ? "text-ink-faint line-through" : "text-ink-soft"}`}
      >
        {meta || "—"}
      </span>
    </Tag>
  );
}
