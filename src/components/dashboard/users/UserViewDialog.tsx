"use client";

import { format } from "date-fns";
import { Eye, Mail, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CopyButton } from "@/components/shared/CopyButton";
import { UserRoleBadge } from "./UserRoleBadge";

import { User } from "@/types/user";

interface UserViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  copiedKey: string | null;
  onCopy: (text: string, key: string, label: string) => void;
}

export function UserViewDialog({
  open,
  onOpenChange,
  user,
  copiedKey,
  onCopy,
}: UserViewDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-full sm:max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl sm:rounded-3xl border-border shadow-2xl">
        <DialogHeader className="p-4 sm:p-6 border-b border-border/60 bg-muted/10 pr-12">
          <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-lg sm:text-xl font-bold font-bengali text-charcoal flex items-center gap-2">
                <Eye className="w-5 h-5 text-fire shrink-0" />
                <span>ব্যবহারকারী তথ্য</span>
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs mt-1 font-bengali">
                ব্যবহারকারীর প্রোফাইল ও অ্যাকাউন্টের সম্পূর্ণ বিস্তারিত
              </DialogDescription>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold font-latin shrink-0 ${
                user.status === "ACTIVE"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : user.status === "BANNED"
                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
              }`}
            >
              {user.status}
            </span>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* User Profile Header Card */}
          <div className="p-4 sm:p-5 bg-card rounded-2xl border border-border/70 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-fire/10 text-fire font-bold flex items-center justify-center text-xl sm:text-2xl font-bengali shrink-0 border border-fire/20">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-1 group/modalname">
                  <h3 className="font-bold text-charcoal font-bengali text-base sm:text-xl leading-tight truncate">
                    {user.name}
                  </h3>
                  <CopyButton
                    text={user.name}
                    copiedKey={copiedKey}
                    targetKey="modal-name"
                    label="User name"
                    onCopy={onCopy}
                    className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 opacity-100 sm:opacity-0 sm:group-hover/modalname:opacity-100 focus:opacity-100 cursor-pointer shrink-0"
                  />
                </div>
                <div className="flex items-center gap-1 group/modalemail">
                  <p className="text-xs text-muted-foreground font-latin truncate">
                    {user.email}
                  </p>
                  <CopyButton
                    text={user.email}
                    copiedKey={copiedKey}
                    targetKey="modal-email"
                    label="Email address"
                    onCopy={onCopy}
                    className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 opacity-100 sm:opacity-0 sm:group-hover/modalemail:opacity-100 focus:opacity-100 cursor-pointer shrink-0"
                  />
                </div>
                <div className="pt-0.5">
                  <UserRoleBadge role={user.role} />
                </div>
              </div>
            </div>

            <div className="p-3 bg-muted/10 rounded-xl border border-border/50 flex sm:flex-col items-center justify-between sm:justify-center text-left sm:text-right shrink-0">
              <span className="text-xs text-muted-foreground font-bengali">মোট অর্ডার</span>
              <span className="font-bold text-fire text-base sm:text-lg font-bengali">
                {user._count?.orders || user.orders?.length || 0} টি
              </span>
            </div>
          </div>

          {/* Detailed Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="p-3.5 sm:p-4 bg-muted/10 rounded-2xl border border-border/50 space-y-1 group/modalphone flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 font-bengali">
                  <Phone size={14} className="text-fire shrink-0" /> ফোন নম্বর
                </p>
                <p className="text-charcoal font-latin font-medium text-sm truncate">
                  {user.phone || "N/A"}
                </p>
              </div>
              <CopyButton
                text={user.phone}
                copiedKey={copiedKey}
                targetKey="modal-phone"
                label="Phone number"
                onCopy={onCopy}
                className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 opacity-100 sm:opacity-0 sm:group-hover/modalphone:opacity-100 focus:opacity-100 cursor-pointer shrink-0"
              />
            </div>

            <div className="p-3.5 sm:p-4 bg-muted/10 rounded-2xl border border-border/50 space-y-1 group/modalemailcard flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 font-bengali">
                  <Mail size={14} className="text-fire shrink-0" /> ইমেইল ঠিকানা
                </p>
                <p className="text-charcoal font-latin font-medium text-sm truncate">
                  {user.email || "N/A"}
                </p>
              </div>
              <CopyButton
                text={user.email}
                copiedKey={copiedKey}
                targetKey="modal-emailcard"
                label="Email address"
                onCopy={onCopy}
                className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 opacity-100 sm:opacity-0 sm:group-hover/modalemailcard:opacity-100 focus:opacity-100 cursor-pointer shrink-0"
              />
            </div>

            <div className="p-3.5 sm:p-4 bg-muted/10 rounded-2xl border border-border/50 space-y-1 sm:col-span-2 group/modaladdr flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-muted-foreground font-bengali">ঠিকানা</p>
                <p className="text-charcoal font-bengali text-sm leading-relaxed break-words">
                  {user.address || "N/A"}
                </p>
              </div>
              <CopyButton
                text={user.address || ""}
                copiedKey={copiedKey}
                targetKey="modal-address"
                label="Address"
                onCopy={onCopy}
                className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 opacity-100 sm:opacity-0 sm:group-hover/modaladdr:opacity-100 focus:opacity-100 cursor-pointer shrink-0 mt-0.5"
              />
            </div>
          </div>

          {/* Footer Timestamps */}
          <div className="p-3.5 sm:p-4 bg-muted/10 rounded-2xl border border-border/50 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground font-bengali">
            <div>
              <span className="font-semibold text-charcoal mr-1">যোগদানের তারিখ:</span>
              <span className="font-latin">
                {format(new Date(user.createdAt), "dd MMM, yyyy 'at' HH:mm")}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
