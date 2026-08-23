import { ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
    <Card className="bg-white border border-border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full py-4 sm:py-5">
      <CardContent className="flex flex-col h-full justify-between p-0 px-4 sm:px-5">
        <div className="flex justify-between items-start mb-3 sm:mb-4">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-fire/10 flex items-center justify-center text-fire shrink-0 [&_svg]:size-4 sm:[&_svg]:size-5">
            {icon}
          </div>
          {trend !== undefined && (
            <div
              className={`flex items-center gap-0.5 sm:gap-1 text-[11px] sm:text-xs font-semibold px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full shrink-0 ${
                trend >= 0
                  ? "bg-success/10 text-success"
                  : "bg-error/10 text-error"
              }`}
            >
              {trend >= 0 ? <ArrowUpRight className="size-3 sm:size-3.5" /> : <ArrowDownRight className="size-3 sm:size-3.5" />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>

        <div>
          <h3 className="text-muted font-bengali text-xs sm:text-sm font-medium mb-0.5 sm:mb-1">
            {title}
          </h3>
          <p className="text-xl sm:text-2xl font-bold text-charcoal tracking-tight">
            {isCurrency && "৳ "}
            {value}
          </p>
          {trendLabel && (
            <p className="text-[10px] sm:text-xs text-muted mt-1 sm:mt-1.5 font-bengali">{trendLabel}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
