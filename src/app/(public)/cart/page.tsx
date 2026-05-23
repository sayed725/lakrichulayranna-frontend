"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight, Tag } from "lucide-react";
import { Container } from "@/components/shared/container/Container";
import { SectionTitle } from "@/components/shared/section-title/SectionTitle";
import { useCartStore } from "@/store/cart.store";
import { useCouponStore } from "@/store/coupon.store";
import { useValidateCoupon } from "@/features/cart/hooks/useValidateCoupon";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const { items, updateQty, removeItem, subtotal } = useCartStore();
  const { coupon, discount, clearCoupon } = useCouponStore();
  const validateCoupon = useValidateCoupon();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    validateCoupon.mutate({ code: couponCode.trim(), subtotal: subtotal() });
  };

  if (!mounted) return null;

  const currentSubtotal = subtotal();
  const total = currentSubtotal - discount;

  if (items.length === 0) {
    return (
      <Container className="py-20 min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-cream rounded-full flex items-center justify-center mb-6">
          <Trash2 size={40} className="text-muted-light" />
        </div>
        <h2 className="text-2xl font-bold font-bengali text-charcoal mb-2">
          আপনার কার্ট খালি!
        </h2>
        <p className="text-muted font-bengali mb-8 text-center max-w-md">
          এখনো কোনো খাবার যোগ করা হয়নি। মেনু থেকে আপনার পছন্দের খাবার বেছে নিন।
        </p>
        <Link
          href="/menu"
          className="px-8 py-4 bg-fire text-white rounded-xl font-bold font-bengali hover:bg-fire-dark transition-colors"
        >
          মেনু দেখুন
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-12 min-h-screen">
      <SectionTitle
        title="Shopping Cart"
        titleBn="আপনার কার্ট"
        align="left"
      />

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <div className="hidden sm:grid grid-cols-12 gap-4 p-4 border-b border-border bg-cream-dark/30 text-sm font-bold text-charcoal font-bengali">
              <div className="col-span-6">আইটেম</div>
              <div className="col-span-2 text-center">মূল্য</div>
              <div className="col-span-2 text-center">পরিমাণ</div>
              <div className="col-span-2 text-right">মোট</div>
            </div>

            <div className="divide-y divide-border">
              {items.map((item) => {
                const effectivePrice = item.discountPrice ?? item.price;
                return (
                  <div key={item.id} className="p-4 sm:grid sm:grid-cols-12 sm:items-center sm:gap-4 flex flex-col gap-4">
                    {/* Item info */}
                    <div className="col-span-6 flex gap-4">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-border">
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <Link href={`/menu/${item.slug}`} className="font-bold font-bengali text-charcoal hover:text-fire transition-colors line-clamp-2">
                          {item.name}
                        </Link>
                        {/* Mobile price */}
                        <div className="sm:hidden mt-1 font-semibold text-fire">
                          {formatPrice(effectivePrice)}
                        </div>
                      </div>
                    </div>

                    {/* Desktop Price */}
                    <div className="hidden sm:block col-span-2 text-center font-semibold text-charcoal">
                      {formatPrice(effectivePrice)}
                    </div>

                    {/* Qty & Mobile Total row */}
                    <div className="col-span-2 flex sm:justify-center items-center justify-between">
                      <div className="flex items-center justify-between px-2 bg-cream rounded-xl border border-border w-28 h-10">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-charcoal transition-colors cursor-pointer"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-bold text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-charcoal transition-colors cursor-pointer"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      {/* Mobile Total & Remove */}
                      <div className="sm:hidden flex items-center gap-4">
                        <span className="font-bold text-charcoal">
                          {formatPrice(effectivePrice * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-error/70 hover:text-error transition-colors p-2 cursor-pointer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Desktop Total & Remove */}
                    <div className="hidden sm:flex col-span-2 justify-end items-center gap-4">
                      <span className="font-bold text-charcoal">
                        {formatPrice(effectivePrice * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-error/70 hover:text-error transition-colors cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-border p-6 sticky top-[calc(var(--nav-height)+2rem)]">
            <h3 className="text-lg font-bold font-bengali text-charcoal mb-6 border-b border-border pb-4">
              অর্ডার সামারি
            </h3>

            {/* Coupon Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold font-bengali text-charcoal mb-2">
                কুপন কোড (যদি থাকে)
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-light" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="কোড লিখুন"
                    disabled={!!coupon}
                    className="w-full pl-9 pr-3 py-3 rounded-xl border border-border bg-cream/50 text-sm font-bengali outline-none focus:border-fire transition-all"
                  />
                </div>
                {coupon ? (
                  <button onClick={clearCoupon} className="px-4 py-3 rounded-xl bg-error/10 text-error font-semibold font-bengali cursor-pointer">
                    বাদ দিন
                  </button>
                ) : (
                  <button 
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim() || validateCoupon.isPending}
                    className="px-4 py-3 rounded-xl bg-charcoal text-cream font-semibold font-bengali disabled:opacity-50 cursor-pointer"
                  >
                    {validateCoupon.isPending ? "..." : "প্রয়োগ"}
                  </button>
                )}
              </div>
              {coupon && (
                <p className="text-success text-sm font-bengali mt-2 font-medium">
                  {coupon.code} প্রয়োগ করা হয়েছে (-{formatPrice(discount)})
                </p>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-3 font-bengali mb-6">
              <div className="flex justify-between text-muted">
                <span>সাবটোটাল</span>
                <span className="text-charcoal font-semibold">{formatPrice(currentSubtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>ডিসকাউন্ট</span>
                  <span className="font-semibold">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted">
                <span>ডেলিভারি চার্জ</span>
                <span className="text-xs mt-1">চেকআউটে হিসাব করা হবে</span>
              </div>
              
              <div className="pt-4 border-t border-border flex justify-between items-end">
                <span className="text-lg font-bold text-charcoal">মোট (আনুমানিক)</span>
                <span className="text-2xl font-bold text-fire">{formatPrice(total)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="flex items-center justify-center gap-2 w-full py-4 bg-fire text-white rounded-xl font-bengali font-bold text-lg hover:bg-fire-dark transition-all hover:shadow-lg hover:shadow-fire/25 active:scale-[0.98]"
            >
              চেকআউটে যান
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
