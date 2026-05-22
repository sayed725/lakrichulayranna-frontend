import { create } from "zustand";

export interface Coupon {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderAmount?: number;
}

interface CouponState {
  coupon: Coupon | null;
  discount: number;
  setCoupon: (coupon: Coupon, subtotal: number) => void;
  clearCoupon: () => void;
  calculateDiscount: (subtotal: number) => number;
}

export const useCouponStore = create<CouponState>()((set, get) => ({
  coupon: null,
  discount: 0,

  setCoupon: (coupon, subtotal) => {
    let discount = 0;

    if (coupon.discountType === "PERCENTAGE") {
      discount = (subtotal * coupon.discountValue) / 100;
    } else {
      discount = coupon.discountValue;
    }

    // Discount can't exceed subtotal
    discount = Math.min(discount, subtotal);

    set({ coupon, discount });
  },

  clearCoupon: () => {
    set({ coupon: null, discount: 0 });
  },

  calculateDiscount: (subtotal) => {
    const { coupon } = get();
    if (!coupon) return 0;

    let discount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discount = (subtotal * coupon.discountValue) / 100;
    } else {
      discount = coupon.discountValue;
    }
    return Math.min(discount, subtotal);
  },
}));
