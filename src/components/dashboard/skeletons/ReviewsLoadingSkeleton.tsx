export default function ReviewsLoadingSkeleton() {
  return (
    <>
      {/* Mobile & Tablet Card Skeleton View (< lg) */}
      <div className="lg:hidden space-y-3.5">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-card border border-border/80 rounded-2xl p-4 space-y-3 shadow-xs"
          >
            {/* Header: Item & Rating & Actions */}
            <div className="flex items-start justify-between gap-2 border-b border-border/50 pb-2.5">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="h-4 w-40 sm:w-56 bg-cream-dark/50 dark:bg-white/10 animate-pulse rounded-md" />
                <div className="flex items-center gap-2">
                  <div className="h-4 w-12 bg-cream-dark/40 dark:bg-white/10 animate-pulse rounded-md" />
                  <div className="h-3.5 w-28 bg-cream-dark/40 dark:bg-white/10 animate-pulse rounded-md" />
                </div>
              </div>
              <div className="w-7 h-7 bg-cream-dark/50 dark:bg-white/10 animate-pulse rounded-lg shrink-0" />
            </div>

            {/* Customer Info Box */}
            <div className="bg-muted/10 p-2.5 rounded-xl border border-border/40 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="h-3.5 w-32 bg-cream-dark/50 dark:bg-white/10 animate-pulse rounded" />
                <div className="h-3.5 w-4 bg-cream-dark/40 dark:bg-white/10 animate-pulse rounded" />
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-border/30 pt-1.5">
                <div className="h-3.5 w-44 bg-cream-dark/40 dark:bg-white/10 animate-pulse rounded" />
                <div className="h-3.5 w-4 bg-cream-dark/40 dark:bg-white/10 animate-pulse rounded" />
              </div>
            </div>

            {/* Comment Box */}
            <div className="h-12 w-full bg-cream/30 dark:bg-charcoal-light/20 border border-border/40 animate-pulse rounded-xl" />

            {/* Switches Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/50">
              <div className="flex items-center justify-between bg-muted/10 px-3 py-2 rounded-xl border border-border/40">
                <div className="h-3.5 w-14 bg-cream-dark/40 dark:bg-white/10 animate-pulse rounded" />
                <div className="h-5 w-9 bg-cream-dark/40 dark:bg-white/10 animate-pulse rounded-full" />
              </div>
              <div className="flex items-center justify-between bg-muted/10 px-3 py-2 rounded-xl border border-border/40">
                <div className="h-3.5 w-14 bg-cream-dark/40 dark:bg-white/10 animate-pulse rounded" />
                <div className="h-5 w-9 bg-cream-dark/40 dark:bg-white/10 animate-pulse rounded-full" />
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
                <th className="px-4 py-3 font-bold">Item</th>
                <th className="px-4 py-3 font-bold">Customer</th>
                <th className="px-4 py-3 font-bold">Date</th>
                <th className="px-4 py-3 font-bold">Rating</th>
                <th className="px-4 py-3 font-bold">Comment</th>
                <th className="px-4 py-3 font-bold text-center">Status</th>
                <th className="px-4 py-3 font-bold text-center">Featured</th>
                <th className="px-4 py-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[...Array(8)].map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-3">
                    <div className="h-4 w-32 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-28 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded mb-1" />
                    <div className="h-3 w-36 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-24 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded mb-1" />
                    <div className="h-3 w-14 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-14 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-44 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="h-5 w-9 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded-full mx-auto" />
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
