"use client";

import { useQuery } from "@tanstack/react-query";
import { Star, User, Utensils, Quote, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/shared/container/Container";
import { SectionTitle } from "@/components/shared/section-title/SectionTitle";
import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";

import Link from "next/link";
import { motion } from "framer-motion";

export function HomeReviews() {
  const { data, isLoading } = useQuery({
    queryKey: ["home-reviews"],
    queryFn: async () => {
      try {
        const res = await api.get(`${API_ROUTES.REVIEWS.BASE}?limit=6&sort=desc&isApproved=true&isDeleted=false&isFeatured=true`);
        return res.data.data;
      } catch (error) {
        console.warn("Failed to fetch reviews:", error);
        return [];
      }
    },
  });

  const reviews = Array.isArray(data) ? data : data?.reviews || [];

  // console.log("reviews", reviews);

  // Only return null after loading if there are no reviews
  if (!isLoading && reviews.length === 0) return null;

  // Duplicate reviews for seamless marquee loop
  const duplicateCount = 3;
  const marqueeReviews = [...Array(duplicateCount)].flatMap(() => reviews.slice(0, 3));

  return (
    <section className="py-10 bg-cream overflow-hidden">
      <Container>
        <SectionTitle
          titleBn="গ্রাহকদের মতামত"
          subtitle="যারা আমাদের খাবারের স্বাদ নিয়েছেন, তাদের অভিজ্ঞতা জানুন"
        />

        <div className="relative overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "-33.33%"] }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex gap-3 w-max"
            whileHover={{ animationPlayState: "paused" }}
          >
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="relative bg-white/80 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-[2rem] border border-white/20 h-[280px] w-[350px] md:w-[450px] shrink-0"
                  >
                    {/* Rating Skeleton */}
                    <div className="flex gap-1 mb-5">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-3.5 h-3.5 bg-cream-dark/50 rounded-full animate-pulse" />
                      ))}
                    </div>
                    {/* Comment Skeleton */}
                    <div className="space-y-3 mb-5">
                      <div className="h-5 bg-cream-dark/50 rounded-lg w-full animate-pulse" />
                      <div className="h-5 bg-cream-dark/50 rounded-lg w-[85%] animate-pulse" />
                      <div className="h-5 bg-cream-dark/50 rounded-lg w-[60%] animate-pulse" />
                    </div>
                    {/* Author Skeleton */}
                    <div className="flex items-center gap-4 mt-auto pt-5 border-t border-border">
                      <div className="h-12 w-12 rounded-full bg-cream-dark/50 animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-4 bg-cream-dark/50 rounded w-24 animate-pulse" />
                        <div className="h-2.5 bg-cream-dark/50 rounded w-16 animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))
              : marqueeReviews.map((review: any, idx) => {
                  const userInitial = review.user?.name?.charAt(0) || "গ";
                  return (
                    <div
                      key={`${review.id}-${idx}`}
                      className="group relative w-[350px] md:w-[450px] shrink-0"
                    >
                      {/* Card Background Bloom */}
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-fire to-terracotta rounded-[2rem] opacity-0 group-hover:opacity-20 blur-xl transition-all duration-700" />

                      <div className="relative bg-white/80 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-[2rem] border border-white/20 shadow-sm hover:shadow-lg sm:hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                        {/* Quote Icon - subtle background element */}
                        <div className="absolute top-0 right-0 text-fire/5 group-hover:text-fire/10 transition-colors duration-500">
                          <Quote size={100} fill="currentColor" />
                        </div>

                        {/* Item Info */}
                        {review.item && (
                          <Link
                            href={`/menu/${review.item.slug}`}
                            className="flex items-center gap-2 text-fire text-sm font-semibold mb-3 hover:text-fire-dark transition-colors relative z-10"
                          >
                            <Utensils size={14} />
                            <span>{review.item.name}</span>
                          </Link>
                        )}

                        {/* Rating */}
                        <div className="flex gap-1 mb-5 relative z-10">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              fill={i < review.rating ? "currentColor" : "none"}
                              className={i < review.rating ? "text-fire" : "text-muted-light"}
                            />
                          ))}
                        </div>

                        {/* Review Text */}
                        <p className="text-charcoal font-bengali text-lg leading-relaxed mb-6 italic flex-grow relative z-10">
                          "{review.comment}"
                        </p>

                        {/* User Info */}
                        <div className="flex items-center gap-4 mt-auto pt-5 border-t border-border relative z-10">
                          <div className="relative">
                            <div className="h-12 w-12 rounded-full bg-fire/10 border-2 border-fire/20 group-hover:border-fire/50 transition-colors duration-500 flex items-center justify-center">
                              <span className="text-fire font-bold text-lg">{userInitial}</span>
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                              <CheckCircle2 className="w-5 h-5 text-success fill-white" />
                            </div>
                          </div>

                          <div>
                            <h4 className="font-bold text-charcoal group-hover:text-fire transition-colors duration-300 font-bengali">
                              {review.user?.name || "গ্রাহক"}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] uppercase tracking-widest font-bold text-muted">
                                যাচাইকৃত ক্রেতা
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </motion.div>

          {/* Fade Gradients for Edges */}
          <div className="hidden md:block absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-cream to-transparent z-10 pointer-events-none" />
          <div className="hidden md:block absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-cream to-transparent z-10 pointer-events-none" />
        </div>
      </Container>
    </section>
  );
}
