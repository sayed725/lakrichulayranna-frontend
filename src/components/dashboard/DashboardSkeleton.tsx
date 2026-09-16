import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonPulseProps {
  className?: string;
}

export function SkeletonPulse({ className }: SkeletonPulseProps) {
  return (
    <div
      className={cn(
        "bg-cream-dark/40 dark:bg-white/10 animate-pulse rounded",
        className
      )}
    />
  );
}

interface TableSkeletonProps {
  headers: string[];
  rows?: number;
  renderRow?: (index: number) => React.ReactNode;
}

export function TableSkeleton({
  headers,
  rows = 8,
  renderRow,
}: TableSkeletonProps) {
  return (
    <div className="hidden lg:block border border-border bg-card rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-cream/50 dark:bg-charcoal-light/30 text-charcoal dark:text-cream text-xs uppercase font-bengali">
            <tr>
              {headers.map((header, idx) => (
                <th
                  key={idx}
                  className={cn(
                    "px-4 py-3 font-bold",
                    header.toLowerCase().includes("orders") ||
                      header.toLowerCase().includes("status")
                      ? "text-center"
                      : "",
                    header.toLowerCase().includes("action")
                      ? "text-right"
                      : ""
                  )}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[...Array(rows)].map((_, i) =>
              renderRow ? (
                renderRow(i)
              ) : (
                <tr key={i}>
                  {headers.map((_, colIdx) => (
                    <td key={colIdx} className="px-4 py-3">
                      <SkeletonPulse className="h-4 w-full max-w-[120px]" />
                    </td>
                  ))}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface CardGridSkeletonProps {
  count?: number;
  children: (index: number) => React.ReactNode;
  className?: string;
}

export function CardGridSkeleton({
  count = 6,
  children,
  className = "lg:hidden space-y-3.5",
}: CardGridSkeletonProps) {
  return (
    <div className={className}>
      {[...Array(count)].map((_, i) => children(i))}
    </div>
  );
}
