"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserStatusSelectProps {
  role: string;
  status: string;
  onStatusChange: (newStatus: string) => void;
  triggerClassName?: string;
}

export function UserStatusSelect({
  role,
  status,
  onStatusChange,
  triggerClassName = "w-[105px] h-8 text-xs font-semibold justify-center bg-background rounded-lg",
}: UserStatusSelectProps) {
  if (role === "ADMIN") {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-latin border border-emerald-500/20">
        Active
      </span>
    );
  }

  return (
    <Select value={status} onValueChange={(val) => val && onStatusChange(val)}>
      <SelectTrigger className={triggerClassName}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="rounded-xl">
        <SelectItem value="ACTIVE">Active</SelectItem>
        <SelectItem value="INACTIVE">Inactive</SelectItem>
        <SelectItem value="BANNED">Banned</SelectItem>
      </SelectContent>
    </Select>
  );
}
