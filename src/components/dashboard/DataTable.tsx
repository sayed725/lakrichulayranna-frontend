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
      <div className="w-full bg-white rounded-2xl border border-border overflow-hidden">
        <div className="animate-pulse flex flex-col">
          <div className="h-14 bg-cream-dark/50 border-b border-border" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-white border-b border-border" />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full bg-white rounded-2xl border border-border p-12 text-center">
        <p className="text-muted font-bengali font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-border overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-cream-dark/30 border-b border-border">
            {columns.map((col, index) => (
              <th
                key={index}
                className={`p-4 text-sm font-bold font-bengali text-charcoal whitespace-nowrap ${
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
              className={`hover:bg-cream-dark/10 transition-colors ${
                onRowClick ? "cursor-pointer" : ""
              }`}
            >
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className={`p-4 text-sm text-charcoal ${
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
