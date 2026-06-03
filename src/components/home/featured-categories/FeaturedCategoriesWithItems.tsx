"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionTitle } from "@/components/shared/section-title/SectionTitle";
import { ItemCard } from "@/components/item/ItemCard";
import { SkeletonCard } from "@/components/loaders/SkeletonCard";
import { getHomeCategories } from "@/services/category.service";

export function FeaturedCategoriesWithItems() {
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["home-categories"],
    queryFn: () => getHomeCategories({ includeItems: 'true', itemsLimit: '4' }),
  });

  const featuredCategories = Array.isArray(categoriesData?.data)
    ? categoriesData.data
    : categoriesData?.categories || [];

  // console.log('categoriesData:', categoriesData);
  // console.log('featuredCategories:', featuredCategories);

  if (!categoriesLoading && featuredCategories.length === 0) return null;

  return (
    <>
      {featuredCategories.map((category: any) => (
        <CategorySection key={category.id} category={category} isLoading={categoriesLoading} />
      ))}
    </>
  );
}

function CategorySection({ category, isLoading }: { category: any; isLoading: boolean }) {
  const items = Array.isArray(category.items)
    ? category.items.map((item: any) => ({
        ...item,
        category: {
          id: category.id,
          name: category.name,
          slug: category.slug,
        },
      }))
    : [];

  // console.log('Category:', category.name, 'Items:', items);

  if (items.length === 0) return null;

  return (
    <section className="py-10 bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <SectionTitle
            titleBn={category.name}
            align="left"
            className="mb-0"
          />
          <Link
            href={`/menu?category.name=${encodeURIComponent(category.name)}`}
            className="flex items-center gap-1 sm:gap-2 text-fire font-semibold font-bengali hover:text-fire-dark transition-colors group"
          >
            সব<span className="hidden sm:block"> দেখুন</span>
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
            : items.map((item: any) => (
                <div key={item.id} className="h-full">
                  <ItemCard item={item} />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
