"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, PackageX, Flame, Sparkles, X, Filter } from "lucide-react";
import { Container } from "@/components/shared/container/Container";
import { SectionTitle } from "@/components/shared/section-title/SectionTitle";
import { ItemCard } from "@/components/item/ItemCard";
import { SkeletonGrid } from "@/components/loaders/SkeletonGrid";
import { useDebounce } from "@/hooks/useDebounce";
import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";

export default function MenuPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlCategoryName = searchParams.get("categoryName") || "all";
  const urlIsSpicy = searchParams.get("isSpicy") === "true";
  const urlIsFeatured = searchParams.get("isFeatured") === "true";
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>(urlCategoryName);
  const [isSpicy, setIsSpicy] = useState<boolean>(urlIsSpicy);
  const [isFeatured, setIsFeatured] = useState<boolean>(urlIsFeatured);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Check if any filter is active
  const hasActiveFilters = activeCategory !== "all" || isSpicy || isFeatured || searchTerm !== "";

  // Reset all filters
  const resetAllFilters = () => {
    setSearchTerm("");
    setActiveCategory("all");
    setIsSpicy(false);
    setIsFeatured(false);
    updateFilters("all", false, false);
    setIsFilterDrawerOpen(false);
  };

  // Update URL when filters change
  const updateFilters = (category: string, spicy: boolean, featured: boolean) => {
    const params = new URLSearchParams();
    if (category !== "all") params.set("categoryName", category);
    if (spicy) params.set("isSpicy", "true");
    if (featured) params.set("isFeatured", "true");
    router.push(`/menu?${params.toString()}`);
  };

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
    queryKey: ["items", activeCategory, isSpicy, isFeatured, debouncedSearch],
    queryFn: async () => {
      let url = API_ROUTES.ITEMS.BASE;
      const params = new URLSearchParams();
      if (activeCategory !== "all") params.append("categoryName", activeCategory);
      if (isSpicy) params.append("isSpicy", "true");
      if (isFeatured) params.append("isFeatured", "true");
      if (debouncedSearch) params.append("searchTerm", debouncedSearch);
      
      const res = await api.get(`${url}?${params.toString()}`);
      return res.data.data;
    },
  });
  const items = Array.isArray(itemsData) ? itemsData : itemsData?.items || [];

  return (
    <div className="py-10 bg-cream min-h-screen">
      <Container>
        <SectionTitle
          // title="Our Menu"
          titleBn="আমাদের সকল পণ্য"
          subtitle="খুঁজে নিন আপনার পছন্দের কাঠের চুলার খাবার"
        />

        <div className="flex flex-col lg:flex-row gap-3">
          {/* Mobile Search and Filter */}
          <div className="lg:hidden flex items-center gap-3 mb-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-light" />
              <input
                type="text"
                placeholder="খাবার খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm font-bengali placeholder:text-muted focus:border-fire focus:ring-1 focus:ring-fire/20 outline-none transition-all"
              />
            </div>
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-border text-charcoal font-semibold font-bengali hover:bg-fire hover:text-white transition-colors shrink-0"
            >
              <Filter size={18} />
              ফিল্টার
            </button>
          </div>

          {/* Sidebar / Filters */}
          <aside className="hidden lg:block lg:w-64 shrink-0">
            <div className="sticky top-[calc(var(--nav-height)+2rem)] space-y-3">
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
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-charcoal font-bold font-bengali">
                    <SlidersHorizontal size={18} />
                    <h3>ক্যাটাগরি</h3>
                  </div>
                  {hasActiveFilters && (
                    <button
                      onClick={resetAllFilters}
                      className="text-xs text-fire hover:text-fire-dark font-semibold transition-colors"
                    >
                      রিসেট
                    </button>
                  )}
                </div>
                <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
                  <button
                    onClick={() => {
                      setActiveCategory("all");
                      updateFilters("all", isSpicy, isFeatured);
                    }}
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
                      onClick={() => {
                        setActiveCategory(cat.name);
                        updateFilters(cat.name, isSpicy, isFeatured);
                      }}
                      className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold font-bengali text-left transition-colors ${
                        activeCategory === cat.name
                          ? "bg-fire/10 text-fire"
                          : "text-muted hover:bg-charcoal/5 hover:text-charcoal"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Spicy Filter */}
              <div className="bg-white rounded-2xl border border-border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-charcoal font-bold font-bengali">
                    <Flame size={18} className="text-fire" />
                    <h3>ঝাল খাবার</h3>
                  </div>
                  <button
                    onClick={() => {
                      setIsSpicy(!isSpicy);
                      updateFilters(activeCategory, !isSpicy, isFeatured);
                    }}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      isSpicy ? "bg-fire" : "bg-charcoal/20"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        isSpicy ? "left-7" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Best Seller Filter */}
              <div className="bg-white rounded-2xl border border-border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-charcoal font-bold font-bengali">
                    <Sparkles size={18} className="text-fire" />
                    <h3>বেস্ট সেলার</h3>
                  </div>
                  <button
                    onClick={() => {
                      setIsFeatured(!isFeatured);
                      updateFilters(activeCategory, isSpicy, !isFeatured);
                    }}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      isFeatured ? "bg-fire" : "bg-charcoal/20"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        isFeatured ? "left-7" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          {isFilterDrawerOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm lg:hidden"
                onClick={() => setIsFilterDrawerOpen(false)}
              />
              {/* Drawer */}
              <div className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-white shadow-2xl lg:hidden overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-border p-4 flex items-center justify-between">
                  <h2 className="font-bold text-lg text-charcoal font-bengali">ফিল্টার</h2>
                  <button
                    onClick={() => setIsFilterDrawerOpen(false)}
                    className="p-2 rounded-xl hover:bg-charcoal/5 transition-colors"
                  >
                    <X size={20} className="text-charcoal" />
                  </button>
                </div>
                <div className="p-4 space-y-4">
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
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-charcoal font-bold font-bengali">
                        <SlidersHorizontal size={18} />
                        <h3>ক্যাটাগরি</h3>
                      </div>
                      {hasActiveFilters && (
                        <button
                          onClick={resetAllFilters}
                          className="text-xs text-fire hover:text-fire-dark font-semibold transition-colors"
                        >
                          রিসেট
                        </button>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => {
                          setActiveCategory("all");
                          updateFilters("all", isSpicy, isFeatured);
                        }}
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
                          onClick={() => {
                            setActiveCategory(cat.name);
                            updateFilters(cat.name, isSpicy, isFeatured);
                          }}
                          className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold font-bengali text-left transition-colors ${
                            activeCategory === cat.name
                              ? "bg-fire/10 text-fire"
                              : "text-muted hover:bg-charcoal/5 hover:text-charcoal"
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Spicy Filter */}
                  <div className="bg-white rounded-2xl border border-border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-charcoal font-bold font-bengali">
                        <Flame size={18} className="text-fire" />
                        <h3>ঝাল খাবার</h3>
                      </div>
                      <button
                        onClick={() => {
                          setIsSpicy(!isSpicy);
                          updateFilters(activeCategory, !isSpicy, isFeatured);
                        }}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          isSpicy ? "bg-fire" : "bg-charcoal/20"
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                            isSpicy ? "left-7" : "left-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Best Seller Filter */}
                  <div className="bg-white rounded-2xl border border-border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-charcoal font-bold font-bengali">
                        <Sparkles size={18} className="text-fire" />
                        <h3>বেস্ট সেলার</h3>
                      </div>
                      <button
                        onClick={() => {
                          setIsFeatured(!isFeatured);
                          updateFilters(activeCategory, isSpicy, !isFeatured);
                        }}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          isFeatured ? "bg-fire" : "bg-charcoal/20"
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                            isFeatured ? "left-7" : "left-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {isLoading ? (
              <SkeletonGrid count={8} columns={3} />
            ) : items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                    setIsSpicy(false);
                    setIsFeatured(false);
                    updateFilters("all", false, false);
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
