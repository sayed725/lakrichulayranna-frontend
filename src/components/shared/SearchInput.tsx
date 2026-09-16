"use client";

import { Input } from "@/components/ui/input";
import { Search, XCircle } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "সন্ধান করুন...",
  className = "",
}: SearchInputProps) {
  return (
    <div className={`flex-1 relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 pr-10 h-11 w-full bg-background border-border focus-visible:ring-fire/20 focus-visible:border-fire/50 rounded-xl font-bengali"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-fire transition-colors"
        >
          <XCircle className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
