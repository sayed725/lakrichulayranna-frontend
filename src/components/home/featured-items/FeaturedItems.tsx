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
            // title="Signature Dishes"
            titleBn="বিশেষ আইটেম"
            align="left"
            className="mb-0"
          />
          <Link
            href="/menu"
            className="flex items-center gap-2 text-fire font-semibold font-bengali hover:text-fire-dark transition-colors group"
          >
            সব দেখুন
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:items-stretch">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-full">
                  <SkeletonCard />
                </div>
              ))
            : items.slice(0, 4).map((item: any) => (
                <div key={item.id} className="h-full">
                  <ItemCard item={item} />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
