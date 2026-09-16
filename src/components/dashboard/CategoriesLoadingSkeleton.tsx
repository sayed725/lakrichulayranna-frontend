import {
  SkeletonPulse,
  TableSkeleton,
  CardGridSkeleton,
} from "@/components/dashboard/DashboardSkeleton";

export default function CategoriesLoadingSkeleton() {
  const TABLE_HEADERS = ["Image", "Name", "Description", "Active Status", "Featured", "Actions"];

  return (
    <>
      {/* Mobile & Tablet Card Skeleton View (< lg) */}
      <CardGridSkeleton count={6}>
        {(i) => (
          <div
            key={i}
            className="bg-white dark:bg-charcoal border border-border/80 dark:border-white/10 rounded-2xl p-3.5 sm:p-4 space-y-3 shadow-xs"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <SkeletonPulse className="w-12 h-12 rounded-xl shrink-0" />
                <div className="space-y-2 flex-1 min-w-0">
                  <SkeletonPulse className="h-4 w-32 sm:w-44 rounded-md" />
                  <SkeletonPulse className="h-3.5 w-24 rounded-md" />
                </div>
              </div>
              <SkeletonPulse className="w-7 h-7 rounded-lg shrink-0" />
            </div>

            <div className="flex items-center justify-between pt-2.5 border-t border-border/50 dark:border-white/5">
              <div className="flex items-center gap-3">
                <SkeletonPulse className="h-3.5 w-12 rounded" />
                <SkeletonPulse className="h-4 w-8 rounded-full" />
              </div>
              <div className="flex items-center gap-3">
                <SkeletonPulse className="h-3.5 w-14 rounded" />
                <SkeletonPulse className="h-4 w-8 rounded-full" />
              </div>
            </div>
          </div>
        )}
      </CardGridSkeleton>

      {/* Desktop Table View Skeleton (>= lg) */}
      <TableSkeleton
        headers={TABLE_HEADERS}
        rows={6}
        renderRow={(i) => (
          <tr key={i}>
            <td className="px-6 py-4">
              <SkeletonPulse className="w-10 h-10 rounded-lg" />
            </td>
            <td className="px-6 py-4">
              <SkeletonPulse className="h-4 w-32 rounded-md" />
            </td>
            <td className="px-6 py-4">
              <SkeletonPulse className="h-3.5 w-48 rounded-md" />
            </td>
            <td className="px-6 py-4">
              <SkeletonPulse className="h-5 w-9 rounded-full" />
            </td>
            <td className="px-6 py-4">
              <SkeletonPulse className="h-5 w-9 rounded-full" />
            </td>
            <td className="px-6 py-4 text-right">
              <SkeletonPulse className="h-7 w-7 rounded-lg ml-auto" />
            </td>
          </tr>
        )}
      />
    </>
  );
}
