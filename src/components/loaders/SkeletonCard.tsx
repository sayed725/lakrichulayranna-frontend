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
      <div className="p-3 sm:p-4 flex flex-col flex-grow space-y-3">
        {/* Title & Weight row */}
        <div className="flex items-start justify-between gap-2 min-h-[2.5rem]">
          <div className="h-5 w-2/3 rounded-lg skeleton bg-cream-dark/50 animate-pulse" />
          <div className="h-5 w-12 rounded-md skeleton bg-cream-dark/30 animate-pulse" />
        </div>

        {/* Pricing and Cart Action */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/80">
          <div className="h-6 w-16 rounded-lg skeleton bg-cream-dark/50 animate-pulse" />
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl skeleton bg-cream-dark/50 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
