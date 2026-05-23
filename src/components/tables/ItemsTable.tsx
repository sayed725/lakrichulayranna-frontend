"use client";

import Image from "next/image";
import { Edit2, Trash2 } from "lucide-react";
import { DataTable } from "@/components/dashboard/DataTable";
import { formatPrice } from "@/lib/utils";
import { useToggleItemAvailability, useDeleteItem } from "@/features/item/hooks/useAdminItems";

interface ItemsTableProps {
  items: any[];
  isLoading: boolean;
  onEdit?: (item: any) => void;
}

export function ItemsTable({ items, isLoading, onEdit }: ItemsTableProps) {
  const toggleAvailability = useToggleItemAvailability();
  const deleteItem = useDeleteItem();

  const handleToggle = (itemId: string, currentStatus: boolean) => {
    toggleAvailability.mutate({ itemId, isAvailable: !currentStatus });
  };

  const handleDelete = (itemId: string, itemName: string) => {
    if (window.confirm(`আপনি কি নিশ্চিত যে "${itemName}" মুছে ফেলতে চান?`)) {
      deleteItem.mutate(itemId);
    }
  };

  const columns = [
    {
      header: "ছবি ও নাম",
      accessor: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border bg-cream shrink-0">
            {row.imageUrl ? (
              <Image src={row.imageUrl} alt={row.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-cream-dark" />
            )}
          </div>
          <div>
            <p className="font-bold font-bengali line-clamp-1">{row.name}</p>
            <p className="text-xs text-muted line-clamp-1">{row.category?.name || "N/A"}</p>
          </div>
        </div>
      ),
    },
    {
      header: "মূল্য",
      accessor: (row: any) => (
        <div>
          <span className="font-bold text-charcoal">{formatPrice(row.price)}</span>
          {row.discountPrice !== null && (
            <p className="text-xs text-fire font-semibold mt-0.5">
              ছাড়: {formatPrice(row.discountPrice)}
            </p>
          )}
        </div>
      ),
    },
    {
      header: "প্রাপ্যতা",
      accessor: (row: any) => (
        <label className="relative inline-flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            className="sr-only peer"
            checked={row.isAvailable}
            onChange={() => handleToggle(row.id, row.isAvailable)}
            disabled={toggleAvailability.isPending}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success disabled:opacity-50"></div>
        </label>
      ),
    },
    {
      header: "অ্যাকশন",
      accessor: (row: any) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(row);
            }}
            className="p-2 text-info hover:bg-info/10 rounded-lg transition-colors cursor-pointer"
            title="এডিট করুন"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.id, row.name);
            }}
            className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
            title="মুছে ফেলুন"
            disabled={deleteItem.isPending}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
      className: "text-right",
    },
  ];

  return <DataTable columns={columns} data={items} isLoading={isLoading} />;
}
