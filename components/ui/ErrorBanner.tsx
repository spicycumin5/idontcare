export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-sm border-2 border-stamp/40 bg-stamp/10 px-4 py-3 text-sm text-stamp-dark">
      {message}
    </div>
  );
}
