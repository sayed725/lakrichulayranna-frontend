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
  isLoading?: boolean;
}

export function StatsCard({
  title,
  value,
  icon,
  trend,
  trendLabel,
  isCurrency,
  isLoading,
}: StatsCardProps) {
  return (
    <Card className="relative overflow-hidden bg-card/90 backdrop-blur-md border border-border/80 shadow-sm hover:shadow-xl hover:border-fire/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full py-4 sm:py-5 rounded-2xl sm:rounded-3xl group">
      {/* Subtle Glow backdrop on hover */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 sm:w-24 h-20 sm:h-24 rounded-full bg-fire/5 group-hover:bg-fire/15 blur-xl pointer-events-none transition-all duration-300" />
      
      <CardContent className="flex flex-col h-full justify-between p-0 px-4 sm:px-5 lg:px-6">
        <div className="flex justify-between items-start mb-3 sm:mb-4">
          <div className="w-10 h-10 sm:w-11 lg:w-12 sm:h-11 lg:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-fire/15 to-amber-500/10 text-fire flex items-center justify-center shrink-0 border border-fire/20 group-hover:scale-110 group-hover:bg-fire group-hover:text-white transition-all duration-300 shadow-sm [&_svg]:size-4.5 sm:[&_svg]:size-5">
            {icon}
          </div>
          {trend !== undefined && !isLoading && (
            <div
              className={`flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shrink-0 border ${
                trend >= 0
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
              }`}
            >
              {trend >= 0 ? <ArrowUpRight className="size-3 sm:size-3.5" /> : <ArrowDownRight className="size-3 sm:size-3.5" />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>

        <div>
          <h3 className="text-muted-foreground font-bengali text-xs sm:text-sm font-semibold mb-0.5 sm:mb-1">
            {title}
          </h3>
          {isLoading ? (
            <div className="h-7 sm:h-8 w-20 sm:w-24 bg-cream-dark/50 dark:bg-charcoal-light/60 rounded-xl animate-pulse my-1" />
          ) : (
            <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-charcoal dark:text-cream tracking-tight">
              {isCurrency && "৳ "}
              {value}
            </p>
          )}
          {trendLabel && (
            <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-1 sm:mt-1.5 font-bengali truncate">{trendLabel}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
