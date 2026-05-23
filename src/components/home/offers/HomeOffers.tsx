"use client";

import { Container } from "@/components/shared/container/Container";
import { Tag, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const OFFERS = [
  {
    id: 1,
    title: "প্রথম অর্ডারে ছাড়!",
    code: "WELCOME20",
    discount: "২০%",
    desc: "নতুন গ্রাহকদের জন্য প্রথম অর্ডারে ২০% ছাড়",
    bg: "from-fire to-fire-dark",
  },
  {
    id: 2,
    title: "উইকেন্ড ধামাকা",
    code: "WEEKEND50",
    discount: "৫০৳",
    desc: "৫০০৳ এর বেশি অর্ডারে ৫০৳ ছাড়",
    bg: "from-terracotta to-terracotta-light",
  },
];

export function HomeOffers() {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const copyToClipboard = (id: number, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="py-20 bg-cream-dark">
      <Container>
        <div className="grid md:grid-cols-2 gap-6">
          {OFFERS.map((offer) => (
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
