"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ShoppingBag, Eye, Star } from "lucide-react";
import Link from "next/link";
import { usePublicOrder } from "@/features/order/hooks/useCustomerOrders";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatPrice } from "@/lib/utils";
import { ReviewModal } from "@/components/modals/ReviewModal";

export default function GuestOrdersPage() {
  const [orderNumbers, setOrderNumbers] = useState<string[]>([]);
  const [reviewOrder, setReviewOrder] = useState<any | null>(null);

  useEffect(() => {
    // Load order numbers from localStorage
    const storedOrders = JSON.parse(localStorage.getItem("guestOrders") || "[]");
    setOrderNumbers(storedOrders);
  }, []);

  if (orderNumbers.length === 0) {
    return (
      <div className="min-h-screen bg-cream-dark/20 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-bengali text-charcoal mb-1">
              আমার অর্ডারসমূহ
            </h1>
            <p className="text-muted font-bengali">আপনার পূর্ববর্তী সকল অর্ডারের তালিকা</p>
          </div>

          <div className="bg-white rounded-3xl border border-border border-dashed p-12 text-center mt-8">
            <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center text-muted mx-auto mb-4">
              <ShoppingBag size={24} />
            </div>
            <h2 className="text-xl font-bold font-bengali text-charcoal mb-2">কোনো অর্ডার নেই</h2>
            <p className="text-muted font-bengali mb-6">আপনি এখনও কোনো অর্ডার করেননি।</p>
            <Link
              href="/menu"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-fire text-white rounded-xl font-bold font-bengali hover:bg-fire-dark transition-all cursor-pointer"
            >
              অর্ডার করুন
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-dark/20 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-bengali text-charcoal mb-1">
            আমার অর্ডারসমূহ
          </h1>
          <p className="text-muted font-bengali">আপনার পূর্ববর্তী সকল অর্ডারের তালিকা</p>
        </div>

        <div className="bg-white rounded-3xl border border-border overflow-hidden">
          <div className="hidden lg:grid grid-cols-12 gap-4 p-6 border-b border-border bg-cream-dark/30 font-bold font-bengali text-charcoal">
            <div className="col-span-2">অর্ডার নং</div>
            <div className="col-span-3">তারিখ</div>
            <div className="col-span-2 text-center">আইটেম</div>
            <div className="col-span-2 text-center">স্ট্যাটাস</div>
            <div className="col-span-1 text-right">মোট</div>
            <div className="col-span-2 text-right">অ্যাকশন</div>
          </div>
          
          <div className="divide-y divide-border">
            {orderNumbers.map((orderNumber) => (
              <OrderItem key={orderNumber} orderNumber={orderNumber} setReviewOrder={setReviewOrder} />
            ))}
          </div>
        </div>
      </div>

      <ReviewModal 
        isOpen={!!reviewOrder} 
        onClose={() => setReviewOrder(null)} 
        order={reviewOrder} 
      />
    </div>
  );
}

function OrderItem({ orderNumber, setReviewOrder }: { orderNumber: string; setReviewOrder: (order: any) => void }) {
  const { data: order, isLoading, error } = usePublicOrder(orderNumber);

  if (isLoading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="h-4 w-32 bg-cream-dark/50 rounded mb-2" />
        <div className="h-3 w-24 bg-cream-dark/50 rounded" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-6 text-center text-muted text-sm">
        অর্ডার লোড করতে সমস্যা হয়েছে
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col lg:grid lg:grid-cols-12 lg:items-center gap-4 lg:gap-4 hover:bg-cream-dark/10 transition-colors group">
      {/* Mobile header view */}
      <div className="flex justify-between items-center lg:hidden mb-2">
        <span className="font-bold font-mono text-charcoal">#{order.orderNumber}</span>
        <StatusBadge status={order.status} />
      </div>

      {/* Desktop Order Number */}
      <div className="hidden lg:block col-span-2 font-bold font-mono text-charcoal">
        #{order.orderNumber}
      </div>

      {/* Date */}
      <div className="lg:col-span-3 text-muted text-sm font-latin">
        {format(new Date(order.createdAt), "dd MMM, yyyy - hh:mm a")}
      </div>

      {/* Items count */}
      <div className="lg:col-span-2 lg:text-center text-sm font-bengali text-charcoal flex justify-between lg:block">
        <span className="lg:hidden text-muted">আইটেম:</span>
        {order.items?.length || 0} টি
      </div>

      {/* Desktop Status */}
      <div className="hidden lg:flex col-span-2 justify-center">
        <StatusBadge status={order.status} />
      </div>

      {/* Total */}
      <div className="lg:col-span-1 flex justify-between lg:justify-end items-center gap-4 mt-2 lg:mt-0 pt-4 lg:pt-0 border-t border-border lg:border-0">
        <span className="lg:hidden text-muted font-bengali">মোট:</span>
        <span className="font-bold text-fire">{formatPrice(order.total || 0)}</span>
      </div>

      {/* Actions */}
      <div className="lg:col-span-2 flex justify-end items-center gap-2 mt-4 lg:mt-0 pt-4 lg:pt-0 border-t border-border lg:border-0">
        <Link 
          href={`/order/${order.orderNumber}`}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-cream-dark text-charcoal hover:bg-fire hover:text-white transition-colors"
          title="বিস্তারিত দেখুন"
        >
          <Eye size={18} />
        </Link>
        
        {order.status === "DELIVERED" && (
          <button 
            onClick={() => setReviewOrder(order)}
            className="flex items-center gap-2 px-4 h-10 bg-fire/10 text-fire rounded-full font-bold font-bengali text-sm hover:bg-fire hover:text-white transition-colors"
            title="রিভিউ দিন"
          >
            <Star size={16} />
            রিভিউ দিন
          </button>
        )}
      </div>
    </div>
  );
}
