"use client";

import { Shield } from "lucide-react";

interface UserRoleBadgeProps {
  role: string;
}

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  if (role === "ADMIN") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-fire/10 text-fire text-xs font-bold font-latin">
        <Shield size={12} />
        ADMIN
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-muted/40 text-charcoal text-xs font-bold font-latin">
      CUSTOMER
    </span>
  );
}
