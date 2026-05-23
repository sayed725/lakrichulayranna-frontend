"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/shared/container/Container";
import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";

export function HomeCategories() {
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get(API_ROUTES.CATEGORIES.BASE);
      return res.data.data;
    },
  });

  const categories = Array.isArray(data) ? data : data?.categories || [];

  if (isLoading || categories.length === 0) return null;

  return (
    <section className="py-12 bg-white border-y border-border">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((category: any, index: number) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              prefetch={true}
              className="group flex flex-col items-center bg-white p-6 rounded-2xl border border-border hover:border-fire/30 hover:shadow-lg hover:shadow-fire/5 transition-all duration-300 cursor-pointer"
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-4 rounded-full overflow-hidden bg-cream-dark group-hover:scale-110 transition-transform duration-300">
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 64px, 80px"
                  className="object-cover"
                />
              </div>
              <h3 className="font-bengali font-bold text-charcoal text-center group-hover:text-fire transition-colors">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
