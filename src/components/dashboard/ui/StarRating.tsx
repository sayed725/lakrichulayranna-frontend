"use client";

import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  size?: number;
  readonly?: boolean;
}

export function StarRating({ value, onChange, size = 24, readonly = false }: StarRatingProps) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          className={`transition-colors ${readonly ? "cursor-default" : "cursor-pointer"}`}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
        >
          <Star
            size={size}
            fill={(hover || value) >= star ? "#F59E0B" : "transparent"}
            className={`${
              (hover || value) >= star ? "text-warning" : "text-muted-light"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
