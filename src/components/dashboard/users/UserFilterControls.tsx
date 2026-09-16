"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserFilterControlsProps {
  roleFilter: string;
  onRoleChange: (role: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
  className?: string;
  selectTriggerClassName?: string;
}

export function UserFilterControls({
  roleFilter,
  onRoleChange,
  statusFilter,
  onStatusChange,
  sortBy,
  sortOrder,
  onSortChange,
  className = "flex flex-col sm:flex-row gap-3",
  selectTriggerClassName = "w-full h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl",
}: UserFilterControlsProps) {
  const getSortLabel = () => {
    const sortMap: Record<string, string> = {
      "createdAt-desc": "Newest First",
      "createdAt-asc": "Oldest First",
      "name-asc": "Name: A to Z",
      "name-desc": "Name: Z to A",
    };
    return sortMap[`${sortBy}-${sortOrder}`] || "Sort By";
  };

  return (
    <div className={className}>
      {/* Role Filter */}
      <Select value={roleFilter} onValueChange={(v) => onRoleChange(v || "all")}>
        <SelectTrigger className={`w-full lg:w-[130px] ${selectTriggerClassName}`}>
          <SelectValue placeholder="Role">
            {roleFilter === "all" ? "All Roles" : roleFilter}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
          <SelectItem value="CUSTOMER">Customer</SelectItem>
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select value={statusFilter} onValueChange={(v) => onStatusChange(v || "all")}>
        <SelectTrigger className={`w-full lg:w-[130px] ${selectTriggerClassName}`}>
          <SelectValue placeholder="Status">
            {statusFilter === "all" ? "All Status" : statusFilter}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="INACTIVE">Inactive</SelectItem>
          <SelectItem value="BANNED">Banned</SelectItem>
        </SelectContent>
      </Select>

      {/* Sort By Filter */}
      <Select
        value={`${sortBy}-${sortOrder}`}
        onValueChange={(v) => {
          const [by, order] = (v || "createdAt-desc").split("-");
          onSortChange(by, order as "asc" | "desc");
        }}
      >
        <SelectTrigger className={`w-full lg:w-[170px] ${selectTriggerClassName}`}>
          <SelectValue placeholder="Sort By">{getSortLabel()}</SelectValue>
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          <SelectItem value="createdAt-desc">Newest First</SelectItem>
          <SelectItem value="createdAt-asc">Oldest First</SelectItem>
          <SelectItem value="name-asc">Name: A to Z</SelectItem>
          <SelectItem value="name-desc">Name: Z to A</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
