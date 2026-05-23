"use client";

import { X, Download, MapPin, Phone, User, FileText } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { formatPrice } from "@/lib/utils";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { OrderStatusTimeline } from "@/components/dashboard/OrderStatusTimeline";

interface OrderDetailPanelProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDetailPanel({ order, isOpen, onClose }: OrderDetailPanelProps) {
  const handleDownloadInvoice = async (url: string, orderNumber: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `Invoice-${orderNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Failed to download invoice", error);
    }
  };

  if (!isOpen || !order) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      
      <div className={`fixed inset-y-0 right-0 w-full max-w-2xl bg-cream shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-white border-b border-border">
          <div>
            <h2 className="text-xl font-bold font-bengali text-charcoal">
              অর্ডার বিস্তারিত
            </h2>
            <p className="text-sm text-muted font-mono mt-1">#{order.orderNumber}</p>
          </div>
          <div className="flex items-center gap-4">
            {order.invoicePdf && (
              <button 
                onClick={() => handleDownloadInvoice(order.invoicePdf, order.orderNumber)}
                className="flex items-center gap-2 px-4 py-2 bg-fire/10 text-fire font-semibold font-bengali rounded-lg hover:bg-fire/20 transition-colors cursor-pointer"
              >
                <Download size={18} />
                ইনভয়েস
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 hover:bg-cream-dark rounded-full transition-colors text-charcoal"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* Status Timeline */}
          <div className="bg-white p-6 rounded-2xl border border-border">
            <h3 className="font-bold font-bengali text-charcoal mb-6 border-b border-border pb-4">অর্ডারের অবস্থা</h3>
            <OrderStatusTimeline status={order.status} />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Delivery Info */}
            <div className="bg-white p-6 rounded-2xl border border-border">
              <h3 className="font-bold font-bengali text-charcoal mb-4 flex items-center gap-2 border-b border-border pb-3">
                <MapPin size={18} className="text-fire" />
                ডেলিভারি ঠিকানা
              </h3>
              <div className="space-y-3 font-bengali text-sm">
                <p className="flex items-center gap-2">
                  <User size={16} className="text-muted" />
                  <span className="font-semibold">{order.deliveryAddress.fullName}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={16} className="text-muted" />
                  <span className="font-latin">{order.deliveryAddress.phone}</span>
                </p>
                <p className="flex items-start gap-2 text-muted leading-relaxed">
                  <span className="shrink-0 mt-1"><MapPin size={16} /></span>
                  {order.deliveryAddress.address}
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white p-6 rounded-2xl border border-border">
              <h3 className="font-bold font-bengali text-charcoal mb-4 flex items-center gap-2 border-b border-border pb-3">
                <FileText size={18} className="text-fire" />
                অর্ডারের সারসংক্ষেপ
              </h3>
              <div className="space-y-2 font-bengali text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-muted">তারিখ</span>
                  <span className="font-semibold font-latin">{format(new Date(order.createdAt), "dd MMM, yyyy")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">পেমেন্ট মেথড</span>
                  <span className="font-semibold">{order.paymentMethod === "COD" ? "ক্যাশ অন ডেলিভারি" : order.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-muted">বর্তমান স্ট্যাটাস</span>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <h3 className="font-bold font-bengali text-charcoal p-6 border-b border-border bg-cream-dark/30">
              অর্ডারকৃত আইটেমসমূহ
            </h3>
            <div className="divide-y divide-border">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="p-4 flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border shrink-0">
                    <Image src={item.item.imageUrl} alt={item.item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bengali font-bold text-charcoal line-clamp-1">{item.item.name}</h4>
                    <p className="text-sm font-bengali text-muted">{formatPrice(item.price)} × {item.quantity}</p>
                  </div>
                  <div className="font-bold text-fire text-right">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Totals */}
            <div className="p-6 bg-cream-dark/30 font-bengali space-y-2">
              <div className="flex justify-between text-muted text-sm">
                <span>সাবটোটাল</span>
                <span className="font-semibold text-charcoal">{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-success text-sm">
                  <span>ডিসকাউন্ট</span>
                  <span className="font-semibold">-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted text-sm">
                <span>ডেলিভারি চার্জ</span>
                <span className="font-semibold text-charcoal">{formatPrice(order.deliveryFee || 60)}</span>
              </div>
              <div className="pt-3 mt-3 border-t border-border flex justify-between items-end">
                <span className="font-bold text-charcoal">সর্বমোট</span>
                <span className="text-xl font-bold text-fire">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {order.notes && (
            <div className="bg-warning/10 p-4 rounded-xl border border-warning/20">
              <p className="font-bengali text-sm text-warning-dark">
                <span className="font-bold mr-2">অর্ডার নোট:</span>
                {order.notes}
              </p>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
