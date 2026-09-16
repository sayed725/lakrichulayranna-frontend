"use client";

import React from "react";
import { Check, Copy } from "lucide-react";

interface CopyButtonProps {
  text?: string | null;
  copiedKey: string | null;
  targetKey: string;
  label: string;
  onCopy: (text: string, key: string, label: string) => void;
  className?: string;
  iconSize?: number;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  copiedKey,
  targetKey,
  label,
  onCopy,
  className = "text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 cursor-pointer shrink-0",
  iconSize = 14,
}) => {
  if (!text || text === "N/A") return null;

  const isCopied = copiedKey === targetKey;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onCopy(text, targetKey, label);
      }}
      className={className}
      title={`Copy ${label.toLowerCase()}`}
    >
      {isCopied ? (
        <Check size={iconSize} className="text-green-600" />
      ) : (
        <Copy size={iconSize} />
      )}
    </button>
  );
};
