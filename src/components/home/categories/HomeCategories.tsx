"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/shared/section-title/SectionTitle";
import React from "react";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export function HomeCategories() {
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get(API_ROUTES.CATEGORIES.BASE);
      return res.data.data;
    },
  });

  const categories = Array.isArray(data) ? data : data?.categories || [];
  const [carouselApi, setCarouselApi] = React.useState<CarouselApi>();

  React.useEffect(() => {
    if (!carouselApi) return;

    const intervalId = setInterval(() => {
      if (carouselApi.canScrollNext()) {
        carouselApi.scrollNext();
      } else {
        carouselApi.scrollTo(0);
      }
    }, 4000);

    return () => clearInterval(intervalId);
  }, [carouselApi]);

  if (!isLoading && categories.length === 0) {
    console.log("HomeCategories: No categories found", { data, categories });
    return null;
  }

  return (
    <div className="bg-cream overflow-hidden">
      <section className="py-10 max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <div className="flex flex-row justify-between items-center mb-8 sm:mb-10 gap-4">
            <div className="flex-1">
              <SectionTitle
                titleBn="ক্যাটাগরি দেখুন"
                align="left"
                className="mb-0"
              />
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* <div className="flex items-center gap-2">
                <CarouselPrevious className="static translate-y-0 h-8 w-8 sm:h-10 sm:w-10 text-fire border-fire hover:bg-fire hover:text-white transition-colors" />
                <CarouselNext className="static translate-y-0 h-8 w-8 sm:h-10 sm:w-10 text-fire border-fire hover:bg-fire hover:text-white transition-colors" />
              </div> */}

              <Link
                href="/menu"
                className="flex items-center gap-2 text-fire font-semibold font-bengali hover:text-fire-dark transition-colors group"
              >
                সব দেখুন
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <CarouselContent className="-ml-3 md:-ml-4">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                  <CarouselItem key={i} className="pl-3 basis-1/2 sm:basis-1/2 md:basis-[28%] lg:basis-1/5">
                    <motion.div variants={itemVariants}>
                      <div className="h-36 sm:h-44 bg-cream-dark/50 rounded-2xl animate-pulse" />
                    </motion.div>
                  </CarouselItem>
                ))
                : categories.map((category: any) => (
                  <CarouselItem key={category.id} className="pl-3 basis-1/2 sm:basis-1/2 md:basis-[28%] lg:basis-1/5">
                    <motion.div variants={itemVariants}>
                      <Link
                        href={`/menu?category.name=${encodeURIComponent(category.name)}`}
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
                    </motion.div>
                  </CarouselItem>
                ))}
            </CarouselContent>
          </motion.div>
        </Carousel>
      </section>
    </div>
  );
}
