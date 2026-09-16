"use client";

import { format } from "date-fns";
import { Mail, Phone } from "lucide-react";
import { CopyButton } from "@/components/shared/CopyButton";
import { UserRoleBadge } from "@/components/dashboard/users/UserRoleBadge";
import { UserStatusSelect } from "@/components/dashboard/users/UserStatusSelect";
import { UserActionsMenu } from "@/components/dashboard/users/UserActionsMenu";
import { User } from "@/types/user";

interface UserCardProps {
  user: User;
  copiedKey: string | null;
  onCopy: (text: string, key: string, label: string) => void;
  onStatusChange: (userId: string, newStatus: string) => void;
  onView: (user: User) => void;
  onDelete: (userId: string) => void;
  isDeleting: boolean;
}

export function UserCard({
  user,
  copiedKey,
  onCopy,
  onStatusChange,
  onView,
  onDelete,
  isDeleting,
}: UserCardProps) {
  const orderCount = user._count?.orders ?? user.orders?.length ?? 0;

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all space-y-3">
      {/* Top Bar: User Name, Avatar, Joined Date & Actions */}
      <div className="flex items-center justify-between gap-3 border-b border-border/50 pb-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-full bg-fire/10 text-fire font-bold flex items-center justify-center font-bengali shrink-0 text-base">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <p className="font-bold text-charcoal font-bengali text-base truncate">{user.name}</p>
              <CopyButton
                text={user.name}
                copiedKey={copiedKey}
                targetKey={`card-name-${user.id}`}
                label="User name"
                onCopy={onCopy}
                className="text-muted-foreground hover:text-fire p-1 rounded hover:bg-cream/50 transition-colors shrink-0"
                iconSize={14}
              />
            </div>
            <p className="text-xs text-muted-foreground font-latin">
              Joined {format(new Date(user.createdAt), "dd MMM, yyyy")}
            </p>
          </div>
        </div>

        <UserActionsMenu
          onView={() => onView(user)}
          onDelete={() => onDelete(user.id)}
          isDeleting={isDeleting}
          iconSize={16}
        />
      </div>

      {/* Contact Box */}
      <div className="bg-muted/10 p-2.5 rounded-xl border border-border/40 space-y-1.5">
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground font-latin">
          <div className="flex items-center gap-1.5 min-w-0">
            <Mail size={13} className="shrink-0 text-muted-foreground" />
            <span className="truncate text-charcoal font-medium">{user.email}</span>
          </div>
          <CopyButton
            text={user.email}
            copiedKey={copiedKey}
            targetKey={`card-email-${user.id}`}
            label="Email address"
            onCopy={onCopy}
            className="text-muted-foreground hover:text-fire p-1 rounded hover:bg-cream/50 transition-colors shrink-0"
            iconSize={14}
          />
        </div>

        {user.phone && (
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground font-latin border-t border-border/30 pt-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <Phone size={13} className="shrink-0 text-muted-foreground" />
              <span className="truncate text-charcoal font-medium">{user.phone}</span>
            </div>
            <CopyButton
              text={user.phone}
              copiedKey={copiedKey}
              targetKey={`card-phone-${user.id}`}
              label="Phone number"
              onCopy={onCopy}
              className="text-muted-foreground hover:text-fire p-1 rounded hover:bg-cream/50 transition-colors shrink-0"
              iconSize={14}
            />
          </div>
        )}
      </div>

      {/* Footer Bar: Role, Orders Count & Status */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/50">
        <div className="flex items-center gap-2">
          <UserRoleBadge role={user.role} />
          <span className="inline-flex items-center justify-center font-bold text-fire bg-fire/10 border border-fire/20 px-2.5 py-0.5 rounded-full text-xs font-bengali">
            {orderCount} টি
          </span>
        </div>

        <div>
          <UserStatusSelect
            role={user.role}
            status={user.status}
            onStatusChange={(val) => onStatusChange(user.id, val)}
            triggerClassName="w-[105px] h-8 text-xs font-semibold justify-center bg-background rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
