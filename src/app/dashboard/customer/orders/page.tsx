"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ShoppingBag, Eye, Star } from "lucide-react";
import { useCustomerOrders } from "@/features/order/hooks/useCustomerOrders";
import { useCustomerReviews } from "@/features/review/hooks/useCustomerReviews";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { ReviewModal } from "@/components/modals/ReviewModal";

export default function CustomerOrdersPage() {
  const { data: orders, isLoading } = useCustomerOrders();
  const { data: reviews } = useCustomerReviews();
  const [reviewOrder, setReviewOrder] = useState<any | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-48 bg-cream-dark/50 animate-pulse rounded mb-2" />
          <div className="h-4 w-64 bg-cream-dark/50 animate-pulse rounded" />
        </div>
        <div className="bg-white rounded-3xl border border-border p-6 h-64 animate-pulse" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-bengali text-charcoal mb-1">
            আমার অর্ডারসমূহ
          </h1>
          <p className="text-muted font-bengali">আপনার পূর্ববর্তী সকল অর্ডারের তালিকা</p>
        </div>

        {orders && orders.length > 0 ? (
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
              {orders.map((order: any) => (
                <div 
                  key={order.id} 
                  className="p-6 flex flex-col lg:grid lg:grid-cols-12 lg:items-center gap-4 lg:gap-4 hover:bg-cream-dark/10 transition-colors group"
                >
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
                    {order.items.length} টি
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
                      href={`/dashboard/customer/orders/${order.id}`}
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-cream-dark text-charcoal hover:bg-fire hover:text-white transition-colors"
                      title="বিস্তারিত দেখুন"
                    >
                      <Eye size={18} />
                    </Link>
                    
                    {order.status === "DELIVERED" && (
                      <button 
                        onClick={() => setReviewOrder(order)}
                        disabled={
                          !reviews ? false :
                          [...new Set(order.items.map((i: any) => i.item?.id).filter(Boolean))].every(
                            (id: any) => reviews.some((r: any) => r.itemId === id)
                          )
                        }
                        className="flex items-center gap-2 px-4 h-10 bg-fire/10 text-fire rounded-full font-bold font-bengali text-sm hover:bg-fire hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-fire/10 disabled:hover:text-fire disabled:cursor-not-allowed"
                        title={
                          reviews && [...new Set(order.items.map((i: any) => i.item?.id).filter(Boolean))].every(
                            (id: any) => reviews.some((r: any) => r.itemId === id)
                          ) ? "আপনি এই অর্ডারের সব আইটেমের রিভিউ দিয়েছেন" : "রিভিউ দিন"
                        }
                      >
                        <Star size={16} />
                        রিভিউ দিন
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-border border-dashed p-12 text-center">
            <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center text-muted mx-auto mb-4">
              <ShoppingBag size={24} />
            </div>
            <h2 className="text-xl font-bold font-bengali text-charcoal mb-2">কোনো অর্ডার নেই</h2>
            <p className="text-muted font-bengali mb-6">আপনি এখনও কোনো অর্ডার করেননি।</p>
          </div>
        )}
      </div>

      <ReviewModal 
        isOpen={!!reviewOrder} 
        onClose={() => setReviewOrder(null)} 
        order={reviewOrder} 
      />
    </>
  );
}
