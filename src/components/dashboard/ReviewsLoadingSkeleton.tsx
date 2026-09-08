export default function ReviewsLoadingSkeleton() {
  return (
    <div className="border border-border bg-card rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-cream/50 dark:bg-charcoal-light/30 text-charcoal dark:text-cream text-xs uppercase font-bengali">
            <tr>
              <th className="px-6 py-4">Item</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Rating</th>
              <th className="px-6 py-4">Comment</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Featured</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[...Array(10)].map((_, i) => (
              <tr key={i}>
                <td className="px-6 py-4">
                  <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-28 bg-muted animate-pulse rounded mb-1" />
                  <div className="h-3.5 w-36 bg-muted animate-pulse rounded" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded mb-1" />
                  <div className="h-3 w-14 bg-muted animate-pulse rounded" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-5 w-14 bg-muted animate-pulse rounded" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-44 bg-muted animate-pulse rounded" />
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="h-6 w-11 bg-muted animate-pulse rounded-full mx-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="h-6 w-11 bg-muted animate-pulse rounded-full mx-auto" />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="h-8 w-8 bg-muted animate-pulse rounded-lg ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
