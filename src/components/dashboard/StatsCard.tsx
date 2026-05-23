import { ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: number; // percentage
  trendLabel?: string;
  isCurrency?: boolean;
}

export function StatsCard({
  title,
  value,
  icon,
  trend,
  trendLabel,
  isCurrency,
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-border shadow-sm flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-xl bg-fire/10 flex items-center justify-center text-fire">
          {icon}
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-full ${
              trend >= 0
                ? "bg-success/10 text-success"
                : "bg-error/10 text-error"
            }`}
          >
            {trend >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div>
        <h3 className="text-muted font-bengali text-sm font-medium mb-1">
          {title}
        </h3>
        <p className="text-3xl font-bold text-charcoal">
          {isCurrency && "৳ "}
          {value}
        </p>
        {trendLabel && (
          <p className="text-xs text-muted mt-2 font-bengali">{trendLabel}</p>
        )}
      </div>
    </div>
  );
}
