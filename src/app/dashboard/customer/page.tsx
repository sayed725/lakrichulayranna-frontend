"use client";

import { ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useAuthStore } from "@/store/auth.store";
import { useCustomerOrders } from "@/features/order/hooks/useCustomerOrders";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatPrice } from "@/lib/utils";

export default function CustomerDashboardPage() {
  const { user } = useAuthStore();
  const { data: orders, isLoading } = useCustomerOrders();

  const activeOrders = orders?.filter((o: any) => o.status !== "DELIVERED" && o.status !== "CANCELLED") || [];
  const recentOrders = orders?.slice(0, 3) || [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-charcoal text-cream rounded-3xl p-8 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-fire rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-bold font-bengali mb-2">
            স্বাগতম, <span className="text-fire">{user?.name?.split(" ")[0]}!</span>
          </h1>
          <p className="text-cream/80 font-bengali text-lg max-w-lg">
            আপনার ড্যাশবোর্ডে আপনাকে স্বাগতম। এখান থেকে আপনি আপনার সকল অর্ডার এবং প্রোফাইল নিয়ন্ত্রণ করতে পারবেন।
          </p>
        </div>
      </div>

      {/* Active Orders Summary */}
      {activeOrders.length > 0 && (
        <div className="bg-fire/10 border border-fire/20 rounded-2xl p-6">
          <h2 className="text-xl font-bold font-bengali text-charcoal mb-4 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fire opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-fire"></span>
            </span>
            চলমান অর্ডার ({activeOrders.length})
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {activeOrders.map((order: any) => (
              <div key={order.id} className="bg-white p-4 rounded-xl border border-fire/10 shadow-sm flex items-center justify-between">
                <div>
                  <p className="font-bold font-mono text-sm text-charcoal mb-1">#{order.orderNumber}</p>
                  <StatusBadge status={order.status} />
                </div>
                <div className="text-right">
                  <p className="font-bold text-fire">{formatPrice(order.total)}</p>
                  <p className="text-xs text-muted font-bengali mt-1">{order.items.length} আইটেম</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders Quick View */}
      <div className="bg-white rounded-3xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold font-bengali text-charcoal">সাম্প্রতিক অর্ডার</h2>
          <Link href="/dashboard/customer/orders" className="text-sm font-semibold font-bengali text-fire hover:text-fire-dark flex items-center gap-1 transition-colors">
            সব দেখুন <ArrowRight size={16} />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center animate-pulse text-muted font-bengali">অর্ডার লোড হচ্ছে...</div>
        ) : recentOrders.length > 0 ? (
          <div className="divide-y divide-border">
            {recentOrders.map((order: any) => (
              <div key={order.id} className="p-6 sm:flex items-center justify-between hover:bg-cream-dark/30 transition-colors">
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  <div className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center text-charcoal shrink-0 border border-border">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <p className="font-bold font-mono text-charcoal">#{order.orderNumber}</p>
                    <p className="text-sm text-muted font-latin">{format(new Date(order.createdAt), "dd MMM, yyyy")}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:w-1/2 gap-4">
                  <StatusBadge status={order.status} />
                  <span className="font-bold text-fire text-lg">{formatPrice(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center text-muted mx-auto mb-4">
              <ShoppingBag size={24} />
            </div>
            <p className="text-lg font-bold text-charcoal font-bengali mb-2">কোনো অর্ডার নেই</p>
            <p className="text-muted font-bengali mb-6">আপনি এখনও কোনো খাবার অর্ডার করেননি।</p>
            <Link href="/menu" className="inline-block px-6 py-3 bg-fire text-white rounded-xl font-bold font-bengali hover:bg-fire-dark transition-colors">
              মেনু দেখুন
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
