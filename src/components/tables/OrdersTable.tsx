"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatPrice } from "@/lib/utils";
import { useUpdateOrderStatus } from "@/features/order/hooks/useAdminOrders";

interface OrdersTableProps {
  orders: any[];
  isLoading: boolean;
  onViewOrder?: (order: any) => void;
  onEditOrder?: (order: any) => void;
  onDeleteOrder?: (order: any) => void;
  onChangeStatus?: (order: any, status: string) => void;
}

export function OrdersTable({ orders, isLoading, onViewOrder, onEditOrder, onDeleteOrder, onChangeStatus }: OrdersTableProps) {
  const updateStatus = useUpdateOrderStatus();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(`${label} কপি করা হয়েছে!`, {
      description: `${text} ক্লিপবোর্ডে কপি করা হয়েছে`,
    });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const columns = [
    {
      header: "অর্ডার নং",
      accessor: (row: any) => {
        const key = `${row.id}-num`;
        return (
          <div className="flex items-center gap-1.5 group/ordernum" onClick={(e) => e.stopPropagation()}>
            <span className="font-mono font-bold text-sm">#{row.orderNumber}</span>
            <button
              type="button"
              onClick={() => handleCopy(row.orderNumber, key, "অর্ডার নাম্বার")}
              className="text-muted-foreground hover:text-fire transition-all p-1 rounded hover:bg-cream/50 cursor-pointer shrink-0 opacity-100 sm:opacity-0 sm:group-hover/ordernum:opacity-100 focus:opacity-100"
              title="Order Number Copy করুন"
            >
              {copiedKey === key ? (
                <Check className="w-3.5 h-3.5 text-green-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        );
      },
    },
    {
      header: "গ্রাহক",
      accessor: (row: any) => {
        const nameKey = `${row.id}-name`;
        const phoneKey = `${row.id}-phone`;
        const customerName = row.customerName || "অতিথি";
        const phone = row.customerPhone || row.deliveryAddress?.phone || row.user?.phone;

        return (
          <div className="space-y-0.5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-1.5 group/cname">
              <span className="font-bold text-sm text-charcoal dark:text-cream">{customerName}</span>
              {row.customerName && (
                <button
                  type="button"
                  onClick={() => handleCopy(customerName, nameKey, "কাস্টমারের নাম")}
                  className="text-muted-foreground hover:text-fire transition-all p-1 rounded hover:bg-cream/50 cursor-pointer shrink-0 opacity-100 sm:opacity-0 sm:group-hover/cname:opacity-100 focus:opacity-100"
                  title="Customer Name Copy করুন"
                >
                  {copiedKey === nameKey ? (
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>
            <div className="flex items-center gap-1.5 font-latin text-xs text-muted-foreground group/cphone">
              <span>{phone || "N/A"}</span>
              {phone && (
                <button
                  type="button"
                  onClick={() => handleCopy(phone, phoneKey, "ফোন নম্বর")}
                  className="text-muted-foreground hover:text-fire transition-all p-1 rounded hover:bg-cream/50 cursor-pointer shrink-0 opacity-100 sm:opacity-0 sm:group-hover/cphone:opacity-100 focus:opacity-100"
                  title="Phone Number Copy করুন"
                >
                  {copiedKey === phoneKey ? (
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>
          </div>
        );
      },
    },
    {
      header: "তারিখ",
      accessor: (row: any) => (
        <span className="text-sm">
          {format(new Date(row.createdAt), "dd MMM, yyyy")}
        </span>
      ),
    },
    {
      header: "মোট মূল্য",
      accessor: (row: any) => (
        <span className="font-bold text-fire">{formatPrice(row.total)}</span>
      ),
    },
    {
      header: "স্ট্যাটাস",
      accessor: (row: any) => (
        <StatusBadge status={row.status} />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={orders}
      isLoading={isLoading}
      onRowClick={onViewOrder}
    />
  );
}
