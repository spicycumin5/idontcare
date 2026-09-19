import { useId } from "react";

// Derived from React's stable per-instance id rather than Math.random(),
// so it stays pure during render (SSR-safe, no effect needed).
export function useTicketNumber(): string {
  const id = useId();
  const hash = Array.from(id).reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) % 10000, 0);
  return String(hash).padStart(4, "0");
}
