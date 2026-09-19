import Image from "next/image";

import { TicketHeader } from "@/components/ticket/TicketHeader";
import { LinkButton } from "@/components/ui/Button";
import type { Restaurant } from "@/lib/types";

export function ResultScreen({
  winner,
  onStartOver,
}: {
  winner: Restaurant;
  onStartOver: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <TicketHeader eyebrow="decided" />

      <div className="flex flex-1 flex-col items-center gap-6 px-6 py-8 text-center">
        <div
          className="animate-stamp-down inline-flex -rotate-6 items-center gap-1.5 rounded-sm border-4 border-stamp px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-stamp"
          style={{ borderStyle: "double" }}
        >
          ✓ decided
        </div>

        {winner.photoUrl && (
          <div className="relative h-36 w-full max-w-xs overflow-hidden rounded-sm border-2 border-ink/10 grayscale-[15%]">
            <Image src={winner.photoUrl} alt={winner.name} fill className="object-cover" unoptimized />
          </div>
        )}

        <div>
          <h2 className="font-[family-name:var(--font-display)] text-4xl leading-tight text-ink">
            {winner.name}
          </h2>
          <p className="mt-2 text-ink-soft">{winner.address}</p>
          <p className="mt-1 font-mono text-xs text-ink-faint">
            {[
              winner.rating != null ? `★${winner.rating.toFixed(1)}` : null,
              winner.priceLevel ? "$".repeat(winner.priceLevel) : null,
            ]
              .filter(Boolean)
              .join("   ")}
          </p>
        </div>

        <div className="mt-2 w-full max-w-xs divide-y-2 divide-dotted divide-ink-faint border-y-2 border-dotted border-ink-faint">
          {winner.sources.google && (
            <LinkButton
              href={winner.sources.google.url}
              target="_blank"
              rel="noopener noreferrer"
              variant="quiet"
              className="w-full justify-between rounded-none border-none px-1 py-3"
            >
              Google Maps <span aria-hidden="true">↗</span>
            </LinkButton>
          )}
          {winner.sources.yelp && (
            <LinkButton
              href={winner.sources.yelp.url}
              target="_blank"
              rel="noopener noreferrer"
              variant="quiet"
              className="w-full justify-between rounded-none border-none px-1 py-3"
            >
              Yelp <span aria-hidden="true">↗</span>
            </LinkButton>
          )}
          <LinkButton
            href={winner.beliSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="quiet"
            className="w-full justify-between rounded-none border-none px-1 py-3"
          >
            Search on Beli <span aria-hidden="true">↗</span>
          </LinkButton>
        </div>

        <button
          type="button"
          onClick={onStartOver}
          className="mt-2 font-mono text-xs text-ink-soft underline decoration-dotted underline-offset-4 hover:text-ink"
        >
          start a new ticket
        </button>
      </div>
    </div>
  );
}
