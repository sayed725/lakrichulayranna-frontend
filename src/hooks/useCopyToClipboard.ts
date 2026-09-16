import { useState, useCallback } from "react";
import { toast } from "sonner";

export function useCopyToClipboard(timeout = 2000) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copy = useCallback(
    (text: string, key: string, label: string) => {
      if (!text || text === "N/A") return;
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      toast.success(`${label} copied!`);
      setTimeout(() => setCopiedKey(null), timeout);
    },
    [timeout]
  );

  return { copiedKey, copy };
}
