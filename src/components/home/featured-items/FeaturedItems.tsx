"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionTitle } from "@/components/shared/section-title/SectionTitle";
import { ItemCard } from "@/components/item/ItemCard";
import { SkeletonCard } from "@/components/loaders/SkeletonCard";
import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";

export function FeaturedItems() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["featured-items"],
    queryFn: async () => {
      const res = await api.get(API_ROUTES.ITEMS.FEATURED);
      // Assuming response structure { data: { items: [...] } } or similar based on backend pattern
      return res.data.data;
    },
  });

  const items = Array.isArray(data) ? data : data?.items || [];

  if (isError) return null; // Silently fail on home page, or show a fallback

  return (
    <section className="py-20 bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <SectionTitle
            title="Signature Dishes"
            titleBn="বিশেষ আইটেম"
            align="left"
            className="mb-0"
          />
          <Link
            href="/menu"
            className="hidden sm:flex items-center gap-2 text-fire font-semibold font-bengali hover:text-fire-dark transition-colors group"
          >
            সব দেখুন
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto pb-8 sm:pb-0 snap-x snap-mandatory scrollbar-hide">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="min-w-[280px] sm:min-w-0 snap-center">
                    <SkeletonCard />
                  </div>
                ))
              : items.slice(0, 4).map((item: any) => (
                  <div key={item.id} className="min-w-[280px] sm:min-w-0 snap-center">
                    <ItemCard item={item} />
                  </div>
                ))}
          </div>
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/menu"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-fire text-fire rounded-xl font-semibold font-bengali w-full hover:bg-fire hover:text-white transition-colors"
          >
            সব দেখুন
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
