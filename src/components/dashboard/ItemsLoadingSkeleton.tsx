export default function ItemsLoadingSkeleton() {
  return (
    <>
      {/* Mobile & Tablet Card Skeleton View (< lg) */}
      <div className="lg:hidden space-y-3.5">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-charcoal border border-border/80 dark:border-white/10 rounded-2xl p-3.5 sm:p-4 space-y-3 shadow-xs"
          >
            {/* Header: Image, Title, Price & Menu */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-cream-dark/50 dark:bg-white/10 animate-pulse rounded-xl shrink-0" />
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="h-4 w-36 sm:w-48 bg-cream-dark/50 dark:bg-white/10 animate-pulse rounded-md" />
                  <div className="h-3.5 w-24 bg-cream-dark/50 dark:bg-white/10 animate-pulse rounded-md" />
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="h-5 w-16 bg-cream-dark/50 dark:bg-white/10 animate-pulse rounded-md" />
                <div className="w-7 h-7 bg-cream-dark/50 dark:bg-white/10 animate-pulse rounded-lg" />
              </div>
            </div>

            {/* Quick Toggle Controls Grid Skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2.5 border-t border-border/50 dark:border-white/5">
              {[...Array(4)].map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between sm:flex-col sm:justify-between bg-cream/40 dark:bg-white/[0.03] p-2 rounded-xl border border-border/40 dark:border-white/5 min-h-[48px] sm:min-h-[58px]"
                >
                  <div className="h-3 w-14 bg-cream-dark/40 dark:bg-white/10 animate-pulse rounded" />
                  <div className="h-4 w-8 bg-cream-dark/40 dark:bg-white/10 animate-pulse rounded-full" />
                </div>
              ))}
              <div className="flex items-center justify-between sm:flex-col sm:justify-between bg-cream/40 dark:bg-white/[0.03] p-2 rounded-xl border border-border/40 dark:border-white/5 min-h-[48px] sm:min-h-[58px] col-span-2 sm:col-span-1">
                <div className="h-3 w-14 bg-cream-dark/40 dark:bg-white/10 animate-pulse rounded" />
                <div className="h-4 w-8 bg-cream-dark/40 dark:bg-white/10 animate-pulse rounded-full" />
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
                <th className="px-4 py-3 w-16 font-bold">Image</th>
                <th className="px-4 py-3 font-bold">Name</th>
                <th className="px-4 py-3 font-bold">Category</th>
                <th className="px-4 py-3 font-bold text-right">Price</th>
                <th className="px-4 py-3 font-bold text-center">Best Selling</th>
                <th className="px-4 py-3 font-bold text-center">Featured</th>
                <th className="px-4 py-3 font-bold text-center">Cat. Featured</th>
                <th className="px-4 py-3 font-bold text-center">New</th>
                <th className="px-4 py-3 font-bold text-center">Status</th>
                <th className="px-4 py-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[...Array(8)].map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded-md" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-32 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded mb-1" />
                    <div className="h-3 w-20 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-20 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded" />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="h-4 w-16 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded ml-auto" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="h-5 w-9 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded-full mx-auto" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="h-5 w-9 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded-full mx-auto" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="h-5 w-9 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded-full mx-auto" />
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
