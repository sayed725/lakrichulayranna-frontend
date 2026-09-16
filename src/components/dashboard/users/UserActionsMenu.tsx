"use client";

import { Eye, MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserActionsMenuProps {
  onView: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
  triggerClassName?: string;
  iconSize?: number;
}

export function UserActionsMenu({
  onView,
  onDelete,
  isDeleting = false,
  triggerClassName = "p-1.5 hover:bg-fire/10 hover:text-fire rounded-lg transition-colors cursor-pointer text-muted-foreground shrink-0",
  iconSize = 16,
}: UserActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={triggerClassName}>
        <MoreVertical size={iconSize} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 font-bengali">
        <DropdownMenuItem onClick={onView}>
          <Eye size={14} className="mr-2 text-fire" /> বিস্তারিত
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDelete}
          disabled={isDeleting}
          className="text-red-600 focus:text-red-600 focus:bg-red-50"
        >
          <Trash2 size={14} className="mr-2" /> মুছে ফেলুন
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
