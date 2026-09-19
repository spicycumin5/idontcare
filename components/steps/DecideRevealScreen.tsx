import { useEffect, useState } from "react";

import { TicketHeader } from "@/components/ticket/TicketHeader";
import type { Restaurant } from "@/lib/types";

const SHUFFLE_DURATION_MS = 1800;
const SHUFFLE_INTERVAL_MS = 110;

export function DecideRevealScreen({
  candidates,
  onRevealed,
}: {
  candidates: Restaurant[];
  onRevealed: (winner: Restaurant) => void;
}) {
  const [highlightIndex, setHighlightIndex] = useState(0);

  useEffect(() => {
    // Picking the winner is a side effect (impure), so it belongs in the
    // effect body, not computed directly during render.
    const winner = candidates[Math.floor(Math.random() * candidates.length)];
    const startedAt = Date.now();
    const interval = setInterval(() => {
      setHighlightIndex((i) => (i + 1) % candidates.length);
      if (Date.now() - startedAt >= SHUFFLE_DURATION_MS) {
        clearInterval(interval);
        onRevealed(winner);
      }
    }, SHUFFLE_INTERVAL_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const highlighted = candidates[highlightIndex];

  return (
    <div className="flex flex-1 flex-col">
      <TicketHeader eyebrow="settling it" />
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="font-mono text-xs text-ink-faint">picking…</p>
        <p className="max-w-[22ch] font-[family-name:var(--font-display)] text-4xl leading-tight text-ink">
          {highlighted?.name}
        </p>
      </div>
    </div>
  );
}
