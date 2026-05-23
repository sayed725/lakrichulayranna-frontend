"use client";

import { ShoppingBag, DollarSign, UtensilsCrossed, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { OrdersTable } from "@/components/tables/OrdersTable";
import { useAdminOrders } from "@/features/order/hooks/useAdminOrders";
import { useAdminItems } from "@/features/item/hooks/useAdminItems";
import { formatPrice } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { data: orders, isLoading: ordersLoading } = useAdminOrders();
  const { data: items } = useAdminItems();

  const totalOrders = orders?.length || 0;
  const pendingOrders = orders?.filter((o: any) => o.status === "PENDING")?.length || 0;
  const totalRevenue = orders
    ?.filter((o: any) => o.status === "DELIVERED")
    ?.reduce((acc: number, curr: any) => acc + curr.total, 0) || 0;
  const totalItems = items?.length || 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-bengali text-charcoal mb-2">
            অ্যাডমিন ড্যাশবোর্ড
          </h1>
          <p className="text-muted font-bengali">আপনার রেস্টুরেন্টের সার্বিক অবস্থা দেখুন</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="মোট অর্ডার"
          value={totalOrders}
          icon={<ShoppingBag size={24} />}
          trend={12.5}
          trendLabel="গত মাসের তুলনায়"
        />
        <StatsCard
          title="মোট আয়"
          value={totalRevenue}
          icon={<DollarSign size={24} />}
          isCurrency
          trend={8.2}
          trendLabel="গত মাসের তুলনায়"
        />
        <StatsCard
          title="মোট আইটেম"
          value={totalItems}
          icon={<UtensilsCrossed size={24} />}
        />
        <StatsCard
          title="অপেক্ষমাণ অর্ডার"
          value={pendingOrders}
          icon={<Clock size={24} />}
          trend={-2.4}
          trendLabel="গত সপ্তাহের তুলনায়"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
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
          <div className="bg-white rounded-2xl border border-border p-6">
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
