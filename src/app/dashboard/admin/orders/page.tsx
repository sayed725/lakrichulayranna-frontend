"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { OrdersTable } from "@/components/tables/OrdersTable";
import { useAdminOrders } from "@/features/order/hooks/useAdminOrders";
import { useDebounce } from "@/hooks/useDebounce";

const ORDER_STATUSES = [
  { value: "ALL", label: "সকল অর্ডার" },
  { value: "PENDING", label: "অপেক্ষমাণ" },
  { value: "CONFIRMED", label: "নিশ্চিতকৃত" },
  { value: "PREPARING", label: "প্রস্তুত হচ্ছে" },
  { value: "READY", label: "ডেলিভারির জন্য প্রস্তুত" },
  { value: "DELIVERED", label: "ডেলিভারি সম্পন্ন" },
  { value: "CANCELLED", label: "বাতিলকৃত" },
];

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data: orders, isLoading } = useAdminOrders(statusFilter);

  // Client-side search filtering
  const filteredOrders = orders?.filter((order: any) => {
    if (!debouncedSearch) return true;
    const searchLower = debouncedSearch.toLowerCase();
    return (
      order.orderNumber.toLowerCase().includes(searchLower) ||
      order.user?.name?.toLowerCase().includes(searchLower) ||
      order.deliveryAddress?.phone?.includes(searchLower)
    );
  }) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-bengali text-charcoal mb-1">
            অর্ডারসমূহ
          </h1>
          <p className="text-muted text-sm font-bengali">সকল অর্ডারের তালিকা ও পরিচালনা</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border p-4 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          {/* Status Tabs */}
          <div className="flex overflow-x-auto pb-2 sm:pb-0 scrollbar-hide gap-2">
            {ORDER_STATUSES.map((status) => (
              <button
                key={status.value}
                onClick={() => setStatusFilter(status.value)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold font-bengali transition-colors ${
                  statusFilter === status.value
                    ? "bg-fire text-white"
                    : "bg-cream text-charcoal hover:bg-cream-dark"
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-light" />
            <input
              type="text"
              placeholder="অর্ডার নং, নাম বা ফোন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-cream-dark/30 text-sm font-bengali focus:border-fire focus:ring-1 focus:ring-fire/20 outline-none transition-all"
            />
          </div>
        </div>

        <OrdersTable 
          orders={filteredOrders} 
          isLoading={isLoading} 
          onViewOrder={(order) => {
            // TODO: Implement order detail modal
            console.log("View order", order);
          }}
        />
      </div>
    </div>
  );
}
