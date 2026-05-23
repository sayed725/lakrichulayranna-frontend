"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Container } from "@/components/shared/container/Container";
import { ItemCard } from "@/components/item/ItemCard";
import { SkeletonGrid } from "@/components/loaders/SkeletonGrid";
import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: categoryData, isLoading: catLoading } = useQuery({
    queryKey: ["category", slug],
    queryFn: async () => {
      const res = await api.get(API_ROUTES.CATEGORIES.BY_SLUG(slug));
      return res.data.data;
    },
  });

  const { data: itemsData, isLoading: itemsLoading } = useQuery({
    queryKey: ["items", "category", slug],
    queryFn: async () => {
      const res = await api.get(`${API_ROUTES.ITEMS.BASE}?categorySlug=${slug}`);
      return res.data.data;
    },
  });

  const category = categoryData?.category || categoryData;
  const items = Array.isArray(itemsData) ? itemsData : itemsData?.items || [];

  return (
    <div className="bg-cream min-h-screen">
      {/* Category Header */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden bg-charcoal">
        {category?.imageUrl && (
          <>
            <Image
              src={category.imageUrl}
              alt={category?.name || "Category"}
              fill
              className="object-cover opacity-60 mix-blend-overlay"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal to-transparent opacity-80" />
          </>
        )}
        <Container className="relative h-full flex flex-col items-center justify-center text-center">
          {catLoading ? (
            <div className="w-48 h-10 bg-white/20 rounded-lg animate-pulse" />
          ) : (
            <>
              <h1 className="text-4xl md:text-5xl font-bold font-bengali text-white mb-4">
                {category?.name}
              </h1>
              {category?.description && (
                <p className="text-white/80 font-bengali max-w-2xl text-lg">
                  {category.description}
                </p>
              )}
            </>
          )}
        </Container>
      </div>

      {/* Items Grid */}
      <div className="py-16">
        <Container>
          {itemsLoading ? (
            <SkeletonGrid count={8} columns={4} />
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((item: any) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-border border-dashed">
              <p className="text-xl font-bold font-bengali text-muted">
                এই ক্যাটাগরিতে এখনো কোনো আইটেম যোগ করা হয়নি।
              </p>
            </div>
          )}
        </Container>
      </div>
    </div>
  );
}
