"use client";

import Image from "next/image";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { DataTable } from "@/components/dashboard/DataTable";
import { useAdminCategories, useDeleteCategory } from "@/features/category/hooks/useAdminCategories";

export default function AdminCategoriesPage() {
  const { data: categories, isLoading } = useAdminCategories();
  const deleteCategory = useDeleteCategory();

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`আপনি কি নিশ্চিত যে "${name}" ক্যাটাগরিটি মুছে ফেলতে চান?`)) {
      deleteCategory.mutate(id);
    }
  };

  const columns = [
    {
      header: "ক্যাটাগরির নাম",
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
            <p className="font-bold font-bengali text-charcoal">{row.name}</p>
            {row.description && (
              <p className="text-xs text-muted font-bengali line-clamp-1">{row.description}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "আইটেম সংখ্যা",
      accessor: (row: any) => (
        <span className="font-bold text-charcoal bg-cream px-3 py-1 rounded-full">
          {row._count?.items || 0} টি
        </span>
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
            onClick={() => handleDelete(row.id, row.name)}
            className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
            title="মুছে ফেলুন"
            disabled={deleteCategory.isPending}
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
            ক্যাটাগরিসমূহ
          </h1>
          <p className="text-muted text-sm font-bengali">মেনুর ক্যাটাগরি তৈরি এবং পরিচালনা করুন</p>
        </div>
        
        <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-fire text-white rounded-xl font-semibold font-bengali hover:bg-fire-dark transition-all shadow-sm active:scale-95 cursor-pointer">
          <Plus size={18} />
          নতুন ক্যাটাগরি
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-border p-4 sm:p-6">
        <DataTable 
          columns={columns} 
          data={categories || []} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
}
