export default function ReviewsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded" />
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1 h-11 bg-muted animate-pulse rounded" />
        <div className="h-11 w-[130px] bg-muted animate-pulse rounded" />
        <div className="h-11 w-[130px] bg-muted animate-pulse rounded" />
        <div className="h-11 w-[180px] bg-muted animate-pulse rounded" />
      </div>

      <div className="border bg-card rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-cream/50 dark:bg-charcoal-light/30 text-charcoal dark:text-cream text-xs uppercase">
              <tr>
                <th className="px-6 py-4">Item & Customer</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Comment</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4">
                    <div className="h-5 w-32 bg-muted animate-pulse rounded mb-1" />
                    <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-5 w-16 bg-muted animate-pulse rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="h-6 w-20 bg-muted animate-pulse rounded mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                      <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
