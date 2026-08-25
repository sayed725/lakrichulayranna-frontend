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
  Layers 
} from "lucide-react";
import Link from "next/link";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { OrdersTable } from "@/components/tables/OrdersTable";
import { useAdminOrders, useAdminDashboardStats } from "@/features/order/hooks/useAdminOrders";
import { formatPrice } from "@/lib/utils";
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

const COLORS = ["#FF6B6B", "#FF8E53", "#FFA07A", "#FFD23F", "#4ECDC4"];

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



  return (
    <div className="space-y-8 pb-10">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-bengali text-charcoal mb-2">
            অ্যাডমিন ড্যাশবোর্ড
          </h1>
          <p className="text-muted font-bengali">আপনার রেস্টুরেন্টের সার্বিক অবস্থা ও লাইভ অ্যানালিটিক্স</p>
        </div>
      </div>

      {/* Stats Grid - 2 columns on mobile/tab, 4 columns on large screens */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="মোট অর্ডার"
          value={counts.totalOrders}
          icon={<ShoppingBag size={20} />}
          trend={12.5}
          trendLabel="গত সপ্তাহের তুলনায়"
          isLoading={isLoading}
        />
        <StatsCard
          title="মোট আয়"
          value={formatPrice(counts.totalRevenue)}
          icon={<DollarSign size={20} />}
          trend={18.2}
          trendLabel="গত সপ্তাহের তুলনায়"
          isLoading={isLoading}
        />
        <StatsCard
          title="মোট আইটেম"
          value={counts.totalItems}
          icon={<UtensilsCrossed size={20} />}
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
        <StatsCard
          title="সক্রিয় ক্যাটাগরি"
          value={counts.totalCategories}
          icon={<Layers size={20} />}
          isLoading={isLoading}
        />
        <StatsCard
          title="মোট রিভিউ"
          value={counts.totalReviews}
          icon={<Star size={20} />}
          trend={15.3}
          trendLabel="গত সপ্তাহের তুলনায়"
          isLoading={isLoading}
        />
        <StatsCard
          title="সক্রিয় কুপন"
          value={counts.totalCoupons}
          icon={<Tag size={20} />}
          isLoading={isLoading}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Weekly Sales Area Chart */}
        <div className="bg-white rounded-3xl border border-border p-6 shadow-sm flex flex-col justify-between min-w-0">
          <div>
            <h2 className="text-lg font-bold font-bengali text-charcoal mb-1">সাপ্তাহিক বিক্রয় রিপোর্ট</h2>
            <p className="text-xs text-muted font-bengali mb-6">গত ৭ দিনের মোট বিক্রয় হিসেব (৳)</p>
          </div>
          
          <div className="h-64 w-full relative">
            {isLoading ? (
              <div className="absolute inset-0 bg-cream-dark/10 rounded-2xl animate-pulse flex items-center justify-center text-muted font-bengali text-sm">ডেটা লোড হচ্ছে...</div>
            ) : isMounted && weeklySales.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={weeklySales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1F2937", borderRadius: "12px", border: "none" }}
                    labelStyle={{ color: "#F9FAFB", fontWeight: "bold", fontFamily: "monospace" }}
                    itemStyle={{ color: "#F9FAFB" }}
                    formatter={(value: any) => [`৳ ${value}`, "বিক্রয়"]}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#FF6B6B" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted font-bengali text-sm">কোনো বিক্রয় রেকর্ড নেই</div>
            )}
          </div>
        </div>

        {/* Most Sold Items Bar Chart */}
        <div className="bg-white rounded-3xl border border-border p-6 shadow-sm flex flex-col justify-between min-w-0">
          <div>
            <h2 className="text-lg font-bold font-bengali text-charcoal mb-1">সর্বাধিক বিক্রিত খাবার</h2>
            <p className="text-xs text-muted font-bengali mb-6">পরিমাণের ওপর ভিত্তি করে শীর্ষ ৫টি জনপ্রিয় মেনু আইটেম</p>
          </div>
          
          <div className="h-64 w-full relative">
            {isLoading ? (
              <div className="absolute inset-0 bg-cream-dark/10 rounded-2xl animate-pulse flex items-center justify-center text-muted font-bengali text-sm">ডেটা লোড হচ্ছে...</div>
            ) : isMounted && mostSold.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={mostSold} layout="vertical" margin={{ top: 0, right: 10, left: 30, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                  <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tick={{ fill: "#1F2937", fontSize: 11, width: 100 }} width={80} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1F2937", borderRadius: "12px", border: "none" }}
                    labelStyle={{ color: "#F9FAFB", fontWeight: "bold", fontFamily: "monospace" }}
                    itemStyle={{ color: "#F9FAFB" }}
                    formatter={(value: any) => [`${value} টি`, "পরিমাণ"]}
                  />
                  <Bar dataKey="quantity" radius={[0, 6, 6, 0]} barSize={16}>
                    {mostSold.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted font-bengali text-sm">বিক্রিত কোনো ডেটা পাওয়া যায়নি</div>
            )}
          </div>
        </div>

      </div>

      {/* Main Grid: Orders & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 space-y-6 min-w-0">
          <div className="flex items-center justify-between bg-white p-6 rounded-t-2xl border border-b-0 border-border">
            <h2 className="text-xl font-bold font-bengali text-charcoal">সাম্প্রতিক অর্ডারসমূহ</h2>
            <Link
              href="/dashboard/admin/orders"
              className="flex items-center gap-1 text-sm font-semibold font-bengali text-fire hover:text-fire-dark transition-colors"
            >
              সব দেখুন <ArrowRight size={16} />
            </Link>
          </div>
          <div className="[&>div]:rounded-t-none [&>div]:border-t-0">
            <OrdersTable 
              orders={orders?.slice(0, 5) || []} 
              isLoading={ordersLoading} 
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h2 className="text-xl font-bold font-bengali text-charcoal mb-6 border-b border-border pb-4">
              কুইক অ্যাকশন
            </h2>
            <div className="space-y-3">
              <Link href="/dashboard/admin/items" className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-fire hover:bg-fire/5 transition-all group">
                <div className="w-10 h-10 rounded-lg bg-cream-dark flex items-center justify-center group-hover:bg-fire group-hover:text-white transition-colors">
                  <UtensilsCrossed size={20} />
                </div>
                <span className="font-semibold font-bengali text-charcoal">নতুন আইটেম যোগ করুন</span>
              </Link>
              <Link href="/dashboard/admin/banners" className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-fire hover:bg-fire/5 transition-all group">
                <div className="w-10 h-10 rounded-lg bg-cream-dark flex items-center justify-center group-hover:bg-fire group-hover:text-white transition-colors">
                  <UtensilsCrossed size={20} />
                </div>
                <span className="font-semibold font-bengali text-charcoal">ব্যানার আপডেট করুন</span>
              </Link>
              <Link href="/dashboard/admin/coupons" className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-fire hover:bg-fire/5 transition-all group">
                <div className="w-10 h-10 rounded-lg bg-cream-dark flex items-center justify-center group-hover:bg-fire group-hover:text-white transition-colors">
                  <UtensilsCrossed size={20} />
                </div>
                <span className="font-semibold font-bengali text-charcoal">নতুন কুপন তৈরি করুন</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
