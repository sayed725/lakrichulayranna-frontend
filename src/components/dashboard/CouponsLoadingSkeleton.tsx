export default function CouponsLoadingSkeleton() {
  return (
    <div className="border border-border bg-card rounded-xl overflow-hidden shadow-sm">
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
  );
}
