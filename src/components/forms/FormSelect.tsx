import React from "react";
import { cn } from "@/lib/utils";

interface Option {
  label: string;
  value: string | number;
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  error?: string;
  placeholder?: string;
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ className, label, options, error, placeholder, ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="block text-sm font-semibold font-bengali text-charcoal mb-1.5">
          {label}
        </label>
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "w-full px-4 py-3 rounded-xl border bg-cream/50 text-charcoal font-bengali text-sm outline-none transition-all duration-200 appearance-none cursor-pointer",
              error
                ? "border-error focus:ring-2 focus:ring-error/20"
                : "border-border hover:border-fire/50 focus:border-fire focus:ring-2 focus:ring-fire/20",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {/* Custom dropdown arrow */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
        {error && (
          <p className="mt-1.5 text-xs font-bengali font-medium text-error flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 shrink-0">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);
FormSelect.displayName = "FormSelect";
