import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "light";
}

const sizeClasses = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
};

const imageSizes = {
  sm: { width: 28, height: 28 },
  md: { width: 36, height: 36 },
  lg: { width: 48, height: 48 },
};

export function Logo({ className, size = "md", variant = "default" }: LogoProps) {
  const { width, height } = imageSizes[size];
  const isLight = variant === "light";
  
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2.5 font-bold font-bengali transition-transform duration-200 hover:scale-[1.02] group",
        className
      )}
    >
      <img
        src="/lakri_chulay_ranna_logo.png"
        alt="লাকড়ি চুলায় রান্না লোগো"
        style={{ height: `${height}px`, width: "auto" }}
        className="object-contain shrink-0"
      />
      <div className={cn("inline-flex items-baseline gap-1", sizeClasses[size])}>
        <span className={isLight ? "text-cream" : "text-charcoal"}>লাকড়ি চুলায়</span>
        <span className="text-fire group-hover:text-fire-dark transition-colors duration-200">
          রান্না
        </span>
        {/* Tiny flame dot */}
        <span className="relative inline-block w-1.5 h-1.5 ml-0.5 -translate-y-2">
          <span className="absolute inset-0 rounded-full bg-fire animate-pulse-fire" />
        </span>
      </div>
    </Link>
  );
}
