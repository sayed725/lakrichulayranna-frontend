"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { ItemsTable } from "@/components/tables/ItemsTable";
import { useAdminItems } from "@/features/item/hooks/useAdminItems";
import { useDebounce } from "@/hooks/useDebounce";

export default function AdminItemsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const { data: items, isLoading } = useAdminItems();

  const filteredItems = items?.filter((item: any) => {
    if (!debouncedSearch) return true;
    return item.name.toLowerCase().includes(debouncedSearch.toLowerCase());
  }) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-bengali text-charcoal mb-1">
            আইটেমসমূহ
          </h1>
          <p className="text-muted text-sm font-bengali">মেনুর সকল খাবার পরিচালনা করুন</p>
        </div>
        
        <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-fire text-white rounded-xl font-semibold font-bengali hover:bg-fire-dark transition-all shadow-sm active:scale-95">
          <Plus size={18} />
          নতুন আইটেম
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-border p-4 sm:p-6 space-y-6">
        <div className="flex justify-end">
          <div className="relative w-full sm:w-64">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-light" />
            <input
              type="text"
              placeholder="খাবারের নাম খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-cream-dark/30 text-sm font-bengali focus:border-fire focus:ring-1 focus:ring-fire/20 outline-none transition-all"
            />
          </div>
        </div>

        <ItemsTable 
          items={filteredItems} 
          isLoading={isLoading}
          onEdit={(item) => {
            // TODO: Implement edit modal
            console.log("Edit item", item);
          }}
        />
      </div>
    </div>
  );
}
