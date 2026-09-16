"use client";

import { format } from "date-fns";
import { Mail, Phone } from "lucide-react";
import { CopyButton } from "@/components/shared/CopyButton";
import { UserRoleBadge } from "@/components/dashboard/users/UserRoleBadge";
import { UserStatusSelect } from "@/components/dashboard/users/UserStatusSelect";
import { UserActionsMenu } from "@/components/dashboard/users/UserActionsMenu";
import { User } from "@/types/user";

interface UserTableRowProps {
  user: User;
  copiedKey: string | null;
  onCopy: (text: string, key: string, label: string) => void;
  onStatusChange: (userId: string, newStatus: string) => void;
  onView: (user: User) => void;
  onDelete: (userId: string) => void;
  isDeleting: boolean;
}

export function UserTableRow({
  user,
  copiedKey,
  onCopy,
  onStatusChange,
  onView,
  onDelete,
  isDeleting,
}: UserTableRowProps) {
  const orderCount = user._count?.orders ?? user.orders?.length ?? 0;

  return (
    <tr className="hover:bg-cream/30 dark:hover:bg-charcoal-light/20 transition-colors">
      <td className="px-4 py-3 align-middle">
        <div className="flex items-center gap-3 group/username">
          <div className="w-9 h-9 rounded-full bg-fire/10 text-fire font-bold flex items-center justify-center font-bengali shrink-0 text-sm">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <p className="font-bold text-charcoal font-bengali truncate text-sm">{user.name}</p>
              {user.name && (
                <CopyButton
                  text={user.name}
                  copiedKey={copiedKey}
                  targetKey={`tbl-name-${user.id}`}
                  label="User name"
                  onCopy={onCopy}
                  className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 opacity-100 lg:opacity-0 lg:group-hover/username:opacity-100 focus:opacity-100 cursor-pointer shrink-0"
                />
              )}
            </div>
            <p className="text-[11px] text-muted-foreground font-latin">
              {format(new Date(user.createdAt), "dd MMM, yyyy")}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 align-middle">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 group/useremail min-h-[20px]">
            <Mail size={13} className="text-muted-foreground shrink-0 mr-1" />
            <span className="font-latin truncate text-charcoal text-sm">{user.email}</span>
            {user.email && (
              <CopyButton
                text={user.email}
                copiedKey={copiedKey}
                targetKey={`tbl-email-${user.id}`}
                label="Email address"
                onCopy={onCopy}
                className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 opacity-100 lg:opacity-0 lg:group-hover/useremail:opacity-100 focus:opacity-100 cursor-pointer shrink-0"
              />
            )}
          </div>
          {user.phone && (
            <div className="flex items-center gap-1 group/userphone min-h-[20px]">
              <Phone size={13} className="text-muted-foreground shrink-0 mr-1" />
              <span className="font-latin text-xs text-muted-foreground">{user.phone}</span>
              <CopyButton
                text={user.phone}
                copiedKey={copiedKey}
                targetKey={`tbl-phone-${user.id}`}
                label="Phone number"
                onCopy={onCopy}
                className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 opacity-100 lg:opacity-0 lg:group-hover/userphone:opacity-100 focus:opacity-100 cursor-pointer shrink-0"
              />
            </div>
          )}
        </div>
      </td>
      <td className="px-4 py-3 align-middle">
        <UserRoleBadge role={user.role} />
      </td>
      <td className="px-4 py-3 text-center align-middle">
        <span className="inline-flex items-center justify-center font-bold text-fire bg-fire/10 border border-fire/20 px-2.5 py-0.5 rounded-full text-xs font-bengali">
          {orderCount} টি
        </span>
      </td>
      <td className="px-6 py-4 text-center align-middle">
        <UserStatusSelect
          role={user.role}
          status={user.status}
          onStatusChange={(val) => onStatusChange(user.id, val)}
          triggerClassName="w-[110px] h-8 text-xs font-semibold justify-center bg-background rounded-lg mx-auto"
        />
      </td>
      <td className="px-6 py-4 text-right align-middle">
        <UserActionsMenu
          onView={() => onView(user)}
          onDelete={() => onDelete(user.id)}
          isDeleting={isDeleting}
          iconSize={18}
          triggerClassName="p-2 hover:bg-fire/10 hover:text-fire rounded-lg transition-colors cursor-pointer text-muted-foreground"
        />
      </td>
    </tr>
  );
}
