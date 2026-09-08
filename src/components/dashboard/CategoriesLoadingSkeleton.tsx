export default function CategoriesLoadingSkeleton() {
  return (
    <div className="border border-border bg-card rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-cream/50 dark:bg-charcoal-light/30 text-charcoal dark:text-cream text-xs uppercase font-bengali">
            <tr>
              <th className="px-4 py-3 w-16 font-bold">Image</th>
              <th className="px-4 py-3 font-bold">Name</th>
              <th className="px-4 py-3 font-bold">Items</th>
              <th className="px-4 py-3 font-bold text-center">Featured</th>
              <th className="px-4 py-3 font-bold text-center">Status</th>
              <th className="px-4 py-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[...Array(6)].map((_, i) => (
              <tr key={i}>
                <td className="px-4 py-3">
                  <div className="w-10 h-10 bg-muted animate-pulse rounded-md" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-32 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded mb-1" />
                  <div className="h-3 w-24 bg-cream-dark/40 dark:bg-charcoal-light/60 animate-pulse rounded" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-5 w-8 bg-muted animate-pulse rounded-full" />
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
  );
}
