import { AppFlow } from "@/components/AppFlow";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-1 justify-center sm:items-center sm:p-6">
      <div className="flex min-h-dvh w-full max-w-md flex-col sm:min-h-0 sm:-rotate-[0.4deg]">
        <div className="ticket-perforation shrink-0" />
        <div className="relative flex flex-1 flex-col bg-paper shadow-[0_18px_40px_-12px_var(--table-shadow)] sm:rounded-b-sm">
          <AppFlow />
        </div>
      </div>
    </div>
  );
}
