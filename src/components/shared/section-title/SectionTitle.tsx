import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  titleBn: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}

export function SectionTitle({
  title,
  titleBn,
  subtitle,
  align = "center",
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "mb-10",
        align === "center" && "text-center",
        align === "left" && "text-left",
        className
      )}
    >
      {/* Bengali title */}
      <h2
        className={cn(
          "text-3xl sm:text-4xl font-bold font-bengali text-charcoal",
          "[&>[data-theme='dark']]:text-cream"
        )}
      >
        {titleBn}
      </h2>

      {/* English subtitle */}
      <p className="text-sm uppercase tracking-[0.2em] text-muted mt-1 font-latin">
        {title}
      </p>

      {/* Decorative fire underline */}
      <div
        className={cn(
          "mt-4 flex items-center gap-2",
          align === "center" && "justify-center",
          align === "left" && "justify-start"
        )}
      >
        <div className="h-0.5 w-8 bg-gradient-to-r from-transparent to-fire" />
        <div className="h-1 w-12 rounded-full bg-gradient-to-r from-fire to-terracotta" />
        <div className="h-0.5 w-8 bg-gradient-to-l from-transparent to-terracotta" />
      </div>

      {/* Optional subtitle */}
      {subtitle && (
        <p className="mt-4 text-muted text-base max-w-2xl mx-auto font-bengali leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
