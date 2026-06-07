export default function OrdersLoadingSkeleton() {
  return (
    <div className="border border-border bg-card rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-cream/50 dark:bg-charcoal-light/30 text-charcoal dark:text-cream text-xs uppercase font-bengali">
            <tr>
              <th className="px-6 py-4">Order Number</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4 text-right">Total</th>
              <th className="px-6 py-4 text-center">Payment</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Invoice</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[...Array(10)].map((_, i) => (
              <tr key={i}>
                <td className="px-6 py-4">
                  <div className="h-5 w-24 bg-muted animate-pulse rounded mb-1" />
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-5 w-32 bg-muted animate-pulse rounded mb-1" />
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="h-5 w-16 bg-muted animate-pulse rounded ml-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="h-6 w-12 bg-muted animate-pulse rounded mx-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="h-8 w-20 bg-muted animate-pulse rounded mx-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="h-8 w-8 bg-muted animate-pulse rounded mx-auto" />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
