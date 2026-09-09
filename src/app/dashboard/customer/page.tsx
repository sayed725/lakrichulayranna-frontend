"use client";

import { useState } from "react";
import { 
  ShoppingBag, 
  ArrowRight, 
  Clock, 
  Wallet, 
  Sparkles, 
  Copy, 
  Check, 
  Calendar,
  UtensilsCrossed,
  Truck,
  Heart,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";
import { useCustomerOrders } from "@/features/order/hooks/useCustomerOrders";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

const fadeInUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
} as const;

export default function CustomerDashboardPage() {
  const { user } = useAuthStore();
  const { data: orders, isLoading } = useCustomerOrders();
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  const handleCopyOrderNumber = (orderNumber: string, orderId: string) => {
    navigator.clipboard.writeText(orderNumber);
    setCopiedOrderId(orderId);
    toast.success("অর্ডার নাম্বার কপি করা হয়েছে!");
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  const activeOrders = orders?.filter((o: any) => o.status !== "DELIVERED" && o.status !== "CANCELLED") || [];
  const recentOrders = orders?.slice(0, 4) || [];
  
  // Format today's date in Bengali locale
  const todayDate = new Date().toLocaleDateString("bn-BD", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Calculate total spent on successfully delivered orders
  const totalSpent = orders
    ?.filter((o: any) => o.status === "DELIVERED")
    ?.reduce((sum: number, o: any) => sum + o.total, 0) || 0;

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 pb-8 sm:pb-12 max-w-[1600px] mx-auto px-1 sm:px-2">
      {/* Eye-Catching Modern Hero Banner */}
      <motion.div 
        {...fadeInUp}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-charcoal via-charcoal-light to-charcoal-dark dark:from-charcoal-dark dark:via-charcoal dark:to-black text-white p-4 sm:p-6 lg:p-8 shadow-xl border border-white/10"
      >
        {/* Glow Effects & Accents */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 sm:w-72 h-48 sm:h-72 rounded-full bg-fire/30 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-36 sm:w-56 h-36 sm:h-56 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-2 sm:space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold bg-fire/20 text-fire-light border border-fire/30 backdrop-blur-md font-bengali">
                <Sparkles className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
                কাস্টমার প্যানেল
              </span>
              <span className="text-[11px] sm:text-xs text-cream/70 flex items-center gap-1.5 font-bengali bg-white/5 px-2.5 sm:px-3 py-0.5 rounded-full border border-white/10">
                <Calendar className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-400" />
                {todayDate}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-bengali text-cream tracking-tight flex items-center gap-2">
              স্বাগতম, <span className="text-transparent bg-clip-text bg-gradient-to-r from-fire-light via-amber-400 to-amber-200">{user?.name || "সম্মানিত গ্রাহক"}!</span>
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-cream/80 font-bengali leading-relaxed">
              আপনার পছন্দের ঐতিহ্যবাহী কাঠের চুলায় তৈরি স্বাস্থ্যকর ও সুস্বাদু খাবারের ড্যাশবোর্ডে আপনাকে স্বাগতম। চলমান অর্ডার ও পূর্ববর্তী ইতিহাস এখান থেকে সহজেই পরিচালনা করুন।
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 shrink-0 pt-2 md:pt-0">
            <Link 
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-fire to-terracotta hover:from-fire-dark hover:to-fire text-white text-xs sm:text-sm font-bold font-bengali shadow-lg shadow-fire/25 hover:shadow-fire/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 w-full sm:w-auto"
            >
              <UtensilsCrossed className="w-4 h-4" />
              নতুন খাবার অর্ডার করুন
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Metrics & Overview Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5"
      >
        {/* Total Orders Card */}
        <div className="bg-white dark:bg-charcoal border border-border/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-semibold font-bengali text-muted dark:text-cream/60">মোট অর্ডারসমূহ</p>
            {isLoading ? (
              <div className="h-7 w-20 bg-cream-dark/60 dark:bg-white/10 rounded animate-pulse" />
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-extrabold font-latin text-charcoal dark:text-cream tracking-tight">
                  {orders?.length || 0}
                </span>
                <span className="text-xs font-bold font-bengali text-muted dark:text-cream/60">টি সম্পূর্ণ অর্ডার</span>
              </div>
            )}
          </div>
          <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 text-fire flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shrink-0">
            <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
        </div>

        {/* Active Orders Card */}
        <div className="bg-white dark:bg-charcoal border border-border/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-semibold font-bengali text-muted dark:text-cream/60">চলমান লাইভ অর্ডার</p>
            {isLoading ? (
              <div className="h-7 w-20 bg-cream-dark/60 dark:bg-white/10 rounded animate-pulse" />
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-extrabold font-latin text-amber-500 tracking-tight">
                  {activeOrders.length}
                </span>
                <span className="text-xs font-bold font-bengali text-amber-600 dark:text-amber-400">টি প্রসেসিং-এ</span>
              </div>
            )}
          </div>
          <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shrink-0 relative">
            {!isLoading && activeOrders.length > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fire opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-fire"></span>
              </span>
            )}
            <Clock className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
        </div>

        {/* Total Spent Card */}
        <div className="bg-white dark:bg-charcoal border border-border/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between group sm:col-span-2 lg:col-span-1">
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-semibold font-bengali text-muted dark:text-cream/60">মোট সম্পন্ন ডেলিভারি মানি</p>
            {isLoading ? (
              <div className="h-7 w-28 bg-cream-dark/60 dark:bg-white/10 rounded animate-pulse" />
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-latin tracking-tight">
                  {formatPrice(totalSpent)}
                </span>
              </div>
            )}
          </div>
          <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shrink-0">
            <Wallet className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
        </div>
      </motion.div>

      {/* Active Orders Detail Tracker Panel */}
      {activeOrders.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-fire/10 via-amber-500/5 to-terracotta/10 border border-fire/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-md backdrop-blur-sm"
        >
          <div className="flex items-center justify-between gap-2 mb-3.5 sm:mb-5">
            <h2 className="text-xs sm:text-base md:text-lg font-bold font-bengali text-charcoal dark:text-cream flex items-center gap-1.5 sm:gap-2 truncate">
              <span className="relative flex h-2 sm:h-3 w-2 sm:w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fire opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 sm:h-3 w-2 sm:w-3 bg-fire"></span>
              </span>
              <span className="truncate">চলমান অর্ডারের লাইভ আপডেট</span>
            </h2>
            <span className="text-[10px] sm:text-xs font-semibold font-bengali text-fire bg-white dark:bg-charcoal px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-fire/20 shadow-xs shrink-0 whitespace-nowrap">
              {activeOrders.length}টি লাইভ
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {activeOrders.map((order: any) => (
              <div 
                key={order.id} 
                className="bg-white dark:bg-charcoal p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-fire/15 dark:border-white/10 shadow-sm flex flex-col justify-between hover:border-fire/40 transition-all duration-200 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <p className="font-extrabold font-mono text-sm sm:text-base text-charcoal dark:text-cream tracking-wide">
                        #{order.orderNumber}
                      </p>
                      <button
                        onClick={() => handleCopyOrderNumber(order.orderNumber, order.id)}
                        className="text-muted dark:text-cream/50 hover:text-fire transition-colors p-1 rounded hover:bg-cream-dark/50 dark:hover:bg-white/10 cursor-pointer"
                        title="অর্ডার নাম্বার কপি করুন"
                      >
                        {copiedOrderId === order.id ? (
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] sm:text-xs text-muted dark:text-cream/60 font-latin">
                      {format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <div className="pt-2 border-t border-border/50 dark:border-white/5 flex items-center justify-between">
                  <div className="text-xs text-muted dark:text-cream/70 font-bengali">
                    মোট <span className="font-bold text-charcoal dark:text-cream">{order.items?.length || 0}</span>টি খাবার আইটেম
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-fire text-base sm:text-lg">{formatPrice(order.total)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Action Shortcuts Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
      >
        <Link 
          href="/dashboard/customer/orders"
          className="bg-white dark:bg-charcoal p-4 rounded-2xl border border-border/80 dark:border-white/10 hover:border-fire/40 dark:hover:border-fire/40 shadow-xs hover:shadow-md transition-all duration-200 flex items-center gap-3.5 group"
        >
          <div className="w-10 sm:w-11 h-10 sm:h-11 rounded-xl bg-fire/10 text-fire flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Truck className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs sm:text-sm font-bold font-bengali text-charcoal dark:text-cream truncate group-hover:text-fire transition-colors">
              সব অর্ডার ইতিহাস
            </h3>
            <p className="text-[11px] text-muted dark:text-cream/60 font-bengali truncate">পূর্বে অর্ডারের বিবরণ দেখুন</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted group-hover:text-fire group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link 
          href="/products"
          className="bg-white dark:bg-charcoal p-4 rounded-2xl border border-border/80 dark:border-white/10 hover:border-fire/40 dark:hover:border-fire/40 shadow-xs hover:shadow-md transition-all duration-200 flex items-center gap-3.5 group"
        >
          <div className="w-10 sm:w-11 h-10 sm:h-11 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs sm:text-sm font-bold font-bengali text-charcoal dark:text-cream truncate group-hover:text-amber-500 transition-colors">
              মেনু এক্সপ্লোর করুন
            </h3>
            <p className="text-[11px] text-muted dark:text-cream/60 font-bengali truncate">পছন্দের ডিস বেছে নিন</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link 
          href="/dashboard/customer/profile"
          className="bg-white dark:bg-charcoal p-4 rounded-2xl border border-border/80 dark:border-white/10 hover:border-fire/40 dark:hover:border-fire/40 shadow-xs hover:shadow-md transition-all duration-200 flex items-center gap-3.5 group"
        >
          <div className="w-10 sm:w-11 h-10 sm:h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs sm:text-sm font-bold font-bengali text-charcoal dark:text-cream truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              প্রোফাইল সেটিংস
            </h3>
            <p className="text-[11px] text-muted dark:text-cream/60 font-bengali truncate">ঠিকানা ও নাম আপডেট</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
        </Link>
      </motion.div>

      {/* Recent Orders Section */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="bg-white dark:bg-charcoal rounded-2xl sm:rounded-3xl border border-border/80 dark:border-white/10 shadow-sm overflow-hidden"
      >
        <div className="p-4 sm:p-6 border-b border-border/80 dark:border-white/10 flex items-center justify-between">
          <h2 className="text-base sm:text-xl font-bold font-bengali text-charcoal dark:text-cream flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-fire" /> সাম্প্রতিক অর্ডারসমূহ
          </h2>
          <Link href="/dashboard/customer/orders" className="text-xs sm:text-sm font-semibold font-bengali text-fire hover:text-fire-dark flex items-center gap-1 transition-colors">
            সব দেখুন <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="divide-y divide-border/60 dark:divide-white/5">
            {[1, 2, 3].map((n) => (
              <div key={n} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-pulse">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-cream-dark/60 dark:bg-white/10 shrink-0" />
                  <div className="space-y-1.5">
                    <div className="h-4 w-24 bg-cream-dark/60 dark:bg-white/10 rounded" />
                    <div className="h-3 w-32 bg-cream-dark/60 dark:bg-white/10 rounded" />
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/2">
                  <div className="h-6 w-20 bg-cream-dark/60 dark:bg-white/10 rounded-full" />
                  <div className="h-6 w-16 bg-cream-dark/60 dark:bg-white/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : recentOrders.length > 0 ? (
          <div className="divide-y divide-border/60 dark:divide-white/5">
            {recentOrders.map((order: any) => (
              <div key={order.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-cream/30 dark:hover:bg-white/[0.02] transition-all duration-200 gap-3 sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-cream dark:bg-white/5 flex items-center justify-center text-fire shrink-0 border border-border/60 dark:border-white/10">
                    <ShoppingBag className="w-4 sm:w-5 h-4 sm:h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-extrabold font-mono text-sm sm:text-base text-charcoal dark:text-cream hover:text-fire transition-colors">
                        #{order.orderNumber}
                      </p>
                      <button
                        onClick={() => handleCopyOrderNumber(order.orderNumber, order.id)}
                        className="text-muted dark:text-cream/50 hover:text-fire transition-colors p-1 rounded hover:bg-cream-dark/50 dark:hover:bg-white/10 cursor-pointer"
                        title="অর্ডার নাম্বার কপি করুন"
                      >
                        {copiedOrderId === order.id ? (
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-muted dark:text-cream/60 font-latin mt-0.5">
                      {format(new Date(order.createdAt), "dd MMM, yyyy • hh:mm a")}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 sm:w-1/2">
                  <div className="sm:text-right">
                    <StatusBadge status={order.status} />
                  </div>
                  <span className="font-extrabold text-charcoal dark:text-cream text-base sm:text-lg font-latin">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 sm:p-12 text-center max-w-sm mx-auto">
            <div className="w-14 sm:w-16 h-14 sm:h-16 bg-cream dark:bg-white/5 rounded-full flex items-center justify-center text-muted dark:text-cream/40 mx-auto mb-4">
              <ShoppingBag className="w-6 sm:w-7 h-6 sm:h-7" />
            </div>
            <p className="text-base sm:text-lg font-bold text-charcoal dark:text-cream font-bengali mb-1">কোনো অর্ডার নেই</p>
            <p className="text-xs sm:text-sm text-muted dark:text-cream/60 font-bengali mb-5">
              আপনি এখনও কাঠের চুলায় রান্না করা কোনো সুস্বাদু খাবার অর্ডার করেননি।
            </p>
            <Link href="/products" className="inline-flex px-5 sm:px-6 py-3 bg-fire text-white rounded-xl text-xs sm:text-sm font-bold font-bengali hover:bg-fire-dark transition-all shadow-md hover:shadow-fire/25 active:scale-95">
              খাবার অর্ডার করুন
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
