export default function CouponsLoadingSkeleton() {
  return (
    <>
      {/* Mobile & Tablet Card Skeleton View (< lg) */}
      <div className="lg:hidden space-y-3.5">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-charcoal border border-border/80 dark:border-white/10 rounded-2xl p-3.5 sm:p-4 space-y-3 shadow-xs"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-20 bg-cream-dark/50 dark:bg-white/10 animate-pulse rounded-lg" />
                  <div className="h-5 w-16 bg-cream-dark/50 dark:bg-white/10 animate-pulse rounded-md" />
                </div>
                <div className="h-4 w-40 bg-cream-dark/50 dark:bg-white/10 animate-pulse rounded-md" />
              </div>
              <div className="w-7 h-7 bg-cream-dark/50 dark:bg-white/10 animate-pulse rounded-lg shrink-0" />
            </div>

            <div className="flex items-center justify-between border-t border-border/50 dark:border-white/5 pt-2.5">
              <div className="h-4 w-24 bg-cream-dark/40 dark:bg-white/10 animate-pulse rounded" />
              <div className="h-4 w-24 bg-cream-dark/40 dark:bg-white/10 animate-pulse rounded" />
              <div className="h-5 w-9 bg-cream-dark/40 dark:bg-white/10 animate-pulse rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View Skeleton (>= lg) */}
      <div className="hidden lg:block border border-border bg-card rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-cream/50 dark:bg-charcoal-light/30 text-charcoal dark:text-cream text-xs uppercase font-bengali">
              <tr>
                <th className="px-4 py-3 font-bold">Code</th>
                <th className="px-4 py-3 font-bold">Title</th>
                <th className="px-4 py-3 font-bold">Discount</th>
                <th className="px-4 py-3 font-bold">Usage</th>
                <th className="px-4 py-3 font-bold">Expiry</th>
                <th className="px-4 py-3 font-bold text-center">Status</th>
                <th className="px-4 py-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[...Array(8)].map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-3">
                    <div className="h-5 w-20 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded-lg" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-32 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-16 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-16 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-24 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="h-5 w-9 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded-full mx-auto" />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="h-7 w-7 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded-lg ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
