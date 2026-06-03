"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Tag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { useUIStore } from "@/store/ui.store";
import { useCouponStore } from "@/store/coupon.store";
import { CartItem } from "./CartItem";
import { formatPrice } from "@/lib/utils";
import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";
import { toast } from "sonner";

export function CartDrawer() {
  const { items, clearCart, subtotal, totalItems } = useCartStore();
  const { isCartOpen, closeCart } = useUIStore();
  const { coupon, discount, setCoupon, clearCoupon } = useCouponStore();
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const res = await api.post(API_ROUTES.COUPONS.VALIDATE, {
        code: couponCode.trim(),
        subtotal: subtotal(),
      });
      setCoupon(res.data.data, subtotal());
      toast.success("কুপন প্রয়োগ হয়েছে!");
      setCouponCode("");
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "কুপন সঠিক নয়");
    } finally {
      setCouponLoading(false);
    }
  };

  const currentSubtotal = mounted ? subtotal() : 0;
  const currentTotalItems = mounted ? totalItems() : 0;
  const total = currentSubtotal - discount;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
            }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-[var(--drawer-width)] bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-fire/10 flex items-center justify-center">
                  <ShoppingBag size={18} className="text-fire" />
                </div>
                <div>
                  <h2 className="font-bold font-bengali text-charcoal text-lg">
                    কার্ট
                  </h2>
                  <p className="text-xs text-muted">
                    {currentTotalItems} টি আইটেম
                  </p>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-xl hover:bg-charcoal/5 transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X size={20} className="text-charcoal" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 rounded-full bg-cream flex items-center justify-center mb-4">
                    <ShoppingBag size={32} className="text-muted-light" />
                  </div>
                  <h3 className="font-semibold font-bengali text-charcoal mb-1">
                    কার্ট খালি
                  </h3>
                  <p className="text-sm text-muted font-bengali mb-6">
                    সুস্বাদু খাবার যোগ করুন!
                  </p>
                  <button
                    onClick={closeCart}
                    className="px-6 py-2.5 bg-fire text-white rounded-xl font-bengali text-sm font-semibold hover:bg-fire-dark transition-colors cursor-pointer"
                  >
                    মেনু দেখুন
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Section (only when items exist) */}
            {items.length > 0 && (
              <div className="border-t border-border p-5 space-y-4">
                {/* Coupon Field */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-light"
                    />
                    <input
                      ref={inputRef}
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="কুপন কোড"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-cream/50 text-sm font-bengali placeholder:text-muted-light focus:border-fire focus:ring-1 focus:ring-fire/20 outline-none transition-all"
                      disabled={!!coupon}
                    />
                  </div>
                  {coupon ? (
                    <button
                      onClick={clearCoupon}
                      className="px-4 py-2.5 rounded-xl border border-error/20 text-error text-sm font-semibold hover:bg-error/5 transition-colors cursor-pointer"
                    >
                      বাদ দিন
                    </button>
                  ) : (
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      className="px-4 py-2.5 rounded-xl bg-fire text-white text-sm font-semibold hover:bg-fire-dark transition-all hover:shadow-lg hover:shadow-fire/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100 cursor-pointer"
                    >
                      {couponLoading ? "..." : "প্রয়োগ"}
                    </button>
                  )}
                </div>

                {/* Applied coupon badge */}
                {coupon && (
                  <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-success/10 text-success text-sm">
                    <span className="font-bengali">
                      <strong>{coupon.code}</strong> কুপন প্রয়োগ হয়েছে
                    </span>
                    <span className="font-semibold">-{formatPrice(discount)}</span>
                  </div>
                )}

                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted font-bengali">
                    <span>সাবটোটাল</span>
                    <span>{formatPrice(currentSubtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-success font-bengali">
                      <span>ডিসকাউন্ট</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold text-charcoal font-bengali pt-2 border-t border-border">
                    <span>মোট</span>
                    <span className="text-fire">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-fire text-white rounded-xl font-bengali font-semibold hover:bg-fire-dark transition-all hover:shadow-lg hover:shadow-fire/25 active:scale-[0.98]"
                  >
                    চেকআউট করুন
                    <ArrowRight size={18} />
                  </Link>
                  <button
                    onClick={clearCart}
                    className="flex items-center justify-center gap-2 w-full py-2.5 text-sm text-muted hover:text-error rounded-xl hover:bg-error/5 transition-colors font-bengali cursor-pointer"
                  >
                    <Trash2 size={14} />
                    কার্ট মুছুন
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
