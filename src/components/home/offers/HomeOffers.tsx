"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tag, Copy, CheckCircle2, Gift, Percent } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Container } from "@/components/shared/container/Container";
import { SectionTitle } from "@/components/shared/section-title/SectionTitle";
import apiClient from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const themeGradients = [
  {
    gradient: "from-fire to-fire-dark",
    bgPattern: "bg-cream-dark",
    icon: Percent,
  },
  {
    gradient: "from-terracotta to-terracotta-light",
    bgPattern: "bg-cream-dark",
    icon: Tag,
  },
  {
    gradient: "from-fire-light to-terracotta",
    bgPattern: "bg-cream-dark",
    icon: Gift,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const CouponCard = ({ coupon, theme }: { coupon: any, theme: any }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const Icon = theme.icon;
  const title = coupon.discountType === "PERCENTAGE" 
    ? `${coupon.discountValue}% ছাড়` 
    : `${coupon.discountValue}৳ ছাড়`;
  
  const defaultDescription = coupon.minOrderAmount 
    ? `${coupon.minOrderAmount}৳ এর উপরে অর্ডারে প্রযোজ্য।` 
    : "সকল অর্ডারে প্রযোজ্য।";

  const description = coupon.description || defaultDescription;

  return (
    <motion.div variants={itemVariants} className="group relative h-full">
      {/* Outer Glow */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${theme.gradient} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
      
      {/* Card Container */}
      <div className="relative h-full flex flex-col rounded-3xl border border-border bg-white/80 backdrop-blur-xl overflow-hidden hover:shadow-2xl transition-all duration-500">
        
        {/* Top Content Area */}
        <div className="p-6 lg:p-8 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="w-7 h-7 text-white" strokeWidth={2} />
            </div>
            {/* Status Badge */}
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${coupon.isActive ? "bg-success/10 text-success" : "bg-fire/10 text-fire"} text-xs font-bold uppercase tracking-wider font-latin`}>
               <span className={`w-1.5 h-1.5 rounded-full ${coupon.isActive ? "bg-success animate-pulse" : "bg-fire animate-pulse"}`} />
               {coupon.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <h3 className="text-2xl font-black text-charcoal mb-2 font-bengali">{title}</h3>
          <p className="text-charcoal/70 font-medium leading-relaxed flex-1 line-clamp-3 font-bengali">
            {description}
          </p>
        </div>

        {/* Ticket Separator */}
        <div className="relative h-4 flex items-center">
           <div className="absolute left-[-8px] w-4 h-4 rounded-full bg-cream border-r border-border" />
           <div className="absolute right-[-8px] w-4 h-4 rounded-full bg-cream border-l border-border" />
           <div className="w-full border-t-2 border-dashed border-border mx-4" />
        </div>

        {/* Bottom Code Area */}
        <div className={`p-6 ${theme.bgPattern} flex items-center justify-between gap-4 mt-auto`}>
           <div className="flex flex-col">
             <span className="text-[10px] uppercase font-bold text-muted tracking-widest mb-1 font-latin">Use Code</span>
             <span className="font-mono font-bold text-lg lg:text-xl text-charcoal tracking-wider">{coupon.code}</span>
           </div>
           
           <button 
             onClick={handleCopy}
             className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r ${theme.gradient} text-white font-bold text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all w-[110px]`}
           >
             {copied ? (
               <><CheckCircle2 className="w-4 h-4" /> কপি হয়েছে</>
             ) : (
               <><Copy className="w-4 h-4" /> কপি করুন</>
             )}
           </button>
        </div>
      </div>
    </motion.div>
  );
};

const CouponCardSkeleton = () => {
  return (
    <div className="relative h-[320px] flex flex-col rounded-3xl border border-border bg-white/50 overflow-hidden animate-pulse">
      <div className="p-6 lg:p-8 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div className="w-14 h-14 rounded-2xl bg-cream-dark" />
          <div className="w-20 h-6 rounded-full bg-cream-dark" />
        </div>
        <div className="h-8 bg-cream-dark rounded-lg w-3/4 mb-4" />
        <div className="h-4 bg-cream-dark rounded w-full mb-2" />
        <div className="h-4 bg-cream-dark rounded w-5/6" />
      </div>

      <div className="relative h-4 flex items-center">
         <div className="absolute left-[-8px] w-4 h-4 rounded-full bg-cream border-r border-border" />
         <div className="absolute right-[-8px] w-4 h-4 rounded-full bg-cream border-l border-border" />
         <div className="w-full border-t-2 border-dashed border-border mx-4" />
      </div>

      <div className="p-6 bg-cream-dark/50 flex items-center justify-between gap-4 mt-auto">
         <div className="flex flex-col gap-2 w-1/2">
           <div className="h-3 bg-cream-dark rounded w-16" />
           <div className="h-6 bg-cream-dark rounded w-full" />
         </div>
         <div className="h-10 rounded-xl bg-cream-dark w-[110px]" />
      </div>
    </div>
  );
};

export function HomeOffers() {
  const [api, setApi] = useState<CarouselApi>();
  const [isHovered, setIsHovered] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const res = await apiClient.get(`${API_ROUTES.COUPONS.BASE}?isActive=true`);
      return res.data.data;
    },
  });

  const coupons = Array.isArray(data) ? data.filter((c: any) => !c.isDeleted) : [];

  useEffect(() => {
    if (!api || isHovered) return;

    const intervalId = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 4000);

    return () => clearInterval(intervalId);
  }, [api, isHovered]);

  // Only return null after loading if there's an error or no data
  if (!isLoading && (isError || coupons.length === 0)) return null;

  return (
    <section className="py-10 bg-cream relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 -right-32 w-96 h-96 bg-fire/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 -left-32 w-96 h-96 bg-terracotta/5 rounded-full blur-[120px]" />
      </div>

      <Container className="relative z-10">
        <div className="text-center mb-3 max-w-2xl mx-auto flex flex-col items-center">
          <SectionTitle
            titleBn="বিশেষ অফার"
            subtitle="এই এক্সক্লুসিভ ডিলগুলো শেষ হওয়ার আগে লুফে নিন — আপনার স্বাদের কন্দক আপনাকে ধন্যবাদ জানাবে!"
            align="center"
          />
        </div>

        {isLoading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
             {[...Array(3)].map((_, i) => (
                <div key={i} className="h-full">
                  <CouponCardSkeleton />
                </div>
             ))}
           </div>
        ) : (
          <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
            className="w-full"
          >
            <Carousel
              setApi={setApi}
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-3 pb-12 pt-4 px-2">
                {coupons.map((coupon, index) => (
                  <CarouselItem key={coupon.id} className="pl-3 md:basis-1/2 lg:basis-1/3">
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-10%" }}
                      className="h-full"
                    >
                      <CouponCard 
                        coupon={coupon} 
                        theme={themeGradients[index % themeGradients.length]} 
                      />
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        )}
      </Container>
    </section>
  );
}
