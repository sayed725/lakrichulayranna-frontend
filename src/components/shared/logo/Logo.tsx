import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
};

export function Logo({ className, size = "md" }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-baseline gap-1 font-bold font-bengali transition-transform duration-200 hover:scale-[1.02] group",
        sizeClasses[size],
        className
      )}
    >
      <span className="text-charcoal">লাকড়ি চুলায়</span>
      <span className="text-fire group-hover:text-fire-dark transition-colors duration-200">
        রান্না
      </span>
      {/* Tiny flame dot */}
      <span className="relative inline-block w-1.5 h-1.5 ml-0.5 -translate-y-2">
        <span className="absolute inset-0 rounded-full bg-fire animate-pulse-fire" />
      </span>
    </Link>
  );
}
