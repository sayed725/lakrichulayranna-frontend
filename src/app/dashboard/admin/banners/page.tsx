"use client";

import Image from "next/image";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { DataTable } from "@/components/dashboard/DataTable";
import { useAdminBanners, useToggleBanner, useDeleteBanner } from "@/features/banner/hooks/useAdminBanners";

export default function AdminBannersPage() {
  const { data: banners, isLoading } = useAdminBanners();
  const toggleBanner = useToggleBanner();
  const deleteBanner = useDeleteBanner();

  const handleToggle = (id: string, currentStatus: boolean) => {
    toggleBanner.mutate({ bannerId: id, isActive: !currentStatus });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("আপনি কি নিশ্চিত যে এই ব্যানারটি মুছে ফেলতে চান?")) {
      deleteBanner.mutate(id);
    }
  };

  const columns = [
    {
      header: "ব্যানার",
      accessor: (row: any) => (
        <div className="flex items-center gap-4">
          <div className="relative w-32 h-16 rounded-lg overflow-hidden border border-border bg-cream shrink-0">
            {row.imageUrl ? (
              <Image src={row.imageUrl} alt={row.title || "Banner"} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-cream-dark" />
            )}
          </div>
          <div>
            <p className="font-bold font-bengali text-charcoal">{row.title || "নামবিহীন ব্যানার"}</p>
            {row.link && <p className="text-xs text-muted">লিঙ্ক: {row.link}</p>}
          </div>
        </div>
      ),
    },
    {
      header: "ক্রম (Order)",
      accessor: (row: any) => (
        <span className="font-bold text-charcoal">{row.order}</span>
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
            disabled={toggleBanner.isPending}
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
          <button
            onClick={() => handleDelete(row.id)}
            className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
            title="মুছে ফেলুন"
            disabled={deleteBanner.isPending}
          >
            <Trash2 size={16} />
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
            ব্যানারসমূহ
          </h1>
          <p className="text-muted text-sm font-bengali">হোমপেজ স্লাইডার ব্যানার পরিচালনা করুন</p>
        </div>
        
        <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-fire text-white rounded-xl font-semibold font-bengali hover:bg-fire-dark transition-all shadow-sm active:scale-95 cursor-pointer">
          <Plus size={18} />
          নতুন ব্যানার
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-border p-4 sm:p-6">
        <DataTable 
          columns={columns} 
          data={banners || []} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
}
