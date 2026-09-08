"use client";

import { useState, useEffect } from "react";
import { 
  ShoppingBag, 
  DollarSign, 
  UtensilsCrossed, 
  Clock, 
  ArrowRight, 
  Users, 
  Tag, 
  Star, 
  Layers,
  Sparkles,
  TrendingUp,
  Plus,
  Calendar,
  Zap,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { OrdersTable } from "@/components/tables/OrdersTable";
import { useAdminOrders, useAdminDashboardStats } from "@/features/order/hooks/useAdminOrders";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell
} from "recharts";

const BAR_COLORS = ["#FF6B6B", "#FF8E53", "#FFA07A", "#FFD23F", "#4ECDC4"];

export default function AdminDashboardPage() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: ordersResponse, isLoading: ordersLoading } = useAdminOrders();
  const { data: statsResponse, isLoading: statsLoading } = useAdminDashboardStats();

  const orders = ordersResponse?.data || [];
  const stats = statsResponse?.data || {
    counts: {
      totalOrders: 0,
      totalRevenue: 0,
      totalItems: 0,
      pendingOrders: 0,
      totalUsers: 0,
      totalCategories: 0,
      totalReviews: 0,
      totalCoupons: 0,
    },
    weeklySales: [],
    mostSold: [],
  };

  const { counts, weeklySales, mostSold } = stats;
  const isLoading = ordersLoading || statsLoading;

  // Compute 7-day sales data with fallback calculation from orders
  const chartSalesData = (() => {
    if (weeklySales && weeklySales.length > 0) {
      return weeklySales;
    }

    const dayNames = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"];
    const result: { day: string; sales: number; dateKey: string }[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = dayNames[d.getDay()];
      const dateKey = d.toISOString().split('T')[0];
      result.push({ day: dayName, sales: 0, dateKey });
    }

    if (orders && orders.length > 0) {
      orders.forEach((o: any) => {
        if (!o.createdAt) return;
        const orderDateKey = new Date(o.createdAt).toISOString().split('T')[0];
        const match = result.find((r) => r.dateKey === orderDateKey);
        if (match) {
          match.sales += Number(o.total || 0);
        }
      });
    }

    return result.map(({ day, sales }) => ({ day, sales }));
  })();

  // Compute top sold food items with fallback calculation from orders
  const chartMostSoldData = (() => {
    if (mostSold && mostSold.length > 0) {
      return mostSold;
    }

    if (!orders || orders.length === 0) return [];

    const itemCounts: { [name: string]: number } = {};
    orders.forEach((order: any) => {
      if (Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          const name = item.item?.name || item.name || "ফুড আইটেম";
          itemCounts[name] = (itemCounts[name] || 0) + (item.quantity || 1);
        });
      }
    });

    return Object.entries(itemCounts)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  })();

  // Format today's date in Bengali locale friendly format
  const todayDate = new Date().toLocaleDateString("bn-BD", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="space-y-4 sm:space-y-5 pb-6">
      {/* Hero Welcome Banner - Compact Spacing */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-fire/10 via-amber-500/10 to-fire/5 dark:from-fire/20 dark:via-charcoal-light/40 dark:to-charcoal-light/20 border border-fire/20 p-4 sm:p-5 shadow-sm">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 rounded-full bg-fire/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-fire/15 text-fire dark:bg-fire/25 dark:text-fire-light font-bengali">
                <span className="w-1.5 h-1.5 rounded-full bg-fire animate-pulse" />
                সিস্টেম লাইভ
              </span>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-bengali">
                <Calendar className="w-3 h-3" />
                {todayDate}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-bengali text-charcoal dark:text-cream tracking-tight flex items-center gap-1.5">
              স্বাগতম, অ্যাডমিন! <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
            </h1>
            <p className="text-xs text-muted-foreground font-bengali max-w-xl">
              আপনার রেস্টুরেন্টের রিয়েল-টাইম সেলস ও সার্বিক ওভারভিউ
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
            <Link href="/dashboard/admin/orders">
              <Button size="sm" className="bg-fire hover:bg-fire-dark text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all gap-1.5 px-3.5 py-2 text-xs font-bengali">
                <Plus className="w-3.5 h-3.5" />
                ম্যানুয়াল অর্ডার
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Grid - 2 columns on mobile/tablet, 4 on desktop */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold font-bengali text-charcoal dark:text-cream flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-fire" />
            মূল পারফরম্যান্স ইন্ডিকেটর
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatsCard
            title="মোট আয়"
            value={formatPrice(counts.totalRevenue)}
            icon={<DollarSign size={18} />}
            trend={18.2}
            trendLabel="গত সপ্তাহের তুলনায়"
            isLoading={isLoading}
          />
          <StatsCard
            title="মোট অর্ডার"
            value={counts.totalOrders}
            icon={<ShoppingBag size={18} />}
            trend={12.5}
            trendLabel="গত সপ্তাহের তুলনায়"
            isLoading={isLoading}
          />
          <StatsCard
            title="অপেক্ষমাণ অর্ডার"
            value={counts.pendingOrders}
            icon={<Clock size={18} />}
            isLoading={isLoading}
          />
          <StatsCard
            title="মোট কাস্টমার"
            value={counts.totalUsers}
            icon={<Users size={18} />}
            trend={8.4}
            trendLabel="গত সপ্তাহের তুলনায়"
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Secondary Metrics Summary Bar - 2 columns mobile, 4 columns tablet+ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-card border border-border rounded-xl p-3 sm:p-3.5 flex items-center gap-3 shadow-sm hover:border-fire/40 transition-all">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
            <UtensilsCrossed size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground font-bengali font-medium truncate">মোট আইটেম</p>
            <p className="text-base sm:text-lg font-bold text-charcoal dark:text-cream leading-tight">{isLoading ? "..." : counts.totalItems}</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-3 sm:p-3.5 flex items-center gap-3 shadow-sm hover:border-fire/40 transition-all">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Layers size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground font-bengali font-medium truncate">সক্রিয় ক্যাটাগরি</p>
            <p className="text-base sm:text-lg font-bold text-charcoal dark:text-cream leading-tight">{isLoading ? "..." : counts.totalCategories}</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-3 sm:p-3.5 flex items-center gap-3 shadow-sm hover:border-fire/40 transition-all">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Star size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground font-bengali font-medium truncate">মোট রিভিউ</p>
            <p className="text-base sm:text-lg font-bold text-charcoal dark:text-cream leading-tight">{isLoading ? "..." : counts.totalReviews}</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-3 sm:p-3.5 flex items-center gap-3 shadow-sm hover:border-fire/40 transition-all">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Tag size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground font-bengali font-medium truncate">সক্রিয় কুপন</p>
            <p className="text-base sm:text-lg font-bold text-charcoal dark:text-cream leading-tight">{isLoading ? "..." : counts.totalCoupons}</p>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {/* Weekly Sales Area Chart */}
        <div className="bg-card rounded-2xl border border-border p-4 sm:p-5 shadow-sm flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold font-bengali text-charcoal dark:text-cream">সাপ্তাহিক বিক্রয় রিপোর্ট</h2>
              <p className="text-[11px] text-muted-foreground font-bengali">গত ৭ দিনের মোট বিক্রয় হিসেব (৳)</p>
            </div>
            <span className="px-2.5 py-0.5 bg-cream-dark/50 dark:bg-charcoal-light/60 text-[10px] font-semibold font-bengali rounded-full text-muted-foreground">
              লাইভ ডাটা
            </span>
          </div>

          <div className="h-56 sm:h-64 w-full relative">
            {isLoading ? (
              <div className="absolute inset-0 bg-cream-dark/20 dark:bg-charcoal-light/40 rounded-xl animate-pulse flex items-center justify-center text-muted-foreground font-bengali text-xs">
                ডেটা লোড হচ্ছে...
              </div>
            ) : isMounted && chartSalesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240} minWidth={0} minHeight={220}>
                <AreaChart data={chartSalesData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.45}/>
                      <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/60" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 11 }} className="text-muted-foreground" />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 11 }} className="text-muted-foreground" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1F2937", borderRadius: "12px", border: "none", padding: "8px 12px" }}
                    labelStyle={{ color: "#F9FAFB", fontWeight: "bold", fontSize: "12px" }}
                    itemStyle={{ color: "#FF8E53", fontSize: "12px" }}
                    formatter={(value: any) => [`৳ ${value}`, "বিক্রয়"]}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#FF6B6B" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground font-bengali text-xs">
                কোনো বিক্রয় রেকর্ড নেই
              </div>
            )}
          </div>
        </div>

        {/* Top Selling Food Items Bar Chart */}
        <div className="bg-card rounded-2xl border border-border p-4 sm:p-5 shadow-sm flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold font-bengali text-charcoal dark:text-cream">সর্বাধিক বিক্রিত খাবার</h2>
              <p className="text-[11px] text-muted-foreground font-bengali">শীর্ষ ৫টি জনপ্রিয় মেনু আইটেম</p>
            </div>
            <span className="px-2.5 py-0.5 bg-fire/10 text-fire text-[10px] font-semibold font-bengali rounded-full">
              জনপ্রিয়
            </span>
          </div>

          <div className="h-56 sm:h-64 w-full relative">
            {isLoading ? (
              <div className="absolute inset-0 bg-cream-dark/20 dark:bg-charcoal-light/40 rounded-xl animate-pulse flex items-center justify-center text-muted-foreground font-bengali text-xs">
                ডেটা লোড হচ্ছে...
              </div>
            ) : isMounted && chartMostSoldData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240} minWidth={0} minHeight={220}>
                <BarChart data={chartMostSoldData} layout="vertical" margin={{ top: 0, right: 10, left: 25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="text-border/60" />
                  <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 11 }} className="text-muted-foreground" />
                  <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 10 }} width={80} className="text-charcoal dark:text-cream" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1F2937", borderRadius: "12px", border: "none", padding: "8px 12px" }}
                    labelStyle={{ color: "#F9FAFB", fontWeight: "bold", fontSize: "12px" }}
                    itemStyle={{ color: "#FFD23F", fontSize: "12px" }}
                    formatter={(value: any) => [`${value} টি`, "পরিমাণ"]}
                  />
                  <Bar dataKey="quantity" radius={[0, 6, 6, 0]} barSize={16}>
                    {chartMostSoldData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground font-bengali text-xs">
                বিক্রিত কোনো ডেটা পাওয়া যায়নি
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders & Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Recent Orders Table Container */}
        <div className="lg:col-span-2 space-y-3 min-w-0">
          <div className="flex items-center justify-between bg-card px-4 py-3 sm:px-5 sm:py-3.5 rounded-xl border border-border shadow-sm">
            <div>
              <h2 className="text-base font-bold font-bengali text-charcoal dark:text-cream">সাম্প্রতিক অর্ডারসমূহ</h2>
              <p className="text-[11px] text-muted-foreground font-bengali">সর্বশেষ ৫টি প্রাপ্ত অর্ডার</p>
            </div>
            <Link
              href="/dashboard/admin/orders"
              className="inline-flex items-center gap-1 text-xs font-semibold font-bengali text-fire hover:text-fire-dark transition-colors"
            >
              সব দেখুন <ArrowRight size={14} />
            </Link>
          </div>
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            <OrdersTable 
              orders={orders?.slice(0, 5) || []} 
              isLoading={ordersLoading} 
            />
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="space-y-3">
          <div className="bg-card rounded-xl border border-border p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-border">
              <h2 className="text-base font-bold font-bengali text-charcoal dark:text-cream flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                কুইক অ্যাকশন
              </h2>
            </div>
            <div className="space-y-2.5">
              <Link 
                href="/dashboard/admin/items" 
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-fire/50 hover:bg-fire/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover:bg-fire group-hover:text-white transition-colors shrink-0">
                    <UtensilsCrossed size={16} />
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold font-bengali text-xs sm:text-sm text-charcoal dark:text-cream block truncate">নতুন আইটেম যোগ করুন</span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground font-bengali truncate block">মেনুতে ফুড ডিস যোগ</span>
                  </div>
                </div>
                <ChevronRight size={14} className="text-muted-foreground group-hover:text-fire group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>

              <Link 
                href="/dashboard/admin/coupons" 
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-fire/50 hover:bg-fire/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:bg-fire group-hover:text-white transition-colors shrink-0">
                    <Tag size={16} />
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold font-bengali text-xs sm:text-sm text-charcoal dark:text-cream block truncate">নতুন কুপন তৈরি করুন</span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground font-bengali truncate block">প্রমো কুপন ডিসকাউন্ট</span>
                  </div>
                </div>
                <ChevronRight size={14} className="text-muted-foreground group-hover:text-fire group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>

              <Link 
                href="/dashboard/admin/banners" 
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-fire/50 hover:bg-fire/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-fire group-hover:text-white transition-colors shrink-0">
                    <Layers size={16} />
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold font-bengali text-xs sm:text-sm text-charcoal dark:text-cream block truncate">ব্যানার আপডেট করুন</span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground font-bengali truncate block">হোম স্লাইডার ব্যানার</span>
                  </div>
                </div>
                <ChevronRight size={14} className="text-muted-foreground group-hover:text-fire group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>

              <Link 
                href="/dashboard/admin/reviews" 
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-fire/50 hover:bg-fire/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:bg-fire group-hover:text-white transition-colors shrink-0">
                    <Star size={16} />
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold font-bengali text-xs sm:text-sm text-charcoal dark:text-cream block truncate">রিভিউ মডারেট করুন</span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground font-bengali truncate block">কাস্টমার ফিডব্যাক</span>
                  </div>
                </div>
                <ChevronRight size={14} className="text-muted-foreground group-hover:text-fire group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
