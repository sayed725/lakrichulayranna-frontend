"use client";

import { useState } from "react";
import { ShoppingBag, ArrowRight, Clock, Wallet, Sparkles, Copy, Check } from "lucide-react";
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
  const recentOrders = orders?.slice(0, 3) || [];
  
  // Calculate total spent on successfully delivered orders
  const totalSpent = orders
    ?.filter((o: any) => o.status === "DELIVERED")
    ?.reduce((sum: number, o: any) => sum + o.total, 0) || 0;

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Banner */}
      <motion.div 
        {...fadeInUp}
        className="bg-gradient-to-br from-charcoal via-charcoal-light to-[#3d2c27] text-cream rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-xl border border-charcoal-light"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-fire rounded-full blur-3xl opacity-15 -translate-y-1/2 translate-x-1/3" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-terracotta rounded-full blur-2xl opacity-10" />
        
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fire/20 border border-fire/30 text-fire text-xs font-semibold font-bengali mb-4">
            <Sparkles size={12} className="animate-pulse" /> কাস্টমার ড্যাশবোর্ড
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-bengali mb-3 tracking-wide">
            স্বাগতম, <span className="text-fire font-extrabold">{user?.name}!</span>
          </h1>
          <p className="text-cream/70 font-bengali text-base sm:text-lg leading-relaxed">
            আপনার অ্যাকাউন্টের সাম্প্রতিক তথ্যসমূহ এখানে দেখতে পাবেন। আপনার অর্ডার ট্র্যাক করুন, পূর্বে সম্পন্ন করা খাবারগুলোর বিবরণ দেখুন এবং প্রোফাইল আপডেট করুন।
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {/* Total Orders Card */}
        <div className="bg-white p-6 rounded-2xl border border-border/80 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-5 group">
          <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center text-fire group-hover:scale-110 transition-transform duration-300 shrink-0">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold font-bengali text-muted mb-1">মোট অর্ডার</p>
            {isLoading ? (
              <div className="h-8 w-16 bg-cream-dark rounded animate-pulse mt-1" />
            ) : (
              <p className="text-2xl font-bold font-latin text-charcoal">{orders?.length || 0} টি</p>
            )}
          </div>
        </div>

        {/* Active Orders Card */}
        <div className="bg-white p-6 rounded-2xl border border-border/80 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-5 group">
          <div className="w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform duration-300 shrink-0 relative">
            {!isLoading && activeOrders.length > 0 && (
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fire opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-fire"></span>
              </span>
            )}
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold font-bengali text-muted mb-1">চলমান অর্ডার</p>
            {isLoading ? (
              <div className="h-8 w-16 bg-cream-dark rounded animate-pulse mt-1" />
            ) : (
              <p className="text-2xl font-bold font-latin text-charcoal">{activeOrders.length} টি</p>
            )}
          </div>
        </div>

        {/* Total Spent Card */}
        <div className="bg-white p-6 rounded-2xl border border-border/80 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-5 group sm:col-span-2 lg:col-span-1">
          <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform duration-300 shrink-0">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold font-bengali text-muted mb-1">মোট খরচ (সম্পন্ন অর্ডার)</p>
            {isLoading ? (
              <div className="h-8 w-24 bg-cream-dark rounded animate-pulse mt-1" />
            ) : (
              <p className="text-2xl font-bold text-emerald-600 font-latin">{formatPrice(totalSpent)}</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Active Orders Detail Panel */}
      {activeOrders.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-fire/5 to-amber-500/5 border border-fire/15 rounded-2xl p-6 shadow-sm"
        >
          <h2 className="text-lg font-bold font-bengali text-charcoal mb-4 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fire opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-fire"></span>
            </span>
            চলমান অর্ডারের লাইভ ট্র্যাকিং
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeOrders.map((order: any) => (
              <div key={order.id} className="bg-white p-5 rounded-xl border border-fire/10 shadow-sm flex items-center justify-between hover:border-fire/35 transition-colors duration-200">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold font-mono text-sm text-charcoal tracking-wide">#{order.orderNumber}</p>
                    <button
                      onClick={() => handleCopyOrderNumber(order.orderNumber, order.id)}
                      className="text-muted hover:text-fire transition-colors p-1 rounded hover:bg-cream-dark/50 cursor-pointer"
                      title="অর্ডার নাম্বার কপি করুন"
                    >
                      {copiedOrderId === order.id ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                  <div className="pt-0.5">
                    <StatusBadge status={order.status} />
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-fire text-base">{formatPrice(order.total)}</p>
                  <p className="text-xs text-muted font-bengali mt-1">{order.items.length}টি খাবার আইটেম</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Orders Section */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold font-bengali text-charcoal flex items-center gap-2">
            <ShoppingBag size={20} className="text-fire" /> সাম্প্রতিক অর্ডারসমূহ
          </h2>
          <Link href="/dashboard/customer/orders" className="text-sm font-semibold font-bengali text-fire hover:text-fire-dark flex items-center gap-1 transition-colors">
            সব অর্ডার দেখুন <ArrowRight size={16} />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="divide-y divide-border">
            {[1, 2, 3].map((n) => (
              <div key={n} className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cream-dark shrink-0" />
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-cream-dark rounded" />
                    <div className="h-3 w-32 bg-cream-dark rounded" />
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/2">
                  <div className="h-6 w-20 bg-cream-dark rounded-full" />
                  <div className="h-6 w-16 bg-cream-dark rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : recentOrders.length > 0 ? (
          <div className="divide-y divide-border">
            {recentOrders.map((order: any) => (
              <div key={order.id} className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-cream/20 transition-all duration-200 gap-4 sm:gap-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center text-fire shrink-0 border border-border/60">
                    <ShoppingBag size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold font-mono text-charcoal hover:text-fire transition-colors">#{order.orderNumber}</p>
                      <button
                        onClick={() => handleCopyOrderNumber(order.orderNumber, order.id)}
                        className="text-muted hover:text-fire transition-colors p-1 rounded hover:bg-cream-dark/50 cursor-pointer"
                        title="অর্ডার নাম্বার কপি করুন"
                      >
                        {copiedOrderId === order.id ? (
                          <Check className="w-3 h-3 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-muted font-latin mt-0.5">{format(new Date(order.createdAt), "dd MMM, yyyy • hh:mm a")}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/2">
                  <div className="sm:text-right">
                    <StatusBadge status={order.status} />
                  </div>
                  <span className="font-bold text-charcoal text-lg">{formatPrice(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center max-w-sm mx-auto">
            <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center text-muted mx-auto mb-4">
              <ShoppingBag size={24} className="text-muted-light" />
            </div>
            <p className="text-lg font-bold text-charcoal font-bengali mb-1">কোনো অর্ডার নেই</p>
            <p className="text-sm text-muted font-bengali mb-6">আপনি এখনও কাঠের চুলায় রান্না করা কোনো সুস্বাদু খাবার অর্ডার করেননি।</p>
            <Link href="/products" className="inline-flex px-6 py-3.5 bg-fire text-white rounded-xl font-bold font-bengali hover:bg-fire-dark transition-all shadow-md hover:shadow-fire/25 active:scale-95">
              খাবার অর্ডার করুন
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
