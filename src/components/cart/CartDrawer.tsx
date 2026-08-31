"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { useUIStore } from "@/store/ui.store";
import { CartItem } from "./CartItem";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const { items, clearCart, subtotal, totalItems } = useCartStore();
  const { isCartOpen, closeCart } = useUIStore();
  const [mounted, setMounted] = useState(false);

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

  const currentSubtotal = mounted ? subtotal() : 0;
  const currentTotalItems = mounted ? totalItems() : 0;

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
                    পণ্য সমূহ দেখুন
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
                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-lg font-bold text-charcoal font-bengali pt-2">
                    <span>মোট</span>
                    <span className="text-fire">{formatPrice(currentSubtotal)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button
                    nativeButton={false}
                    variant="fire"
                    render={<Link href="/checkout" onClick={closeCart} />}
                    className="flex items-center justify-center gap-2 w-full h-12 rounded-xl font-bengali font-semibold border-0 cursor-pointer"
                  >
                    চেকআউট করুন
                    <ArrowRight size={18} />
                  </Button>
                  <Button
                    onClick={clearCart}
                    variant="ghost"
                    className="flex items-center justify-center gap-2 w-full py-2.5 text-sm text-muted hover:text-error rounded-xl hover:bg-error/5 transition-colors font-bengali cursor-pointer"
                  >
                    <Trash2 size={14} />
                    কার্ট মুছুন
                  </Button>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
