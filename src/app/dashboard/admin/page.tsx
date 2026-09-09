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
    <div className="space-y-3.5 sm:space-y-5 lg:space-y-6 pb-6 sm:pb-8 max-w-[1600px] mx-auto px-1 sm:px-2">
      {/* Eye-Catching Modern Hero Banner with Mesh Gradient & Glass Overlay */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-charcoal via-charcoal-light to-charcoal-dark dark:from-charcoal-dark dark:via-charcoal dark:to-black text-white p-4 sm:p-5 lg:p-6 shadow-xl border border-white/10">
        {/* Glow Effects & Accents */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-fire/30 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-36 sm:w-48 h-36 sm:h-48 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-5">
          <div className="space-y-1 sm:space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <span className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold bg-fire/20 text-fire-light border border-fire/30 backdrop-blur-md font-bengali">
                <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-fire animate-ping" />
                সিস্টেম লাইভ
              </span>
              <span className="text-[11px] sm:text-xs text-cream/70 flex items-center gap-1.5 font-bengali bg-white/5 px-2.5 sm:px-3 py-0.5 rounded-full border border-white/10">
                <Calendar className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-400" />
                {todayDate}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-bengali text-cream tracking-tight flex items-center gap-2">
              স্বাগতম, অ্যাডমিন! <Sparkles className="w-5 sm:w-6 h-5 sm:h-6 text-amber-400 shrink-0 animate-bounce" />
            </h1>
            <p className="text-xs sm:text-sm text-cream/70 font-bengali max-w-xl leading-relaxed">
              আপনার রেস্টুরেন্টের রিয়েল-টাইম সেলস, লাইভ পারফরম্যান্স ও সার্বিক ওভারভিউ
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 pt-1 sm:pt-0">
            <Link href="/dashboard/admin/orders" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-fire to-amber-600 hover:from-fire-dark hover:to-amber-700 text-white font-bold rounded-xl sm:rounded-2xl shadow-lg shadow-fire/25 hover:shadow-fire/40 hover:scale-[1.02] active:scale-[0.98] transition-all gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bengali border border-fire-light/30">
                <Plus className="w-4 h-4" />
                ম্যানুয়াল অর্ডার
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="space-y-2 sm:space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold font-bengali text-charcoal dark:text-cream flex items-center gap-2">
            <div className="w-1.5 sm:w-2 h-4 sm:h-5 bg-fire rounded-full" />
            <TrendingUp className="w-4 sm:w-5 h-4 sm:h-5 text-fire" />
            মূল পারফরম্যান্স ইন্ডিকেটর
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 lg:gap-4">
          <StatsCard
            title="মোট আয়"
            value={formatPrice(counts.totalRevenue)}
            icon={<DollarSign size={20} />}
            trend={18.2}
            trendLabel="গত সপ্তাহের তুলনায়"
            isLoading={isLoading}
          />
          <StatsCard
            title="মোট অর্ডার"
            value={counts.totalOrders}
            icon={<ShoppingBag size={20} />}
            trend={12.5}
            trendLabel="গত সপ্তাহের তুলনায়"
            isLoading={isLoading}
          />
          <StatsCard
            title="অপেক্ষমাণ অর্ডার"
            value={counts.pendingOrders}
            icon={<Clock size={20} />}
            isLoading={isLoading}
          />
          <StatsCard
            title="মোট কাস্টমার"
            value={counts.totalUsers}
            icon={<Users size={20} />}
            trend={8.4}
            trendLabel="গত সপ্তাহের তুলনায়"
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Secondary Quick Overview Mini Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5 lg:gap-4">
        <div className="group relative overflow-hidden bg-gradient-to-br from-card to-card/50 border border-border/80 rounded-xl sm:rounded-2xl p-3 sm:p-3.5 lg:p-4 shadow-sm hover:shadow-md hover:border-orange-500/40 transition-all duration-300">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 rounded-lg sm:rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-sm">
              <UtensilsCrossed size={17} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs text-muted-foreground font-bengali font-medium truncate">মোট আইটেম</p>
              <p className="text-base sm:text-lg lg:text-xl font-extrabold text-charcoal dark:text-cream leading-tight">{isLoading ? "..." : counts.totalItems}</p>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-gradient-to-br from-card to-card/50 border border-border/80 rounded-xl sm:rounded-2xl p-3 sm:p-3.5 lg:p-4 shadow-sm hover:shadow-md hover:border-blue-500/40 transition-all duration-300">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 rounded-lg sm:rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-sm">
              <Layers size={17} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs text-muted-foreground font-bengali font-medium truncate">সক্রিয় ক্যাটাগরি</p>
              <p className="text-base sm:text-lg lg:text-xl font-extrabold text-charcoal dark:text-cream leading-tight">{isLoading ? "..." : counts.totalCategories}</p>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-gradient-to-br from-card to-card/50 border border-border/80 rounded-xl sm:rounded-2xl p-3 sm:p-3.5 lg:p-4 shadow-sm hover:shadow-md hover:border-amber-500/40 transition-all duration-300">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 rounded-lg sm:rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shadow-sm">
              <Star size={17} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs text-muted-foreground font-bengali font-medium truncate">মোট রিভিউ</p>
              <p className="text-base sm:text-lg lg:text-xl font-extrabold text-charcoal dark:text-cream leading-tight">{isLoading ? "..." : counts.totalReviews}</p>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-gradient-to-br from-card to-card/50 border border-border/80 rounded-xl sm:rounded-2xl p-3 sm:p-3.5 lg:p-4 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all duration-300">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 rounded-lg sm:rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-sm">
              <Tag size={17} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs text-muted-foreground font-bengali font-medium truncate">সক্রিয় কুপন</p>
              <p className="text-base sm:text-lg lg:text-xl font-extrabold text-charcoal dark:text-cream leading-tight">{isLoading ? "..." : counts.totalCoupons}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid with Glassmorphic Card Styling */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4 lg:gap-5">
        {/* Weekly Sales Area Chart */}
        <div className="bg-card/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-border/80 p-4 sm:p-5 shadow-md flex flex-col justify-between min-w-0 hover:border-fire/30 transition-all">
          <div className="flex items-center justify-between mb-3.5 sm:mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold font-bengali text-charcoal dark:text-cream flex items-center gap-2">
                সাপ্তাহিক বিক্রয় রিপোর্ট
              </h2>
              <p className="text-[11px] sm:text-xs text-muted-foreground font-bengali mt-0.5">গত ৭ দিনের মোট বিক্রয় হিসেব (৳)</p>
            </div>
            <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 bg-fire/10 text-fire border border-fire/20 text-[10px] sm:text-[11px] font-semibold font-bengali rounded-full">
              লাইভ ট্র্যাকিং
            </span>
          </div>

          <div className="h-56 sm:h-60 w-full relative">
            {isLoading ? (
              <div className="absolute inset-0 bg-cream-dark/20 dark:bg-charcoal-light/40 rounded-2xl animate-pulse flex items-center justify-center text-muted-foreground font-bengali text-xs">
                ডেটা লোড হচ্ছে...
              </div>
            ) : isMounted && chartSalesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={230} minWidth={0} minHeight={210}>
                <AreaChart data={chartSalesData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0.02}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/40" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 11 }} className="text-muted-foreground" />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 11 }} className="text-muted-foreground" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1F2937", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)", padding: "10px 14px", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" }}
                    labelStyle={{ color: "#F9FAFB", fontWeight: "bold", fontSize: "12px" }}
                    itemStyle={{ color: "#FF8E53", fontSize: "12px" }}
                    formatter={(value: any) => [`৳ ${value}`, "বিক্রয়"]}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#FF6B6B" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
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
        <div className="bg-card/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-border/80 p-4 sm:p-5 shadow-md flex flex-col justify-between min-w-0 hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between mb-3.5 sm:mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold font-bengali text-charcoal dark:text-cream">সর্বাধিক বিক্রিত খাবার</h2>
              <p className="text-[11px] sm:text-xs text-muted-foreground font-bengali mt-0.5">শীর্ষ ৫টি জনপ্রিয় মেনু আইটেম</p>
            </div>
            <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] sm:text-[11px] font-semibold font-bengali rounded-full">
              শীর্ষ আইটেম
            </span>
          </div>

          <div className="h-56 sm:h-60 w-full relative">
            {isLoading ? (
              <div className="absolute inset-0 bg-cream-dark/20 dark:bg-charcoal-light/40 rounded-2xl animate-pulse flex items-center justify-center text-muted-foreground font-bengali text-xs">
                ডেটা লোড হচ্ছে...
              </div>
            ) : isMounted && chartMostSoldData.length > 0 ? (
              <ResponsiveContainer width="100%" height={230} minWidth={0} minHeight={210}>
                <BarChart data={chartMostSoldData} layout="vertical" margin={{ top: 0, right: 10, left: 25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="text-border/40" />
                  <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 11 }} className="text-muted-foreground" />
                  <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 11 }} width={85} className="text-charcoal dark:text-cream font-medium" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1F2937", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)", padding: "10px 14px", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" }}
                    labelStyle={{ color: "#F9FAFB", fontWeight: "bold", fontSize: "12px" }}
                    itemStyle={{ color: "#FFD23F", fontSize: "12px" }}
                    formatter={(value: any) => [`${value} টি`, "পরিমাণ"]}
                  />
                  <Bar dataKey="quantity" radius={[0, 8, 8, 0]} barSize={18}>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5">
        {/* Recent Orders Table Container */}
        <div className="lg:col-span-2 space-y-2.5 sm:space-y-3 min-w-0">
          <div className="flex items-center justify-between bg-card/90 backdrop-blur-sm px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border border-border shadow-sm">
            <div>
              <h2 className="text-base sm:text-lg font-bold font-bengali text-charcoal dark:text-cream">সাম্প্রতিক অর্ডারসমূহ</h2>
              <p className="text-[11px] sm:text-xs text-muted-foreground font-bengali">সর্বশেষ ৫টি প্রাপ্ত অর্ডার</p>
            </div>
            <Link
              href="/dashboard/admin/orders"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-fire/10 hover:bg-fire hover:text-white text-xs font-bold font-bengali text-fire transition-all duration-300"
            >
              সব দেখুন <ArrowRight size={14} />
            </Link>
          </div>
          <div className="rounded-xl sm:rounded-2xl border border-border bg-card/90 overflow-hidden shadow-sm">
            <OrdersTable 
              orders={orders?.slice(0, 5) || []} 
              isLoading={ordersLoading} 
            />
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="space-y-2.5 sm:space-y-3">
          <div className="bg-card/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-border/80 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3 sm:mb-3.5 pb-2 sm:pb-2.5 border-b border-border/60">
              <h2 className="text-base sm:text-lg font-bold font-bengali text-charcoal dark:text-cream flex items-center gap-2">
                <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-lg sm:rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Zap className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                </div>
                কুইক অ্যাকশন
              </h2>
            </div>
            <div className="space-y-2 sm:space-y-2.5">
              <Link 
                href="/dashboard/admin/items" 
                className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-border/70 hover:border-fire/50 hover:bg-gradient-to-r hover:from-fire/5 hover:to-transparent transition-all duration-300 group shadow-2xs"
              >
                <div className="flex items-center gap-3 sm:gap-3.5">
                  <div className="w-8 sm:w-8.5 h-8 sm:h-8.5 rounded-lg sm:rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover:bg-fire group-hover:text-white transition-all duration-300 shrink-0 shadow-sm">
                    <UtensilsCrossed size={16} />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold font-bengali text-xs sm:text-sm text-charcoal dark:text-cream block truncate">নতুন আইটেম যোগ করুন</span>
                    <span className="text-[10px] sm:text-[11px] text-muted-foreground font-bengali truncate block">মেনুতে ফুড ডিশ যোগ</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-muted-foreground group-hover:text-fire group-hover:translate-x-1 transition-all shrink-0" />
              </Link>

              <Link 
                href="/dashboard/admin/coupons" 
                className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-border/70 hover:border-emerald-500/50 hover:bg-gradient-to-r hover:from-emerald-500/5 hover:to-transparent transition-all duration-300 group shadow-2xs"
              >
                <div className="flex items-center gap-3 sm:gap-3.5">
                  <div className="w-8 sm:w-8.5 h-8 sm:h-8.5 rounded-lg sm:rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shrink-0 shadow-sm">
                    <Tag size={16} />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold font-bengali text-xs sm:text-sm text-charcoal dark:text-cream block truncate">নতুন কুপন তৈরি করুন</span>
                    <span className="text-[10px] sm:text-[11px] text-muted-foreground font-bengali truncate block">প্রমো কুপন ডিসকাউন্ট</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-muted-foreground group-hover:text-emerald-500 group-hover:translate-x-1 transition-all shrink-0" />
              </Link>

              <Link 
                href="/dashboard/admin/banners" 
                className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-border/70 hover:border-blue-500/50 hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-transparent transition-all duration-300 group shadow-2xs"
              >
                <div className="flex items-center gap-3 sm:gap-3.5">
                  <div className="w-8 sm:w-8.5 h-8 sm:h-8.5 rounded-lg sm:rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shrink-0 shadow-sm">
                    <Layers size={16} />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold font-bengali text-xs sm:text-sm text-charcoal dark:text-cream block truncate">ব্যানার আপডেট করুন</span>
                    <span className="text-[10px] sm:text-[11px] text-muted-foreground font-bengali truncate block">হোম স্লাইডার ব্যানার</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-1 transition-all shrink-0" />
              </Link>

              <Link 
                href="/dashboard/admin/reviews" 
                className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-border/70 hover:border-amber-500/50 hover:bg-gradient-to-r hover:from-amber-500/5 hover:to-transparent transition-all duration-300 group shadow-2xs"
              >
                <div className="flex items-center gap-3 sm:gap-3.5">
                  <div className="w-8 sm:w-8.5 h-8 sm:h-8.5 rounded-lg sm:rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shrink-0 shadow-sm">
                    <Star size={16} />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold font-bengali text-xs sm:text-sm text-charcoal dark:text-cream block truncate">রিভিউ মডারেট করুন</span>
                    <span className="text-[10px] sm:text-[11px] text-muted-foreground font-bengali truncate block">কাস্টমার ফিডব্যাক</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-muted-foreground group-hover:text-amber-500 group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
