import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl overflow-hidden bg-white border border-border",
        className
      )}
    >
      {/* Image skeleton */}
      <div className="aspect-[4/3] lg:aspect-[1.6/1] skeleton bg-cream-dark/30 animate-pulse" />

      {/* Content skeleton */}
      <div className="p-3 sm:px-4 sm:pt-4 sm:pb-0 pb-0 flex flex-col flex-grow">
        {/* Title & Weight row */}
        <div className="flex items-start justify-between gap-2 min-h-[2.5rem]">
          <div className="h-5 w-2/3 rounded-lg skeleton bg-cream-dark/50 animate-pulse" />
          <div className="h-5 w-12 rounded-md skeleton bg-cream-dark/30 animate-pulse" />
        </div>
      </div>

      {/* Bottom Container skeleton */}
      <div className="p-3 sm:px-4 sm:pb-4 sm:pt-1 pb-3 pt-1 space-y-2">
        {/* Pricing */}
        <div className="flex items-center justify-between">
          <div className="h-6 w-16 rounded-lg skeleton bg-cream-dark/50 animate-pulse" />
        </div>

        {/* Add to Cart Button */}
        <div className="h-9 sm:h-10 w-full rounded-xl skeleton bg-cream-dark/50 animate-pulse" />
      </div>
    </div>
  );
}
