"use client";

import { format } from "date-fns";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { DataTable } from "@/components/dashboard/DataTable";
import { useAdminCoupons, useToggleCoupon } from "@/features/coupon/hooks/useAdminCoupons";
import { formatPrice } from "@/lib/utils";

export default function AdminCouponsPage() {
  const { data: coupons, isLoading } = useAdminCoupons();
  const toggleCoupon = useToggleCoupon();

  const handleToggle = (id: string, currentStatus: boolean) => {
    toggleCoupon.mutate({ couponId: id, isActive: !currentStatus });
  };

  const columns = [
    {
      header: "কুপন কোড",
      accessor: (row: any) => (
        <div>
          <span className="font-bold text-charcoal font-mono bg-cream px-2 py-1 rounded-lg border border-border">
            {row.code}
          </span>
        </div>
      ),
    },
    {
      header: "ডিসকাউন্ট",
      accessor: (row: any) => (
        <span className="font-bold text-fire">
          {row.discountType === "PERCENTAGE" 
            ? `${row.discountValue}%` 
            : formatPrice(row.discountValue)}
        </span>
      ),
    },
    {
      header: "ব্যবহার",
      accessor: (row: any) => (
        <span className="text-sm">
          {row.usedCount} / {row.usageLimit || "অসীম"}
        </span>
      ),
    },
    {
      header: "মেয়াদ",
      accessor: (row: any) => (
        <span className="text-sm text-muted">
          {row.validUntil ? format(new Date(row.validUntil), "dd MMM, yyyy") : "সীমাহীন"}
        </span>
      ),
    },
    {
      header: "স্ট্যাটাস",
      accessor: (row: any) => (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={row.isActive}
            onChange={() => handleToggle(row.id, row.isActive)}
            disabled={toggleCoupon.isPending}
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
            className="p-2 text-info hover:bg-info/10 rounded-lg transition-colors cursor-pointer"
            title="এডিট করুন"
          >
            <Edit2 size={16} />
          </button>
        </div>
      ),
      className: "text-right",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-bengali text-charcoal mb-1">
            কুপনসমূহ
          </h1>
          <p className="text-muted text-sm font-bengali">ডিসকাউন্ট কুপন তৈরি ও পরিচালনা করুন</p>
        </div>
        
        <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-fire text-white rounded-xl font-semibold font-bengali hover:bg-fire-dark transition-all shadow-sm active:scale-95 cursor-pointer">
          <Plus size={18} />
          নতুন কুপন
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-border p-4 sm:p-6">
        <DataTable 
          columns={columns} 
          data={coupons || []} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
}
