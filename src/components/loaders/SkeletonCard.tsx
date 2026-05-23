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
      <div className="aspect-[4/3] skeleton" />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Category badge */}
        <div className="w-16 h-5 rounded-full skeleton" />

        {/* Title */}
        <div className="h-5 w-3/4 rounded skeleton" />

        {/* Description */}
        <div className="space-y-1.5">
          <div className="h-3 w-full rounded skeleton" />
          <div className="h-3 w-2/3 rounded skeleton" />
        </div>

        {/* Price + Button row */}
        <div className="flex items-center justify-between pt-2">
          <div className="h-6 w-20 rounded skeleton" />
          <div className="h-9 w-24 rounded-lg skeleton" />
        </div>
      </div>
    </div>
  );
}
