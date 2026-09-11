export default function OrdersLoadingSkeleton() {
  return (
    <>
      {/* Mobile & Tablet Card Skeleton View (< lg) */}
      <div className="lg:hidden space-y-3.5">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-charcoal border border-border/80 dark:border-white/10 rounded-2xl p-3.5 sm:p-4 space-y-3 shadow-xs"
          >
            {/* Top Row Skeleton */}
            <div className="flex items-center justify-between gap-2 border-b border-border/50 dark:border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <div className="h-4 w-20 bg-cream-dark/50 dark:bg-white/10 animate-pulse rounded" />
                <div className="h-4 w-24 bg-cream-dark/50 dark:bg-white/10 animate-pulse rounded-full" />
              </div>
              <div className="h-5 w-16 bg-cream-dark/50 dark:bg-white/10 animate-pulse rounded" />
            </div>

            {/* Bottom Row Skeleton */}
            <div className="flex items-center justify-between gap-2">
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-32 bg-cream-dark/50 dark:bg-white/10 animate-pulse rounded" />
                <div className="h-3 w-28 bg-cream-dark/50 dark:bg-white/10 animate-pulse rounded" />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex flex-col items-end gap-1">
                  <div className="h-5 w-16 bg-cream-dark/50 dark:bg-white/10 animate-pulse rounded-full" />
                  <div className="h-3 w-10 bg-cream-dark/50 dark:bg-white/10 animate-pulse rounded" />
                </div>
                <div className="w-7 h-7 bg-cream-dark/50 dark:bg-white/10 animate-pulse rounded-lg" />
              </div>
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
                <th className="px-4 py-3 font-bold">Order Number</th>
                <th className="px-4 py-3 font-bold">Order From</th>
                <th className="px-4 py-3 font-bold">Customer</th>
                <th className="px-4 py-3 font-bold text-right">Total</th>
                <th className="px-4 py-3 font-bold text-center">Payment</th>
                <th className="px-4 py-3 font-bold text-center">Status</th>
                <th className="px-4 py-3 font-bold text-center">Invoice</th>
                <th className="px-4 py-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[...Array(8)].map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-3">
                    <div className="h-4 w-20 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded mb-1" />
                    <div className="h-3 w-16 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-24 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded mb-1" />
                    <div className="h-3 w-20 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-24 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded mb-1" />
                    <div className="h-3 w-20 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded" />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="h-4 w-16 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded ml-auto" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="h-5 w-12 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded-full mx-auto" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="h-7 w-24 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded-md mx-auto" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="h-7 w-7 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded-full mx-auto" />
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
