import type { Filters, PriceLevel } from "@/lib/types";

export function FilterBar({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (filters: Partial<Filters>) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b-2 border-dotted border-ink-faint pb-3 font-mono text-xs text-ink-soft">
      <input
        type="text"
        placeholder="cuisine…"
        defaultValue={filters.cuisine ?? ""}
        onChange={(e) => onChange({ cuisine: e.target.value || undefined })}
        className="w-24 border-b border-ink/30 bg-transparent py-1 text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none"
      />
      <label className="flex items-center gap-1.5">
        price ≤
        <select
          value={filters.maxPriceLevel ?? ""}
          onChange={(e) =>
            onChange({
              maxPriceLevel: e.target.value ? (Number(e.target.value) as PriceLevel) : undefined,
            })
          }
          className="border-b border-ink/30 bg-transparent py-1 text-ink focus:border-ink focus:outline-none"
        >
          <option value="">any</option>
          <option value="1">$</option>
          <option value="2">$$</option>
          <option value="3">$$$</option>
          <option value="4">$$$$</option>
        </select>
      </label>
      <label className="flex items-center gap-1.5">
        rating ≥
        <select
          value={filters.minRating ?? ""}
          onChange={(e) => onChange({ minRating: e.target.value ? Number(e.target.value) : undefined })}
          className="border-b border-ink/30 bg-transparent py-1 text-ink focus:border-ink focus:outline-none"
        >
          <option value="">any</option>
          <option value="3">3.0</option>
          <option value="3.5">3.5</option>
          <option value="4">4.0</option>
          <option value="4.5">4.5</option>
        </select>
      </label>
    </div>
  );
}
