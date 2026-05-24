"use client";

import { Container } from "@/components/shared/container/Container";
import { SectionTitle } from "@/components/shared/section-title/SectionTitle";
import { Tag, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";

export function HomeOffers() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const res = await api.get(`${API_ROUTES.COUPONS.BASE}?isActive=true`);
      return res.data.data;
    },
  });

  const coupons = Array.isArray(data) ? data.filter((c: any) => !c.isDeleted) : [];

  // Map coupon data to display format
  const offers = coupons.slice(0, 2).map((coupon: any) => ({
    id: coupon.id,
    title: coupon.title,
    code: coupon.code,
    discount: coupon.discountType === 'PERCENTAGE' 
      ? `${coupon.discountValue}%` 
      : `${coupon.discountValue}৳`,
    desc: coupon.description || '',
    bg: coupon.id === coupons[0]?.id ? "from-fire to-fire-dark" : "from-terracotta to-terracotta-light",
  }));

  // Only return null after loading if there's an error or no data
  if (!isLoading && (isError || offers.length === 0)) return null;

  const copyToClipboard = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="py-10 bg-cream-dark">
      <Container>
        <SectionTitle
          // title="Special Offers"
          titleBn="বিশেষ অফার"
          align="center"
        />
        <div className="grid md:grid-cols-2 gap-6 mt-10">
          {isLoading || (isError && offers.length === 0)
            ? Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-2xl p-6 sm:p-8 bg-cream-dark/50 animate-pulse h-40"
                />
              ))
            : offers.map((offer) => (
            <motion.div
              key={offer.id}
              whileHover={{ scale: 1.02 }}
              className={cn(
                "relative overflow-hidden rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-fire/10 flex flex-col sm:flex-row items-center justify-between gap-6",
                `bg-gradient-to-br ${offer.bg}`
              )}
            >
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-32 h-32 rounded-full bg-black/10 blur-xl" />

              <div className="relative z-10 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold mb-3">
                  <Tag size={14} />
                  <span>{offer.discount} ছাড়</span>
                </div>
                <h3 className="text-2xl font-bold font-bengali mb-2">
                  {offer.title}
                </h3>
                <p className="text-white/80 font-bengali text-sm max-w-[200px] mx-auto sm:mx-0">
                  {offer.desc}
                </p>
              </div>

              <div className="relative z-10 w-full sm:w-auto flex flex-col items-center p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 border-dashed">
                <p className="text-xs text-white/70 mb-1 uppercase tracking-wider">
                  কুপন কোড
                </p>
                <div className="font-mono text-xl font-bold tracking-widest mb-3">
                  {offer.code}
                </div>
                <button
                  onClick={() => copyToClipboard(offer.id, offer.code)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white text-charcoal rounded-lg text-sm font-bold hover:bg-cream transition-colors active:scale-95 cursor-pointer"
                >
                  {copiedId === offer.id ? (
                    <>
                      <CheckCircle2 size={16} className="text-success" />
                      <span>কপি হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>কপি করুন</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
