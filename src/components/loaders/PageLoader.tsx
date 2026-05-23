export function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cream/80 backdrop-blur-sm">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 rounded-full border-4 border-fire/20" />
        {/* Spinning fire arc */}
        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-fire animate-spin-slow" />
        {/* Center flame dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-fire animate-pulse-fire" />
        </div>
      </div>
      <p className="mt-4 text-sm font-bengali text-muted animate-pulse">
        লোড হচ্ছে...
      </p>
    </div>
  );
}
