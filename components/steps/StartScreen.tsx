import { TicketHeader } from "@/components/ticket/TicketHeader";
import { Button } from "@/components/ui/Button";

export function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-1 flex-col">
      <TicketHeader eyebrow="new ticket" />

      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-10 text-center">
        <div>
          <p className="font-mono text-xs tracking-wide text-ink-faint">party of however-many</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-6xl leading-none text-ink">
            I don&apos;t care
          </h1>
          <p className="mx-auto mt-4 max-w-[26ch] text-ink-soft">
            Pull up what&apos;s nearby, cross off the no&apos;s, and let the ticket pick for the table.
          </p>
        </div>

        <Button onClick={onStart} className="w-full max-w-xs -rotate-1">
          Start the ticket
        </Button>
      </div>
    </div>
  );
}
