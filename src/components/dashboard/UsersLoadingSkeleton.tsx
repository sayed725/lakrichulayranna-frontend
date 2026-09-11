export default function UsersLoadingSkeleton() {
  return (
    <>
      {/* Mobile & Tablet Card Skeleton View (< lg) */}
      <div className="lg:hidden space-y-3.5">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-card border border-border/80 rounded-2xl p-4 space-y-3 shadow-xs"
          >
            {/* Top Bar: Avatar, User Name, Joined Date & Actions */}
            <div className="flex items-center justify-between gap-3 border-b border-border/50 pb-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-full bg-cream-dark/50 dark:bg-white/10 animate-pulse shrink-0" />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="h-4 w-32 sm:w-48 bg-cream-dark/50 dark:bg-white/10 animate-pulse rounded-md" />
                  <div className="h-3 w-24 bg-cream-dark/40 dark:bg-white/10 animate-pulse rounded" />
                </div>
              </div>
              <div className="w-7 h-7 bg-cream-dark/50 dark:bg-white/10 animate-pulse rounded-lg shrink-0" />
            </div>

            {/* Contact Box */}
            <div className="bg-muted/10 p-2.5 rounded-xl border border-border/40 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="h-3.5 w-40 bg-cream-dark/40 dark:bg-white/10 animate-pulse rounded" />
                <div className="h-3.5 w-4 bg-cream-dark/40 dark:bg-white/10 animate-pulse rounded" />
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-border/30 pt-1.5">
                <div className="h-3.5 w-32 bg-cream-dark/40 dark:bg-white/10 animate-pulse rounded" />
                <div className="h-3.5 w-4 bg-cream-dark/40 dark:bg-white/10 animate-pulse rounded" />
              </div>
            </div>

            {/* Role, Orders, Status Bar */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/50">
              <div className="h-6 w-20 bg-cream-dark/40 dark:bg-white/10 animate-pulse rounded-md" />
              <div className="h-6 w-16 bg-cream-dark/40 dark:bg-white/10 animate-pulse rounded-full" />
              <div className="h-7 w-24 bg-cream-dark/40 dark:bg-white/10 animate-pulse rounded-lg" />
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
                <th className="px-4 py-3 font-bold">User</th>
                <th className="px-4 py-3 font-bold">Contact</th>
                <th className="px-4 py-3 font-bold">Role</th>
                <th className="px-4 py-3 font-bold text-center">Orders</th>
                <th className="px-4 py-3 font-bold text-center">Status</th>
                <th className="px-4 py-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[...Array(8)].map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded-full shrink-0" />
                      <div className="space-y-1.5">
                        <div className="h-4 w-32 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded" />
                        <div className="h-3 w-24 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div className="h-4 w-36 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded" />
                      <div className="h-3 w-28 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-5 w-20 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded-md" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="h-5 w-12 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded-full mx-auto" />
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
