import { FilterBar } from "@/components/restaurant/FilterBar";
import { RestaurantList } from "@/components/restaurant/RestaurantList";
import { TicketHeader } from "@/components/ticket/TicketHeader";
import { Button } from "@/components/ui/Button";
import type { Filters, Restaurant } from "@/lib/types";

export function FilterEliminateScreen({
  visible,
  remaining,
  eliminatedIds,
  filters,
  warnings,
  onFiltersChange,
  onToggle,
  onResetEliminations,
  onDecide,
}: {
  visible: Restaurant[];
  remaining: Restaurant[];
  eliminatedIds: Set<string>;
  filters: Filters;
  warnings: string[];
  onFiltersChange: (filters: Partial<Filters>) => void;
  onToggle: (id: string) => void;
  onResetEliminations: () => void;
  onDecide: () => void;
}) {
  const struckCount = visible.length - remaining.length;

  return (
    <div className="flex flex-1 flex-col">
      <TicketHeader eyebrow="cross off the no's" />

      <div className="flex flex-1 flex-col gap-3 px-5 pb-28 pt-4">
        {warnings.map((w) => (
          <p key={w} className="font-mono text-xs text-stamp-dark">
            ⚠ {w}
          </p>
        ))}

        <FilterBar filters={filters} onChange={onFiltersChange} />

        <RestaurantList restaurants={visible} eliminatedIds={eliminatedIds} onToggle={onToggle} />

        {struckCount > 0 && (
          <button
            type="button"
            onClick={onResetEliminations}
            className="self-start font-mono text-xs text-ink-soft underline decoration-dotted underline-offset-4 hover:text-ink"
          >
            undo all {struckCount} crossed off
          </button>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-md border-t-2 border-dotted border-ink-faint bg-paper px-5 pb-5 pt-3">
        <div className="mb-2 flex items-baseline justify-between font-mono text-xs text-ink-soft">
          <span>still on the ticket</span>
          <span>{remaining.length}</span>
        </div>
        <Button onClick={onDecide} disabled={remaining.length === 0} className="w-full">
          Settle it
        </Button>
      </div>
    </div>
  );
}
