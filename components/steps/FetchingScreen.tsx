import { TicketHeader } from "@/components/ticket/TicketHeader";

export function FetchingScreen() {
  return (
    <div className="flex flex-1 flex-col">
      <TicketHeader eyebrow="putting in the order" />

      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="flex flex-col gap-1.5" aria-hidden="true">
          <span className="h-1.5 w-40 origin-left animate-[print_1.1s_ease-in-out_infinite] bg-ink/70" />
          <span className="h-1.5 w-28 origin-left animate-[print_1.1s_ease-in-out_infinite_0.15s] bg-ink/50" />
          <span className="h-1.5 w-32 origin-left animate-[print_1.1s_ease-in-out_infinite_0.3s] bg-ink/30" />
        </div>
        <p role="status" className="font-mono text-sm text-ink-soft">
          finding nearby options…
        </p>
      </div>
    </div>
  );
}
