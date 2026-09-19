import { useTicketNumber } from "@/hooks/useTicketNumber";

export function TicketHeader({ eyebrow }: { eyebrow?: string }) {
  const ticketNumber = useTicketNumber();

  return (
    <div className="flex items-baseline justify-between border-b-2 border-dotted border-ink-faint px-5 pb-3 pt-5 font-mono text-xs text-ink-soft">
      <span>no. {ticketNumber}</span>
      <span>{eyebrow ?? "table for whoever"}</span>
    </div>
  );
}
