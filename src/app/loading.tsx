export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cream">
      {/* Flame animation */}
      <div className="relative mb-8">
        {/* Outer glow */}
        <div className="absolute inset-0 rounded-full bg-fire/20 blur-xl animate-pulse-fire" />

        {/* Flame SVG */}
        <svg
          width="80"
          height="100"
          viewBox="0 0 80 100"
          className="animate-flame drop-shadow-lg"
        >
          {/* Outer flame */}
          <path
            d="M40 5 C20 30, 5 50, 10 70 C15 90, 30 95, 40 95 C50 95, 65 90, 70 70 C75 50, 60 30, 40 5Z"
            fill="#E85D24"
            opacity="0.9"
          />
          {/* Middle flame */}
          <path
            d="M40 20 C28 40, 18 55, 22 72 C25 85, 33 90, 40 90 C47 90, 55 85, 58 72 C62 55, 52 40, 40 20Z"
            fill="#F4845F"
            opacity="0.85"
          />
          {/* Inner flame */}
          <path
            d="M40 38 C33 50, 28 60, 30 72 C32 80, 36 85, 40 85 C44 85, 48 80, 50 72 C52 60, 47 50, 40 38Z"
            fill="#FCD34D"
            opacity="0.9"
          />
          {/* Core */}
          <ellipse cx="40" cy="78" rx="6" ry="8" fill="#FEF3C7" opacity="0.8" />
        </svg>

        {/* Sparks */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
          <div className="w-1.5 h-1.5 rounded-full bg-fire animate-float opacity-60" style={{ animationDelay: "0s" }} />
        </div>
        <div className="absolute -top-4 left-1/3">
          <div className="w-1 h-1 rounded-full bg-fire-light animate-float opacity-40" style={{ animationDelay: "0.5s" }} />
        </div>
        <div className="absolute -top-3 right-1/3">
          <div className="w-1 h-1 rounded-full bg-terracotta animate-float opacity-50" style={{ animationDelay: "1s" }} />
        </div>
      </div>

      {/* Brand text */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-charcoal font-bengali mb-2">
          লাকড়ি চুলায় <span className="text-fire">রান্না</span>
        </h2>
        <div className="flex items-center gap-2 justify-center text-muted">
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-fire animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 rounded-full bg-fire-light animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 rounded-full bg-terracotta animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <span className="text-sm font-bengali">লোড হচ্ছে</span>
        </div>
      </div>
    </div>
  );
}
