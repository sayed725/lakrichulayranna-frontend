import {
  SkeletonPulse,
  TableSkeleton,
  CardGridSkeleton,
} from "@/components/dashboard/DashboardSkeleton";

export default function ItemsLoadingSkeleton() {
  const TABLE_HEADERS = [
    "Image",
    "Name",
    "Category",
    "Price",
    "Best Selling",
    "Featured",
    "Cat. Featured",
    "New",
    "Status",
    "Actions",
  ];

  return (
    <>
      {/* Mobile & Tablet Card Skeleton View (< lg) */}
      <CardGridSkeleton count={6}>
        {(i) => (
          <div
            key={i}
            className="bg-white dark:bg-charcoal border border-border/80 dark:border-white/10 rounded-2xl p-3.5 sm:p-4 space-y-3 shadow-xs"
          >
            {/* Header: Image, Title, Price & Menu */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <SkeletonPulse className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl shrink-0" />
                <div className="space-y-2 flex-1 min-w-0">
                  <SkeletonPulse className="h-4 w-36 sm:w-48 rounded-md" />
                  <SkeletonPulse className="h-3.5 w-24 rounded-md" />
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <SkeletonPulse className="h-5 w-16 rounded-md" />
                <SkeletonPulse className="w-7 h-7 rounded-lg" />
              </div>
            </div>

            {/* Quick Toggle Controls Grid Skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2.5 border-t border-border/50 dark:border-white/5">
              {[...Array(4)].map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between sm:flex-col sm:justify-between bg-cream/40 dark:bg-white/[0.03] p-2 rounded-xl border border-border/40 dark:border-white/5 min-h-[48px] sm:min-h-[58px]"
                >
                  <SkeletonPulse className="h-3 w-14 rounded" />
                  <SkeletonPulse className="h-4 w-8 rounded-full" />
                </div>
              ))}
              <div className="flex items-center justify-between sm:flex-col sm:justify-between bg-cream/40 dark:bg-white/[0.03] p-2 rounded-xl border border-border/40 dark:border-white/5 min-h-[48px] sm:min-h-[58px] col-span-2 sm:col-span-1">
                <SkeletonPulse className="h-3 w-14 rounded" />
                <SkeletonPulse className="h-4 w-8 rounded-full" />
              </div>
            </div>
          </div>
        )}
      </CardGridSkeleton>

      {/* Desktop Table View Skeleton (>= lg) */}
      <TableSkeleton
        headers={TABLE_HEADERS}
        rows={8}
        renderRow={(i) => (
          <tr key={i}>
            <td className="px-4 py-3">
              <SkeletonPulse className="w-10 h-10 rounded-md" />
            </td>
            <td className="px-4 py-3">
              <SkeletonPulse className="h-4 w-32 rounded mb-1" />
              <SkeletonPulse className="h-3 w-20 rounded" />
            </td>
            <td className="px-4 py-3">
              <SkeletonPulse className="h-4 w-20 rounded" />
            </td>
            <td className="px-4 py-3 text-right">
              <SkeletonPulse className="h-4 w-16 rounded ml-auto" />
            </td>
            <td className="px-4 py-3 text-center">
              <SkeletonPulse className="h-5 w-9 rounded-full mx-auto" />
            </td>
            <td className="px-4 py-3 text-center">
              <SkeletonPulse className="h-5 w-9 rounded-full mx-auto" />
            </td>
            <td className="px-4 py-3 text-center">
              <SkeletonPulse className="h-5 w-9 rounded-full mx-auto" />
            </td>
            <td className="px-4 py-3 text-center">
              <SkeletonPulse className="h-5 w-9 rounded-full mx-auto" />
            </td>
            <td className="px-4 py-3 text-center">
              <SkeletonPulse className="h-5 w-9 rounded-full mx-auto" />
            </td>
            <td className="px-4 py-3 text-right">
              <SkeletonPulse className="h-7 w-7 rounded-lg ml-auto" />
            </td>
          </tr>
        )}
      />
    </>
  );
}
