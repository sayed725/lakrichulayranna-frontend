"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ShoppingBag, Eye, Star, Clock, AlertCircle, Copy, Check } from "lucide-react";
import { useCustomerOrders } from "@/features/order/hooks/useCustomerOrders";
import { useCustomerReviews } from "@/features/review/hooks/useCustomerReviews";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { ReviewModal } from "@/components/modals/ReviewModal";
import { motion } from "framer-motion";
import { toast } from "sonner";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function CustomerOrdersPage() {
  const { data: orders, isLoading } = useCustomerOrders();
  const { data: reviews } = useCustomerReviews();
  const [reviewOrder, setReviewOrder] = useState<any | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  const handleCopyOrderNumber = (orderNumber: string, orderId: string) => {
    navigator.clipboard.writeText(orderNumber);
    setCopiedOrderId(orderId);
    toast.success("অর্ডার নাম্বার কপি করা হয়েছে!");
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

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
          <p className="text-muted font-bengali">আপনার পূর্ববর্তী সকল অর্ডারের তালিকা ও ট্র্যাকিং</p>
        </div>

        {orders && orders.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {orders.map((order: any) => (
              <motion.div
                key={order.id}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="bg-white border border-border shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-all"
              >
                {/* Order Header */}
                <div className="bg-cream-dark/20 px-6 py-4 border-b border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-x-8 gap-y-2">
                      <div>
                        <p className="text-xs text-muted font-semibold font-bengali uppercase tracking-wider">অর্ডার প্লেস করা হয়েছে</p>
                        <p className="font-medium font-latin flex items-center gap-1 mt-0.5 text-sm text-charcoal">
                          <Clock className="w-3.5 h-3.5" />
                          {format(new Date(order.createdAt), "dd MMM, yyyy - hh:mm a")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted font-semibold font-bengali uppercase tracking-wider">মোট মূল্য</p>
                        <p className="font-bold text-fire mt-0.5 text-sm">{formatPrice(order.total || 0)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted font-semibold font-bengali uppercase tracking-wider">ডেলিভারি গ্রহীতা</p>
                        <p className="font-medium font-bengali mt-0.5 text-sm text-charcoal">{order.customerName || order.deliveryAddress?.name || order.user?.name || "N/A"}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted font-semibold font-bengali uppercase tracking-wider sm:text-right">অর্ডার নং</p>
                      <div className="flex items-center gap-1.5 justify-start sm:justify-end mt-0.5">
                        <span className="font-bold text-charcoal font-mono text-sm">#{order.orderNumber}</span>
                        <button
                          onClick={() => handleCopyOrderNumber(order.orderNumber, order.id)}
                          className="text-muted hover:text-fire transition-colors p-1 rounded hover:bg-cream-dark/50 cursor-pointer"
                          title="অর্ডার নাম্বার কপি করুন"
                        >
                          {copiedOrderId === order.id ? (
                            <Check className="w-3.5 h-3.5 text-green-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-6 flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="text-charcoal font-bold font-bengali">স্ট্যাটাস:</span>
                      <StatusBadge status={order.status} />
                    </div>

                    {order.status === "CANCELLED" && (
                      <div className="mb-4 bg-red-50 p-3 rounded-xl border border-red-100 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <p className="text-sm text-red-600 font-semibold font-bengali">
                          অর্ডারটি বাতিল করা হয়েছে
                        </p>
                      </div>
                    )}

                    {/* Order Items thumbnails */}
                    <div className="flex flex-wrap gap-3">
                      {order.items?.slice(0, 3).map((oi: any) => (
                        <div key={oi.id} className="relative group">
                          <div className="w-16 h-16 bg-cream rounded-xl overflow-hidden border border-border">
                            {oi.item?.imageUrl || oi.item?.mainImage ? (
                              <img 
                                src={oi.item.imageUrl || oi.item.mainImage} 
                                className="w-full h-full object-cover" 
                                alt={oi.item?.name || "খাবার"} 
                              />
                            ) : (
                              <div className="w-full h-full text-[10px] flex items-center justify-center bg-cream-dark text-muted">No image</div>
                            )}
                          </div>
                          <div className="absolute -top-2 -right-2 bg-fire text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
                            {oi.quantity}
                          </div>
                        </div>
                      ))}
                      {order.items && order.items.length > 3 && (
                        <div className="w-16 h-16 bg-cream-dark/50 rounded-xl border border-border flex items-center justify-center font-bold text-muted text-sm">
                          +{order.items.length - 3} আরও
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="w-full lg:w-48 flex flex-col gap-2 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-border">
                    <Link 
                      href={`/dashboard/customer/orders/${order.id}`}
                      className="flex items-center justify-center gap-2 w-full h-10 rounded-xl bg-fire/10 text-fire hover:bg-fire/20 transition-colors font-bold font-bengali text-sm shadow-sm cursor-pointer"
                    >
                      <Eye size={16} />
                      বিস্তারিত দেখুন
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
                        className="flex items-center justify-center gap-2 w-full h-10 bg-fire text-white rounded-xl font-bold font-bengali text-sm hover:bg-fire-dark transition-colors disabled:opacity-50 disabled:hover:bg-fire disabled:cursor-not-allowed shadow-sm cursor-pointer"
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
              </motion.div>
            ))}
          </motion.div>
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
