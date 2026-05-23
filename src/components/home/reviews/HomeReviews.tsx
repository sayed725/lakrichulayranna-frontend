"use client";

import { useQuery } from "@tanstack/react-query";
import { Star, User } from "lucide-react";
import { Container } from "@/components/shared/container/Container";
import { SectionTitle } from "@/components/shared/section-title/SectionTitle";
import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";
import { formatRelativeDate } from "@/lib/utils";

export function HomeReviews() {
  const { data, isLoading } = useQuery({
    queryKey: ["home-reviews"],
    queryFn: async () => {
      try {
        const res = await api.get(`${API_ROUTES.REVIEWS.BASE}?limit=3&sort=desc&isApproved=true`);
        return res.data.data;
      } catch (error) {
        console.warn("Failed to fetch reviews:", error);
        return [];
      }
    },
  });

  const reviews = Array.isArray(data) ? data : data?.reviews || [];

  // Only return null after loading if there are no reviews
  if (!isLoading && reviews.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <Container>
        <SectionTitle
          // title="Customer Testimonials"
          titleBn="গ্রাহকদের মতামত"
          subtitle="যারা আমাদের খাবারের স্বাদ নিয়েছেন, তাদের অভিজ্ঞতা জানুন"
        />

        <div className="grid md:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-cream/30 p-6 rounded-2xl border border-border animate-pulse h-48"
                />
              ))
            : reviews.slice(0, 3).map((review: any) => (
            <div
              key={review.id}
              className="bg-cream/30 p-6 rounded-2xl border border-border hover:shadow-lg transition-shadow duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4 text-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i < review.rating ? "currentColor" : "none"}
                    className={i < review.rating ? "text-warning" : "text-muted-light"}
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-charcoal font-bengali text-lg leading-relaxed mb-6 italic">
                "{review.comment}"
              </p>

              {/* User Info */}
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 rounded-full bg-fire/10 flex items-center justify-center">
                  <User size={18} className="text-fire" />
                </div>
                <div>
                  <h4 className="font-semibold font-bengali text-charcoal">
                    {review.user?.name || "গ্রাহক"}
                  </h4>
                  <p className="text-xs text-muted font-bengali">
                    {formatRelativeDate(review.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
