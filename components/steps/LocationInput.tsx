import { useState } from "react";

import { TicketHeader } from "@/components/ticket/TicketHeader";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { useGeolocation } from "@/hooks/useGeolocation";
import type { LocationQuery } from "@/lib/types";

export function LocationInput({
  onSubmit,
  error,
}: {
  onSubmit: (location: LocationQuery) => void;
  error: string | null;
}) {
  const [text, setText] = useState("");
  const { loading, error: geoError, requestLocation } = useGeolocation();

  async function handleUseLocation() {
    try {
      const { lat, lng } = await requestLocation();
      onSubmit({ mode: "coords", lat, lng });
    } catch {
      // error surfaced via geoError
    }
  }

  function handleTextSubmit() {
    if (!text.trim()) return;
    onSubmit({ mode: "text", text: text.trim() });
  }

  return (
    <div className="flex flex-1 flex-col">
      <TicketHeader eyebrow="where's the table" />

      <div className="flex flex-1 flex-col justify-center gap-6 px-6 py-10">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-4xl text-ink">
            Where are you sitting?
          </h2>
          <p className="mt-1 text-ink-soft">We&apos;ll pull up what&apos;s nearby.</p>
        </div>

        {(error || geoError) && <ErrorBanner message={error ?? geoError ?? ""} />}

        <Button onClick={handleUseLocation} disabled={loading} className="w-full">
          {loading ? "Locating…" : "Use my current location"}
        </Button>

        <div className="flex items-center gap-3 font-mono text-xs text-ink-faint">
          <div className="h-px flex-1 bg-paper-line" />
          or type it in
          <div className="h-px flex-1 bg-paper-line" />
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="City, neighborhood, address…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
            className="flex-1 rounded-sm border-2 border-ink/20 bg-transparent px-4 py-3 text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none"
          />
          <Button variant="outline" onClick={handleTextSubmit} disabled={!text.trim()}>
            Go
          </Button>
        </div>
      </div>
    </div>
  );
}
