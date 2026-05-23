"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, PackageX } from "lucide-react";
import { Container } from "@/components/shared/container/Container";
import { SectionTitle } from "@/components/shared/section-title/SectionTitle";
import { ItemCard } from "@/components/item/ItemCard";
import { SkeletonGrid } from "@/components/loaders/SkeletonGrid";
import { useDebounce } from "@/hooks/useDebounce";
import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";

export default function MenuPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get(API_ROUTES.CATEGORIES.BASE);
      return res.data.data;
    },
  });
  const categories = Array.isArray(categoriesData) ? categoriesData : categoriesData?.categories || [];

  // Fetch items with filters
  const { data: itemsData, isLoading } = useQuery({
    queryKey: ["items", activeCategory, debouncedSearch],
    queryFn: async () => {
      let url = API_ROUTES.ITEMS.BASE;
      const params = new URLSearchParams();
      if (activeCategory !== "all") params.append("categoryId", activeCategory);
      if (debouncedSearch) params.append("search", debouncedSearch);
      
      const res = await api.get(`${url}?${params.toString()}`);
      return res.data.data;
    },
  });
  const items = Array.isArray(itemsData) ? itemsData : itemsData?.items || [];

  return (
    <div className="py-12 bg-cream min-h-screen">
      <Container>
        <SectionTitle
          title="Our Menu"
          titleBn="আমাদের মেনু"
          subtitle="খুঁজে নিন আপনার পছন্দের কাঠের চুলার খাবার"
        />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar / Filters */}
          <aside className="lg:w-64 shrink-0">
            <div className="sticky top-[calc(var(--nav-height)+2rem)] space-y-6">
              {/* Search */}
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-light" />
                <input
                  type="text"
                  placeholder="খাবার খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-white text-sm font-bengali placeholder:text-muted focus:border-fire focus:ring-1 focus:ring-fire/20 outline-none transition-all"
                />
              </div>

              {/* Categories */}
              <div className="bg-white rounded-2xl border border-border p-4">
                <div className="flex items-center gap-2 mb-4 text-charcoal font-bold font-bengali">
                  <SlidersHorizontal size={18} />
                  <h3>ক্যাটাগরি</h3>
                </div>
                <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
                  <button
                    onClick={() => setActiveCategory("all")}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold font-bengali text-left transition-colors ${
                      activeCategory === "all"
                        ? "bg-fire/10 text-fire"
                        : "text-muted hover:bg-charcoal/5 hover:text-charcoal"
                    }`}
                  >
                    সকল আইটেম
                  </button>
                  {categories.map((cat: any) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold font-bengali text-left transition-colors ${
                        activeCategory === cat.id
                          ? "bg-fire/10 text-fire"
                          : "text-muted hover:bg-charcoal/5 hover:text-charcoal"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {isLoading ? (
              <SkeletonGrid count={8} columns={3} />
            ) : items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item: any) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-border border-dashed text-center">
                <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center mb-4">
                  <PackageX size={32} className="text-muted-light" />
                </div>
                <h3 className="text-xl font-bold font-bengali text-charcoal mb-2">
                  কোন আইটেম পাওয়া যায়নি
                </h3>
                <p className="text-muted font-bengali">
                  আপনার খোঁজা অনুযায়ী কোনো খাবার পাওয়া যায়নি। অন্য কিছু সার্চ করুন।
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setActiveCategory("all");
                  }}
                  className="mt-6 px-6 py-2.5 bg-fire/10 text-fire rounded-xl font-semibold font-bengali hover:bg-fire hover:text-white transition-colors cursor-pointer"
                >
                  সব খাবার দেখুন
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
