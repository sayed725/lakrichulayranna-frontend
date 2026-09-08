"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Download, MapPin, Phone, User, FileText, ShoppingBag, CreditCard, Calendar, Clock, Tag, Copy, Check } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { OrderStatusTimeline } from "@/components/dashboard/OrderStatusTimeline";
import { generateInvoicePDF } from "@/lib/generateInvoicePDF";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ViewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

export function ViewOrderModal({ isOpen, onClose, order }: ViewOrderModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!order) return null;

  const parsedAddress = typeof order.deliveryAddress === 'string' 
    ? (() => {
        try { return JSON.parse(order.deliveryAddress); } catch { return {}; }
      })()
    : order.deliveryAddress || {};

  const customerName = order.customerName || parsedAddress.fullName || order.user?.name || 'N/A';
  const customerPhone = order.customerPhone || parsedAddress.phone || order.user?.phone || 'N/A';
  const fullAddress = parsedAddress.address || [parsedAddress.street, parsedAddress.area, parsedAddress.city].filter(Boolean).join(', ') || 'N/A';

  const handleCopy = (text: string, key: string, label: string) => {
    if (!text || text === 'N/A') return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(`${label} copied!`, {
      description: `${text} copied to clipboard`,
    });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-4xl max-w-[95vw] w-full max-h-[90vh] flex flex-col p-0 overflow-hidden sm:rounded-3xl border-border shadow-2xl">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-6 border-b border-border/60 bg-muted/10 pr-12 sm:pr-14">
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-lg sm:text-xl font-bold font-bengali text-charcoal flex items-center gap-2 truncate">
                <ShoppingBag className="w-5 h-5 text-fire shrink-0" />
                <span>অর্ডার বিস্তারিত</span>
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1 group/orderno">
                <DialogDescription className="text-muted-foreground font-mono text-xs sm:text-sm truncate">
                  Order #{order.orderNumber}
                </DialogDescription>
                <button
                  onClick={() => handleCopy(order.orderNumber, 'orderNumber', 'Order number')}
                  className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 opacity-100 lg:opacity-0 lg:group-hover/orderno:opacity-100 focus:opacity-100 cursor-pointer shrink-0"
                  title="Copy order number"
                >
                  {copiedKey === 'orderNumber' ? (
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
            <div className="shrink-0">
              <StatusBadge status={order.status} />
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Status Timeline */}
          <div className="bg-gradient-to-br from-cream/60 to-cream-dark/40 dark:from-charcoal-light/30 dark:to-charcoal-light/10 p-4 sm:p-6 rounded-2xl border border-border/50 shadow-xs">
            <h3 className="text-sm sm:text-base font-bold font-bengali text-charcoal mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-fire shrink-0" />
              অর্ডারের বর্তমান অবস্থা ও গতিপথ
            </h3>
            <OrderStatusTimeline status={order.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Delivery Info */}
            <div className="bg-card p-4 sm:p-6 rounded-2xl border border-border/70 shadow-xs space-y-4">
              <h3 className="font-bold font-bengali text-charcoal flex items-center gap-2 border-b border-border/40 pb-3">
                <MapPin size={18} className="text-fire shrink-0" />
                ডেলিভারি ঠিকানা
              </h3>
              <div className="space-y-3 font-bengali text-sm">
                <div className="flex items-center gap-1 group/name min-h-[28px]">
                  <User size={16} className="text-muted-foreground shrink-0 mr-1.5" />
                  <span className="font-semibold text-charcoal break-all">{customerName}</span>
                  {customerName !== 'N/A' && (
                    <button
                      onClick={() => handleCopy(customerName, 'name', 'Customer name')}
                      className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 opacity-100 lg:opacity-0 lg:group-hover/name:opacity-100 focus:opacity-100 cursor-pointer shrink-0"
                      title="Copy customer name"
                    >
                      {copiedKey === 'name' ? (
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1 group/phone min-h-[28px]">
                  <Phone size={16} className="text-muted-foreground shrink-0 mr-1.5" />
                  <span className="font-latin text-charcoal font-medium break-all">{customerPhone}</span>
                  {customerPhone !== 'N/A' && (
                    <button
                      onClick={() => handleCopy(customerPhone, 'phone', 'Customer phone')}
                      className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 opacity-100 lg:opacity-0 lg:group-hover/phone:opacity-100 focus:opacity-100 cursor-pointer shrink-0"
                      title="Copy customer phone"
                    >
                      {copiedKey === 'phone' ? (
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>

                <div className="flex items-start gap-1 group/address min-h-[28px] text-muted-foreground leading-relaxed">
                  <MapPin size={16} className="shrink-0 mt-0.5 mr-1.5" />
                  <span className="break-words flex-1">{fullAddress}</span>
                  {fullAddress !== 'N/A' && (
                    <button
                      onClick={() => handleCopy(fullAddress, 'address', 'Delivery address')}
                      className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 opacity-100 lg:opacity-0 lg:group-hover/address:opacity-100 focus:opacity-100 cursor-pointer shrink-0 mt-0.5"
                      title="Copy delivery address"
                    >
                      {copiedKey === 'address' ? (
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-card p-4 sm:p-6 rounded-2xl border border-border/70 shadow-xs flex flex-col justify-between gap-4">
              <div>
                <h3 className="font-bold font-bengali text-charcoal flex items-center gap-2 border-b border-border/40 pb-3 mb-4">
                  <FileText size={18} className="text-fire shrink-0" />
                  অর্ডারের সারসংক্ষেপ
                </h3>
                <div className="space-y-3 font-bengali text-sm">
                  <div className="flex justify-between items-center text-muted-foreground gap-2">
                    <span className="flex items-center gap-1.5 shrink-0"><Calendar size={14} /> তারিখ</span>
                    <span className="font-semibold font-latin text-charcoal truncate">{format(new Date(order.createdAt), "dd MMM, yyyy")}</span>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground gap-2">
                    <span className="flex items-center gap-1.5 shrink-0"><CreditCard size={14} /> পেমেন্ট মেথড</span>
                    <span className="font-semibold text-charcoal truncate">{order.paymentMethod === "COD" ? "ক্যাশ অন ডেলিভারি" : order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground gap-2">
                    <span className="flex items-center gap-1.5 shrink-0"><Tag size={14} /> অর্ডার টাইপ</span>
                    <span className="font-semibold text-charcoal truncate">{order.isManual ? "ম্যানুয়াল" : "অনলাইন"}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={async () => await generateInvoicePDF(order)}
                variant="outline"
                className="w-full h-11 border-fire/30 text-fire hover:bg-fire hover:text-white font-bold font-bengali rounded-xl transition-all gap-2 cursor-pointer"
              >
                <Download size={18} />
                ইনভয়েস ডাউনলোড (PDF)
              </Button>
            </div>
          </div>

          {/* Items List */}
          <div className="bg-card rounded-2xl border border-border/70 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-border/60 bg-muted/10 flex items-center justify-between gap-2">
              <h3 className="text-sm sm:text-base font-bold font-bengali text-charcoal flex items-center gap-2 truncate">
                <ShoppingBag size={18} className="text-fire shrink-0" />
                <span>অর্ডারকৃত আইটেমসমূহ</span>
              </h3>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-fire/10 text-fire font-latin shrink-0">
                {order.items?.length || 0} items
              </span>
            </div>
            
            <div className="divide-y divide-border/50">
              {order.items?.map((item: any, index: number) => {
                const itemImg = item.item?.imageUrl || item.itemImageUrl || item.imageUrl || item.image || item.item?.image;
                const itemName = item.item?.name || item.itemName || "Unknown Item";
                const unitPrice = item.itemPrice || item.price || 0;
                const quantity = item.quantity || 1;

                return (
                  <div key={index} className="p-4 sm:p-5 flex items-center gap-3 sm:gap-4 hover:bg-muted/10 transition-colors">
                    <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-border/60 shrink-0 bg-muted/30">
                      {itemImg ? (
                        <Image
                          src={itemImg}
                          alt={itemName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs font-bengali">
                          ছবি নেই
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bengali font-bold text-sm sm:text-base text-charcoal truncate">{itemName}</h4>
                      <p className="font-bengali text-xs sm:text-sm text-muted-foreground mt-1">
                        {formatPrice(unitPrice)} × {quantity}
                      </p>
                    </div>
                    <div className="font-bold text-sm sm:text-lg text-fire text-right font-latin shrink-0">
                      {formatPrice(unitPrice * quantity)}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Totals */}
            <div className="p-4 sm:p-6 bg-muted/10 font-bengali space-y-2.5 border-t border-border/60">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>সাবটোটাল</span>
                <span className="font-semibold text-charcoal">{formatPrice(order.subtotal || 0)}</span>
              </div>
              {(order.discountAmount || order.discount || 0) > 0 && (
                <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
                  <span>ডিসকাউন্ট</span>
                  <span className="font-semibold">-{formatPrice(order.discountAmount || order.discount || 0)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>ডেলিভারি চার্জ</span>
                <span className="font-semibold text-charcoal">{formatPrice(order.deliveryCharge || order.deliveryFee || 60)}</span>
              </div>
              <div className="pt-3 mt-2 border-t border-border/60 flex justify-between items-end">
                <span className="text-base font-bold text-charcoal">সর্বমোট</span>
                <span className="text-xl sm:text-2xl font-bold text-fire font-latin">{formatPrice(order.total || 0)}</span>
              </div>
            </div>
          </div>

          {order.notes && (
            <div className="bg-amber-500/10 p-4 sm:p-5 rounded-2xl border border-amber-500/20">
              <p className="font-bengali text-amber-800 dark:text-amber-300 text-sm leading-relaxed break-words">
                <span className="font-bold mr-2">অর্ডার নোট:</span>
                {order.notes}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
