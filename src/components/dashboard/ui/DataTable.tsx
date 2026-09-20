import { ReactNode } from "react";

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  emptyMessage = "কোনো ডেটা পাওয়া যায়নি",
  onRowClick,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full bg-card rounded-2xl border border-border overflow-hidden">
        <div className="animate-pulse flex flex-col">
          <div className="h-14 bg-cream-dark/50 dark:bg-charcoal-light/30 border-b border-border" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-card border-b border-border" />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full bg-card rounded-2xl border border-border p-12 text-center">
        <p className="text-muted-foreground font-bengali font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-card rounded-2xl border border-border overflow-x-auto shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-cream/50 dark:bg-charcoal-light/30 border-b border-border">
            {columns.map((col, index) => (
              <th
                key={index}
                className={`p-4 text-xs uppercase font-bold font-bengali text-charcoal dark:text-cream whitespace-nowrap ${
                  col.className || ""
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick?.(row)}
              className={`hover:bg-cream/20 dark:hover:bg-charcoal-light/20 transition-colors ${
                onRowClick ? "cursor-pointer" : ""
              }`}
            >
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className={`p-4 text-sm text-charcoal dark:text-cream ${
                    col.className || ""
                  }`}
                >
                  {typeof col.accessor === "function"
                    ? col.accessor(row)
                    : (row[col.accessor] as ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
