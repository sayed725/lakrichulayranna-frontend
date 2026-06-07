"use client";

import { format } from "date-fns";
import { Eye, Edit, Trash2 } from "lucide-react";
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

  const handleStatusChange = (orderId: string, status: string) => {
    if (onChangeStatus) {
      const order = orders.find((o: any) => o.id === orderId);
      if (order) {
        onChangeStatus(order, status);
      }
    } else {
      updateStatus.mutate({ orderId, status });
    }
  };

  const columns = [
    {
      header: "অর্ডার নং",
      accessor: (row: any) => (
        <span className="font-mono font-bold">#{row.orderNumber}</span>
      ),
    },
    {
      header: "গ্রাহক",
      accessor: (row: any) => (
        <div>
          <p className="font-bold">{row.user?.name || "অতিথি"}</p>
          <p className="text-xs text-muted font-latin">{row.deliveryAddress?.phone}</p>
        </div>
      ),
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
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          disabled={updateStatus.isPending}
          onClick={(e) => e.stopPropagation()}
          className="text-xs font-semibold px-2 py-1 rounded-lg border border-border bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-fire"
        >
          <option value="PENDING">অপেক্ষমাণ</option>
          <option value="CONFIRMED">নিশ্চিতকৃত</option>
          <option value="PREPARING">প্রস্তুত হচ্ছে</option>
          <option value="READY">ডেলিভারির জন্য প্রস্তুত</option>
          <option value="DELIVERED">ডেলিভারি সম্পন্ন</option>
          <option value="CANCELLED">বাতিলকৃত</option>
        </select>
      ),
    },
    {
      header: "অ্যাকশন",
      accessor: (row: any) => (
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewOrder?.(row);
            }}
            className="p-2 text-charcoal hover:text-fire hover:bg-fire/10 rounded-lg transition-colors cursor-pointer"
            title="বিস্তারিত দেখুন"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditOrder?.(row);
            }}
            className="p-2 text-charcoal hover:text-fire hover:bg-fire/10 rounded-lg transition-colors cursor-pointer"
            title="সম্পাদনা করুন"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteOrder?.(row);
            }}
            className="p-2 text-charcoal hover:text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
            title="মুছে ফেলুন"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
      className: "text-right",
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
