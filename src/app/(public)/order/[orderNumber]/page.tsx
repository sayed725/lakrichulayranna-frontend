"use client";

import { use, useState } from "react";
import { Download, MapPin, Phone, User, FileText, ArrowLeft, CreditCard, Clock, Check, Copy, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { formatPrice } from "@/lib/utils";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { usePublicOrder } from "@/features/order/hooks/useCustomerOrders";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Container } from "@/components/shared/container/Container";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function PublicOrderDetailsPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const resolvedParams = use(params);
  const { data: order, isLoading, error } = usePublicOrder(resolvedParams.orderNumber);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success(`${label} কপি করা হয়েছে!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream py-12">
        <Container className="space-y-6 animate-pulse">
          {/* Back button skeleton */}
          <div className="h-6 w-32 bg-cream-dark/50 rounded-xl" />
          
          {/* Tracking Timeline Skeleton */}
          <div className="bg-white border border-border rounded-3xl p-6 sm:p-10 shadow-sm h-40 flex items-center justify-between gap-4">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cream-dark/50" />
                <div className="h-4 w-16 bg-cream-dark/50 rounded-lg mt-3" />
              </div>
            ))}
          </div>

          {/* Order Details Grid Skeleton */}
          <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 mb-6">
              <div className="space-y-2">
                <div className="h-8 w-64 bg-cream-dark/50 rounded-xl" />
                <div className="h-4 w-40 bg-cream-dark/30 rounded-lg" />
              </div>
              <div className="h-10 w-32 bg-cream-dark/50 rounded-xl" />
            </div>
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="h-6 w-36 bg-cream-dark/50 rounded-lg" />
                <div className="h-24 bg-cream-dark/30 rounded-2xl" />
              </div>
              <div className="space-y-3">
                <div className="h-6 w-36 bg-cream-dark/50 rounded-lg" />
                <div className="h-24 bg-cream-dark/30 rounded-2xl" />
              </div>
            </div>
          </div>

          {/* Items List Skeleton */}
          <div className="bg-white border border-border rounded-3xl shadow-sm overflow-hidden">
            <div className="h-14 bg-cream-dark/30 w-full" />
            <div className="p-6 space-y-4">
              <div className="h-16 bg-cream-dark/30 rounded-2xl" />
              <div className="h-16 bg-cream-dark/30 rounded-2xl" />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[60vh] bg-cream flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl border border-border text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center text-muted mx-auto mb-4">
            <FileText size={32} />
          </div>
          <h2 className="text-xl font-bold font-bengali text-charcoal mb-2">অর্ডার পাওয়া যায়নি</h2>
          <p className="text-muted font-bengali mb-6">দুঃখিত, আপনার অর্ডারটি খুঁজে পাওয়া যায়নি।</p>
          <Link 
            href="/my-orders"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-fire text-white rounded-xl font-bold font-bengali hover:bg-fire-dark transition-all cursor-pointer"
          >
            <ArrowLeft size={18} />
            আমার অর্ডারে যান
          </Link>
        </div>
      </div>
    );
  }

  const parsedAddress = typeof order.deliveryAddress === 'string' 
    ? JSON.parse(order.deliveryAddress) 
    : order.deliveryAddress || {};

  const OrderTracking = ({ status }: { status: string }) => {
    if (status === "CANCELLED") return null;

    const steps = [
      { status: "PENDING", label: "অপেক্ষমাণ", desc: "অর্ডারটি গ্রহণ করা হয়েছে" },
      { status: "CONFIRMED", label: "নিশ্চিতকৃত", desc: "অর্ডারটি নিশ্চিত করা হয়েছে" },
      { status: "PREPARING", label: "প্রস্তুত হচ্ছে", desc: "খাবার রান্না হচ্ছে" },
      { status: "READY", label: "প্রস্তুত", desc: "ডেলিভারির জন্য প্রস্তুত" },
      { status: "DELIVERED", label: "ডেলিভার্ড", desc: "অর্ডারটি পেয়ে গেছেন" },
    ];

    const currentStepIndex = steps.findIndex(s => s.status === status);

    return (
      <motion.div 
        variants={fadeInUp} 
        className="bg-white border border-border rounded-3xl p-4 sm:p-10 shadow-sm relative mb-8 overflow-hidden"
      >
        <div className="relative pt-2">
          {/* Tracking Line */}
          <div className="absolute top-7 sm:top-8 left-[10%] right-[10%] h-[3px] -translate-y-1/2 z-0">
            <div className="absolute inset-0 bg-border rounded-full" />
            <motion.div 
              className="absolute top-0 left-0 h-full bg-fire rounded-full shadow-[0_0_10px_rgba(232,93,36,0.3)]"
              initial={{ width: "0%" }}
              animate={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
            />
          </div>

          <div className="relative flex justify-between items-start z-10">
            {steps.map((step, index) => {
              const isCompleted = index <= currentStepIndex;

              return (
                <div key={step.status} className="flex flex-col items-center flex-1">
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 + (index * 0.1) }}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-[4px] transition-all duration-500 shadow-md ${
                      isCompleted 
                        ? "bg-fire border-orange-100 text-white" 
                        : "bg-white border-border text-muted"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3px]" />
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-border" />
                    )}
                  </motion.div>
                  
                  <div className="mt-4 text-center px-1">
                    <p className={`text-[10px] sm:text-xs font-bold font-bengali mb-1.5 ${
                      isCompleted ? "text-fire" : "text-muted"
                    }`}>
                      {step.label}
                    </p>
                    <p className="text-[9px] hidden sm:block sm:text-[11px] text-muted font-bengali max-w-[70px] sm:max-w-[120px] mx-auto leading-tight">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-cream py-12">
      <Container>
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="space-y-6 w-full"
        >
          <motion.div variants={fadeInUp}>
            <Link href="/my-orders" className="inline-flex items-center text-sm font-bold font-bengali text-muted hover:text-fire mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> অর্ডারসমূহে ফিরে যান
            </Link>
          </motion.div>

          <OrderTracking status={order.status} />

          <motion.div variants={fadeInUp} className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 mb-6">
              <div>
                <h1 className="text-2xl font-bold font-bengali text-charcoal flex items-center gap-3">
                  <span>অর্ডার #{order.orderNumber}</span>
                  <button
                    onClick={() => handleCopy(order.orderNumber, "orderNumber", "অর্ডার নাম্বার")}
                    className="text-muted hover:text-fire transition-colors p-1 rounded hover:bg-cream-dark/50 cursor-pointer"
                    title="অর্ডার নাম্বার কপি করুন"
                  >
                    {copiedId === "orderNumber" ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                  </button>
                  <StatusBadge status={order.status} />
                </h1>
                <p className="text-muted text-sm font-bengali mt-1">
                  অর্ডার করার তারিখ: {format(new Date(order.createdAt), "dd MMMM, yyyy - hh:mm a")}
                </p>
                {order.status === "CANCELLED" && (
                  <div className="mt-4 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <p className="text-sm text-red-600 font-semibold font-bengali">
                      অর্ডারটি বাতিল করা হয়েছে
                    </p>
                  </div>
                )}
              </div>
              <div className="sm:text-right">
                <p className="text-xs text-muted font-semibold font-bengali uppercase tracking-widest mb-1">সর্বমোট মূল্য</p>
                <p className="text-3xl font-bold text-fire">{formatPrice(order.total || 0)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <motion.div variants={fadeInUp}>
                <h3 className="font-bold font-bengali text-charcoal flex items-center gap-2 mb-4 text-lg">
                  <MapPin className="w-5 h-5 text-fire" /> ডেলিভারি ঠিকানা
                </h3>
                <div className="text-sm bg-cream/30 p-4 rounded-2xl border border-border leading-relaxed space-y-2 font-bengali">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-muted" />
                    <span className="font-semibold text-charcoal">{order.customerName || parsedAddress.fullName || 'N/A'}</span>
                    {(order.customerName || parsedAddress.fullName) && (
                      <button
                        onClick={() => handleCopy(order.customerName || parsedAddress.fullName, "fullName", "নাম")}
                        className="text-muted hover:text-fire transition-colors p-1 rounded hover:bg-cream-dark/50 ml-auto cursor-pointer"
                        title="নাম কপি করুন"
                      >
                        {copiedId === "fullName" ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-muted" />
                    <span className="font-latin text-charcoal">{order.customerPhone || parsedAddress.phone || 'N/A'}</span>
                    {(order.customerPhone || parsedAddress.phone) && (
                      <button
                        onClick={() => handleCopy(order.customerPhone || parsedAddress.phone, "phone", "ফোন নাম্বার")}
                        className="text-muted hover:text-fire transition-colors p-1 rounded hover:bg-cream-dark/50 ml-auto cursor-pointer"
                        title="ফোন নাম্বার কপি করুন"
                      >
                        {copiedId === "phone" ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                      </button>
                    )}
                  </div>
                  <div className="flex items-start gap-2 text-muted justify-between">
                    <span className="shrink-0 mt-1"><MapPin size={16} /></span>
                    <span className="flex-1 text-charcoal">
                      {parsedAddress.address || [parsedAddress.street, parsedAddress.area, parsedAddress.city].filter(Boolean).join(', ') || 'N/A'}
                    </span>
                    {(parsedAddress.address || parsedAddress.street) && (
                      <button
                        onClick={() => handleCopy(parsedAddress.address || [parsedAddress.street, parsedAddress.area, parsedAddress.city].filter(Boolean).join(', '), "address", "ঠিকানা")}
                        className="text-muted hover:text-fire transition-colors p-1 rounded hover:bg-cream-dark/50 shrink-0 cursor-pointer"
                        title="ঠিকানা কপি করুন"
                      >
                        {copiedId === "address" ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <h3 className="font-bold font-bengali text-charcoal flex items-center gap-2 mb-4 text-lg">
                  <CreditCard className="w-5 h-5 text-fire" /> পেমেন্ট বিবরণী
                </h3>
                <div className="text-sm bg-cream/30 p-4 rounded-2xl border border-border space-y-4 font-bengali">
                  <div className="flex justify-between items-center">
                    <span className="text-muted">পেমেন্ট পদ্ধতি</span>
                    <span className="font-bold text-charcoal">{order.paymentMethod === "COD" ? "ক্যাশ অন ডেলিভারি" : order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted">পেমেন্ট অবস্থা</span>
                    <span className={`font-bold px-3 py-1 rounded-full text-xs ${
                      order.paymentStatus === "PAID" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {order.paymentStatus === "PAID" ? "পরিশোধিত" : "বাকি"}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-border space-y-2 text-muted">
                    <div className="flex justify-between">
                      <span>সাবটোটাল</span>
                      <span className="font-semibold text-charcoal">{formatPrice(order.subtotal || 0)}</span>
                    </div>
                    {(order.discountAmount || order.discount || 0) > 0 && (
                      <div className="flex justify-between text-success">
                        <span>ডিসকাউন্ট</span>
                        <span className="font-semibold">-{formatPrice(order.discountAmount || order.discount || 0)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>ডেলিভারি চার্জ</span>
                      <span className="font-semibold text-charcoal">{formatPrice(order.deliveryCharge || order.deliveryFee || 60)}</span>
                    </div>
                    <div className="flex justify-between text-charcoal font-bold text-base pt-2 border-t border-border">
                      <span>সর্বমোট মূল্য</span>
                      <span className="text-fire">{formatPrice(order.total || 0)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Items List */}
          <motion.div variants={fadeInUp} className="bg-white border border-border rounded-3xl shadow-sm overflow-hidden">
            <h3 className="text-lg font-bold font-bengali text-charcoal p-6 border-b border-border bg-cream-dark/30">
              অर्डरকৃত খাবারসমূহ
            </h3>
            <div className="divide-y divide-border">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="p-6 flex items-center gap-4 hover:bg-cream-dark/10 transition-colors">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-border shrink-0 bg-cream">
                    {item.item?.imageUrl && (
                      <Image src={item.item.imageUrl} alt={item.item.name} fill sizes="80px" className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bengali font-bold text-lg text-charcoal line-clamp-1">{item.item?.name || item.itemName || "খাবার"}</h4>
                    <p className="font-bengali text-muted mt-1">{formatPrice(item.itemPrice || item.price || 0)} × {item.quantity || 1}</p>
                  </div>
                  <div className="font-bold text-lg text-fire text-right">
                    {formatPrice((item.itemPrice || item.price || 0) * (item.quantity || 1))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {order.notes && (
            <motion.div variants={fadeInUp} className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
              <p className="font-bengali text-amber-800 leading-relaxed">
                <span className="font-bold mr-2">অर्डर নোট:</span>
                {order.notes}
              </p>
            </motion.div>
          )}

          {/* Back to My Orders */}
          <motion.div variants={fadeInUp} className="text-center pt-4">
            <Link 
              href="/my-orders"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cream-dark text-charcoal rounded-xl font-bold font-bengali hover:bg-cream-dark/80 transition-all cursor-pointer border border-border shadow-sm"
            >
              <ArrowLeft size={18} />
              আমার অর্ডারে যান
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
}
