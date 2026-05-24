"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/shared/container/Container";
import { SectionTitle } from "@/components/shared/section-title/SectionTitle";
import { useRef, useEffect, useState } from "react";
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      setCanScrollLeft(scrollRef.current.scrollLeft > 0);
      setCanScrollRight(
        scrollRef.current.scrollLeft <
          scrollRef.current.scrollWidth - scrollRef.current.clientWidth
      );
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Auto-play carousel
  useEffect(() => {
    if (!scrollRef.current || categories.length === 0) return;

    const intervalId = setInterval(() => {
      if (scrollRef.current) {
        const scrollAmount = scrollRef.current.clientWidth * 0.8;
        const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
        
        if (scrollRef.current.scrollLeft >= maxScroll) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 4000);

    return () => clearInterval(intervalId);
  }, [categories]);

  useEffect(() => {
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener('scroll', checkScroll);
      checkScroll();
      return () => ref.removeEventListener('scroll', checkScroll);
    }
  }, [categories]);

  if (!isLoading && categories.length === 0) return null;

  return (
    <section className="py-12 bg-cream">
      <Container>
        <div className="flex items-end justify-between mb-8">
          <SectionTitle
            // title="Shop by Category"
            titleBn="ক্যাটাগরি দেখুন"
            align="left"
            className="mb-0"
          />
          <Link
            href="/categories"
            className="flex items-center gap-2 text-fire font-semibold font-bengali hover:text-fire-dark transition-colors group"
          >
            সব দেখুন
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="relative">
          {/* <div className="flex items-center gap-2 sm:gap-3 mb-4">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border-2 border-fire text-fire hover:bg-fire hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center shrink-0"
            >
              <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border-2 border-fire text-fire hover:bg-fire hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center shrink-0"
            >
              <ChevronRight size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div> */}
          
          <div 
            ref={scrollRef}
            className="flex gap-3 md:gap-3 overflow-x-auto pb-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            } as any}
          >
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="shrink-0 w-[45%] sm:w-[45%] md:w-[28%] lg:w-[19%] h-36 sm:h-44 bg-cream-dark/50 rounded-2xl animate-pulse snap-center"
                  />
                ))
              : categories.map((category: any) => (
                  <div
                    key={category.id}
                    className="shrink-0 w-[45%] sm:w-[45%] md:w-[28%] lg:w-[19%] snap-center"
                  >
                    <Link
                      href={`/categories/${category.slug}`}
                      prefetch={true}
                      className="block group relative overflow-hidden rounded-2xl h-36 sm:h-44 bg-cream-dark border border-border hover:shadow-xl hover:shadow-fire/10 transition-all"
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={category.imageUrl}
                          alt={category.name}
                          fill
                          sizes="(max-width: 640px) 45vw, (max-width: 768px) 45vw, (max-width: 1024px) 28vw, 19vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-3 sm:p-4">
                          <h3 className="text-white font-bold text-base sm:text-lg leading-tight mb-1 font-bengali">
                            {category.name}
                          </h3>
                          <p className="text-white/80 text-[10px] sm:text-xs font-medium bg-black/40 w-fit px-2 py-0.5 rounded backdrop-blur-md">
                            {category._count?.items || category.itemCount || 0} আইটেম
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
