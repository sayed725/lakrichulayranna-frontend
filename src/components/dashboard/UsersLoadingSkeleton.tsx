import {
  SkeletonPulse,
  TableSkeleton,
  CardGridSkeleton,
} from "@/components/dashboard/DashboardSkeleton";

export default function UsersLoadingSkeleton() {
  const TABLE_HEADERS = ["User", "Contact", "Role", "Orders", "Status", "Actions"];

  return (
    <>
      {/* Mobile & Tablet Card Skeleton View (< lg) */}
      <CardGridSkeleton count={6}>
        {(i) => (
          <div
            key={i}
            className="bg-card border border-border/80 rounded-2xl p-4 space-y-3 shadow-xs"
          >
            {/* Top Bar: Avatar, User Name, Joined Date & Actions */}
            <div className="flex items-center justify-between gap-3 border-b border-border/50 pb-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <SkeletonPulse className="w-10 h-10 rounded-full shrink-0" />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <SkeletonPulse className="h-4 w-32 sm:w-48" />
                  <SkeletonPulse className="h-3 w-24" />
                </div>
              </div>
              <SkeletonPulse className="w-7 h-7 rounded-lg shrink-0" />
            </div>

            {/* Contact Box */}
            <div className="bg-muted/10 p-2.5 rounded-xl border border-border/40 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <SkeletonPulse className="h-3.5 w-40" />
                <SkeletonPulse className="h-3.5 w-4" />
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-border/30 pt-1.5">
                <SkeletonPulse className="h-3.5 w-32" />
                <SkeletonPulse className="h-3.5 w-4" />
              </div>
            </div>

            {/* Role, Orders, Status Bar */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/50">
              <SkeletonPulse className="h-6 w-20 rounded-md" />
              <SkeletonPulse className="h-6 w-16 rounded-full" />
              <SkeletonPulse className="h-7 w-24 rounded-lg" />
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
              <div className="flex items-center gap-3">
                <SkeletonPulse className="w-9 h-9 rounded-full shrink-0" />
                <div className="space-y-1.5">
                  <SkeletonPulse className="h-4 w-32" />
                  <SkeletonPulse className="h-3 w-24" />
                </div>
              </div>
            </td>
            <td className="px-4 py-3">
              <div className="space-y-1">
                <SkeletonPulse className="h-4 w-36" />
                <SkeletonPulse className="h-3 w-28" />
              </div>
            </td>
            <td className="px-4 py-3">
              <SkeletonPulse className="h-5 w-20 rounded-md" />
            </td>
            <td className="px-4 py-3 text-center">
              <SkeletonPulse className="h-5 w-12 rounded-full mx-auto" />
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
