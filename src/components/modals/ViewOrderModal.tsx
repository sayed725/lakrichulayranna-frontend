"use client";

import { format } from "date-fns";
import { Download, MapPin, Phone, User, FileText, X } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { OrderStatusTimeline } from "@/components/dashboard/OrderStatusTimeline";
import { generateInvoicePDF } from "@/lib/generateInvoicePDF";

interface ViewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

export function ViewOrderModal({ isOpen, onClose, order }: ViewOrderModalProps) {
  if (!isOpen || !order) return null;

  const parsedAddress = typeof order.deliveryAddress === 'string' 
    ? JSON.parse(order.deliveryAddress) 
    : order.deliveryAddress || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold font-bengali text-charcoal">অর্ডার বিস্তারিত</h2>
            <p className="text-muted font-mono text-sm">#{order.orderNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-cream-dark rounded-full transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status Timeline */}
          <div className="bg-cream-dark/30 p-6 rounded-2xl">
            <h3 className="text-lg font-bold font-bengali text-charcoal mb-4">অর্ডারের অবস্থা</h3>
            <OrderStatusTimeline status={order.status} />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Delivery Info */}
            <div className="bg-cream-dark/30 p-6 rounded-2xl">
              <h3 className="font-bold font-bengali text-charcoal mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-fire" />
                ডেলিভারি ঠিকানা
              </h3>
              <div className="space-y-3 font-bengali text-sm">
                <p className="flex items-center gap-2">
                  <User size={16} className="text-muted" />
                  <span className="font-semibold text-charcoal">
                    {order.customerName || parsedAddress.fullName || order.user?.name || 'N/A'}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={16} className="text-muted" />
                  <span className="font-latin text-charcoal">
                    {order.customerPhone || parsedAddress.phone || order.user?.phone || 'N/A'}
                  </span>
                </p>
                <p className="flex items-start gap-2 text-muted leading-relaxed">
                  <span className="shrink-0 mt-1"><MapPin size={16} /></span>
                  {parsedAddress.address || [parsedAddress.street, parsedAddress.area, parsedAddress.city].filter(Boolean).join(', ') || 'N/A'}
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-cream-dark/30 p-6 rounded-2xl">
              <h3 className="font-bold font-bengali text-charcoal mb-4 flex items-center gap-2">
                <FileText size={18} className="text-fire" />
                অর্ডারের সারসংক্ষেপ
              </h3>
              <div className="space-y-3 font-bengali text-sm mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted">তারিখ</span>
                  <span className="font-semibold font-latin text-charcoal">{format(new Date(order.createdAt), "dd MMM, yyyy")}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">পেমেন্ট মেথড</span>
                  <span className="font-semibold text-charcoal">{order.paymentMethod === "COD" ? "ক্যাশ অন ডেলিভারি" : order.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-muted">বর্তমান স্ট্যাটাস</span>
                  <StatusBadge status={order.status} />
                </div>
              </div>

              <button
                onClick={async () => await generateInvoicePDF(order)}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-fire/10 text-fire font-bold font-bengali rounded-xl hover:bg-fire hover:text-white transition-all cursor-pointer"
              >
                <Download size={18} />
                ইনভয়েস ডাউনলোড
              </button>
            </div>
          </div>

          {/* Items List */}
          <div className="bg-cream-dark/30 rounded-2xl overflow-hidden">
            <h3 className="text-lg font-bold font-bengali text-charcoal p-6 border-b border-border">
              অর্ডারকৃত আইটেমসমূহ
            </h3>
            <div className="divide-y divide-border">
              {order.items?.map((item: any, index: number) => (
                <div key={index} className="p-6 flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-border shrink-0 bg-cream">
                    {item.item?.imageUrl && (
                      <Image src={item.item.imageUrl} alt={item.item.name} fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bengali font-bold text-lg text-charcoal line-clamp-1">{item.item?.name || item.itemName || "Unknown Item"}</h4>
                    <p className="font-bengali text-muted mt-1">{formatPrice(item.itemPrice || item.price || 0)} × {item.quantity || 1}</p>
                  </div>
                  <div className="font-bold text-lg text-fire text-right">
                    {formatPrice((item.itemPrice || item.price || 0) * (item.quantity || 1))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Totals */}
            <div className="p-6 sm:p-8 bg-cream-dark/50 font-bengali space-y-3 border-t border-border">
              <div className="flex justify-between text-muted">
                <span>সাবটোটাল</span>
                <span className="font-semibold text-charcoal">{formatPrice(order.subtotal || 0)}</span>
              </div>
              {(order.discountAmount || order.discount || 0) > 0 && (
                <div className="flex justify-between text-success">
                  <span>ডিসকাউন্ট</span>
                  <span className="font-semibold">-{formatPrice(order.discountAmount || order.discount || 0)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted">
                <span>ডেলিভারি চার্জ</span>
                <span className="font-semibold text-charcoal">{formatPrice(order.deliveryCharge || order.deliveryFee || 60)}</span>
              </div>
              <div className="pt-4 mt-4 border-t border-border flex justify-between items-end">
                <span className="text-lg font-bold text-charcoal">সর্বমোট</span>
                <span className="text-2xl font-bold text-fire">{formatPrice(order.total || 0)}</span>
              </div>
            </div>
          </div>

          {order.notes && (
            <div className="bg-warning/10 p-6 rounded-2xl border border-warning/20">
              <p className="font-bengali text-warning-dark leading-relaxed">
                <span className="font-bold mr-2">অর্ডার নোট:</span>
                {order.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
