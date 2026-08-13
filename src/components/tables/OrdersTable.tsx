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
          <p className="font-bold">{ row.customerName || "অতিথি"}</p>
          <p className="text-xs text-muted font-latin">{ row.deliveryAddress?.phone || row.customerPhone || "N/A"}</p>
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
