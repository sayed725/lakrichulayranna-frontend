"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight, Utensils } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getBanners } from "@/services/banner.service";

const fallbackBanner = [
  {
    id: 1,
    title: "আগুনের আঁচে রান্না ভালোবাসায় পরিবেশন",
    subtitle: "Authentic wood-fire cooking, served with love. Experience the traditional flavors of Bengal delivered straight to your door.",
    badge: "১০০% খাঁটি দেশীয় স্বাদ",
    image: "/lakri_chulay_ranna_cover_photo.jpg",
  }
];

export function Hero() {
  const { data: bannerResponse, isLoading } = useQuery({
    queryKey: ["heroBanners"],
    queryFn: () => getBanners({ isActive: true, banner: true }),
  });

  const fetchedBanners = bannerResponse?.data?.filter((b: any) => b.banner).sort((a: any, b: any) => (a.order || 0) - (b.order || 0)) || [];
  
  const slides = fetchedBanners.length > 0 ? fetchedBanners : fallbackBanner;
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered, slides.length]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  if (slides.length === 0 && !isLoading) return null;

  const currentSlide = slides[current];
  const isFallback = currentSlide.id === 1;

  return (
    <section 
      className="relative h-[65vh] lg:h-[70vh] flex items-center overflow-hidden bg-charcoal"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={currentSlide.image || "/lakri_chulay_ranna_cover_photo.jpg"}
            alt={currentSlide.title || "Banner"}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-55 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 container mx-auto w-[90%] lg:w-11/12 py-20">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4 sm:space-y-6"
            >
              {/* Tagline */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fire/20 border border-fire/30 backdrop-blur-sm mb-6"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fire opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-fire"></span>
                </span>
                <span className="text-fire-light font-bengali text-sm font-semibold tracking-wide">
                  {currentSlide.badge || "১০০% খাঁটি দেশীয় স্বাদ"}
                </span>
              </motion.div>
              
              {/* Headline */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent hover:from-amber-600 hover:to-orange-700 transition-all"
              >
                {isFallback ? (
                  <>
                    আগুনের আঁচে <span className="text-fire relative inline-block">
                      রান্না
                      <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                        <path d="M2 8 C50 2, 100 2, 198 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
                      </svg>
                    </span>
                    <br />
                    ভালোবাসায় পরিবেশন
                  </>
                ) : (
                  currentSlide.title
                )}
              </motion.h1>
              
              {/* Subline */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-lg sm:text-xl text-cream/70 font-latin max-w-xl mb-10 leading-relaxed"
              >
                {currentSlide.subtitle}
              </motion.p>
              
              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href={currentSlide.categoryId ? `/menu?category=${currentSlide.categoryId}` : "/menu"}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-fire text-white font-semibold font-bengali text-lg rounded-xl hover:bg-fire-dark transition-all duration-300 hover:shadow-xl hover:shadow-fire/30 active:scale-95 group"
                >
                  <Utensils size={20} className="group-hover:rotate-12 transition-transform" />
                  অর্ডার করুন
                </Link>
                
                <Link
                  href="/menu"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-cream/20 text-cream font-semibold font-bengali text-lg rounded-xl hover:border-fire hover:text-fire hover:bg-fire/5 transition-all duration-300 active:scale-95 group"
                >
                  আমাদের মেনু দেখুন
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Controls */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 right-4 sm:bottom-10 sm:right-6 lg:right-12 flex items-center gap-4 sm:gap-6 z-20">
          <div className="flex gap-3 sm:gap-4">
            <button
              onClick={prevSlide}
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all hover:scale-110 active:scale-95 shadow-lg shadow-black/20"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all hover:scale-110 active:scale-95 shadow-lg shadow-black/20"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Progress Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-10 left-4 sm:bottom-12 sm:left-6 lg:left-12 flex gap-2 sm:gap-3 z-20">
          {slides.map((_: any, i: number) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="group relative h-2.5 flex items-center cursor-pointer overflow-hidden rounded-full shadow-sm"
              aria-label={`Go to slide ${i + 1}`}
            >
              <motion.div
                 animate={{ 
                   width: current === i ? 40 : 10,
                   backgroundColor: current === i ? "rgba(232, 93, 36, 1)" : "rgba(255, 255, 255, 0.4)" 
                 }}
                 transition={{ duration: 0.3 }}
                 className="h-full rounded-full"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
