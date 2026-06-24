export default function LoadingState({ label = "Loading" }) {
  return (
    <div className="flex min-h-56 items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-gold border-t-brand-red" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
