export const metadata = {
  title: "Offline | Chelsea FC Hub",
};

export default function OfflinePage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="rounded-xl bg-gradient-to-br from-chelsea-blue to-chelsea-blue-dark text-white p-12 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">You&apos;re Offline</h1>
        <p className="text-white/80 text-sm">
          Chelsea FC Hub will be back when your connection returns. Check your
          network and try again.
        </p>
      </div>
    </div>
  );
}
