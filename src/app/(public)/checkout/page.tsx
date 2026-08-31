"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ShieldCheck, MapPin, Phone, User, FileText, CheckCircle2, Tag, Banknote } from "lucide-react";

import { Container } from "@/components/shared/container/Container";
import { FormInput } from "@/components/forms/FormInput";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { useCouponStore } from "@/store/coupon.store";
import { useValidateCoupon } from "@/features/cart/hooks/useValidateCoupon";
import { usePlaceOrder } from "@/features/order/hooks/usePlaceOrder";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/components/cart/CartItem";

const checkoutSchema = z.object({
  customerName: z.string().min(3, "কমপক্ষে ৩ অক্ষরের নাম প্রয়োজন"),
  customerPhone: z.string().regex(/^(01)[3-9][0-9]{8}$/, "সঠিক বাংলাদেশী মোবাইল নম্বর দিন"),
  customerEmail: z.string().email().optional().or(z.literal("")),
  deliveryArea: z.enum(["inside_dhaka", "outside_dhaka"], {
    message: "ডেলিভারি এলাকা নির্বাচন করুন",
  }),
  address: z.string().min(10, "বিস্তারিত ঠিকানা দিন"),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const { items, subtotal } = useCartStore();
  const { user } = useAuthStore();
  const { coupon, discount, clearCoupon } = useCouponStore();
  const placeOrder = usePlaceOrder();
  const validateCoupon = useValidateCoupon();
  const [couponCode, setCouponCode] = useState("");
  const [selectedCity, setSelectedCity] = useState("ঢাকা");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: user?.name || "",
      customerPhone: user?.phone || "",
      customerEmail: user?.email || "",
      deliveryArea: "inside_dhaka",
      address: "",
      notes: "",
    },
  });

  const deliveryAreaValue = watch("deliveryArea");

  useEffect(() => {
    setMounted(true);
    if (useCartStore.persist.hasHydrated()) {
      setHydrated(true);
    }
    const unsub = useCartStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (hydrated && items.length === 0) {
      router.push("/cart");
    }
  }, [hydrated, items.length, router]);

  // Update delivery charge when delivery area changes
  useEffect(() => {
    if (deliveryAreaValue) {
      setSelectedCity(deliveryAreaValue === "inside_dhaka" ? "dhaka" : "other");
    }
  }, [deliveryAreaValue]);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    validateCoupon.mutate({ code: couponCode.trim(), subtotal: subtotal() });
  };

  if (!mounted || !hydrated || items.length === 0) return null;

  const currentSubtotal = subtotal();

  // Calculate delivery charge based on delivery area
  const calculateDeliveryCharge = (deliveryArea: string, items: typeof cartItems) => {
    let totalWeight = 0;

    for (const item of items) {
      const weightValue = item.weight ? parseInt(item.weight.replace(/\D/g, '')) || 0 : 0;
      totalWeight += weightValue * item.quantity;
    }

    const isInsideDhaka = deliveryArea === "dhaka";
    let calculatedDeliveryCharge = isInsideDhaka ? 100 : 150;

    if (totalWeight > 1000) {
      const extraWeight = Math.min(totalWeight - 1000, 4000);
      const extraCharge = Math.ceil(extraWeight / 1000) * 10;
      calculatedDeliveryCharge += extraCharge;
    }

    return calculatedDeliveryCharge;
  };

  const cartItems = items;
  const deliveryFee = calculateDeliveryCharge(selectedCity, cartItems);
  const total = currentSubtotal - discount + deliveryFee;

  const onSubmit = (data: CheckoutFormValues) => {
    const orderData: any = {
      items: items.map(item => ({
        itemId: item.id,
        quantity: item.quantity
      })),
      couponCode: coupon?.code,
      paymentMethod: "COD",
      deliveryAddress: {
        area: data.deliveryArea === "inside_dhaka" ? "Dhaka" : "Outside Dhaka",
        city: data.deliveryArea === "inside_dhaka" ? "dhaka" : "other",
        street: data.address,
        country: "Bangladesh",
      },
      isInsideDhaka: data.deliveryArea === "inside_dhaka",
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || undefined,
      deliveryCharge: deliveryFee,
      notes: data.notes,
    };

    // userId will be extracted from JWT token by backend
    placeOrder.mutate(orderData);
  };

  return (
    <Container className="py-12 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <ShieldCheck size={32} className="text-success" />
        <h1 className="text-3xl font-bold font-bengali text-charcoal">
          নিরাপদ চেকআউট
        </h1>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 flex-col-reverse lg:flex-row">
        {/* Left: Form */}
        <div className="lg:col-span-7 space-y-8">
          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border">
              <h2 className="text-xl font-bold font-bengali text-charcoal mb-6 border-b border-border pb-4">
                ডেলিভারি তথ্য
              </h2>

              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="relative">
                    <User size={18} className="absolute right-4 top-10 text-muted-light" />
                    <FormInput
                      label="সম্পূর্ণ নাম *"
                      placeholder="আপনার নাম লিখুন"
                      {...register("customerName")}
                      error={errors.customerName?.message}
                    />
                  </div>
                  <div className="relative">
                    <Phone size={18} className="absolute right-4 top-10 text-muted-light" />
                    <FormInput
                      label="মোবাইল নম্বর *"
                      placeholder="01XXXXXXXXX"
                      {...register("customerPhone")}
                      error={errors.customerPhone?.message}
                    />
                  </div>
                </div>

                <div className="relative">
                  <FormInput
                    label="ইমেইল (ঐচ্ছিক)"
                    placeholder="আপনার ইমেইল লিখুন"
                    {...register("customerEmail")}
                    error={errors.customerEmail?.message}
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold text-charcoal mb-2 font-bengali">
                    ডেলিভারি এলাকা *
                  </label>
                  <select
                    {...register("deliveryArea")}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-cream/50 text-sm font-bengali focus:border-fire focus:ring-1 focus:ring-fire/20 outline-none transition-all cursor-pointer"
                  >
                    <option value="inside_dhaka">ঢাকার ভিতরে (১০০ টাকা)</option>
                    <option value="outside_dhaka">ঢাকার বাহিরে (১৫০ টাকা)</option>
                  </select>
                  {errors.deliveryArea && (
                    <p className="text-error text-xs mt-1 font-bengali">{errors.deliveryArea.message}</p>
                  )}
                </div>

                <div className="relative">
                  <MapPin size={18} className="absolute right-4 top-10 text-muted-light" />
                  <FormTextarea
                    label="বিস্তারিত ঠিকানা *"
                    placeholder="বাসা নং, রাস্তা, এলাকা..."
                    {...register("address")}
                    error={errors.address?.message}
                  />
                </div>

                <div className="relative">
                  <FileText size={18} className="absolute right-4 top-10 text-muted-light" />
                  <FormTextarea
                    label="অর্ডার নোট (ঐচ্ছিক)"
                    placeholder="অর্ডার সম্পর্কিত কোনো বিশেষ নির্দেশ থাকলে লিখুন..."
                    {...register("notes")}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border">
              <h2 className="text-xl font-bold font-bengali text-charcoal mb-6 border-b border-border pb-4">
                পেমেন্ট পদ্ধতি
              </h2>
              
              <label className="flex items-center justify-between p-4 rounded-xl border-2 border-fire bg-fire/5 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full border-4 border-fire bg-white" />
                  <span className="font-bold font-bengali text-charcoal">ক্যাশ অন ডেলিভারি (COD)</span>
                </div>
                <Banknote size={24} className="text-fire/70" />
              </label>
            </div>
          </form>
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white text-charcoal p-6 sm:p-8 rounded-2xl border border-border sticky top-[calc(var(--nav-height)+2rem)]">
            <h2 className="text-xl font-bold font-bengali mb-6 border-b border-border pb-4">
              অর্ডারের সারসংক্ষেপ
            </h2>

            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* Coupon Section */}
            <div className="mb-6 border-t border-border pt-6">
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
                  <Button
                    type="button"
                    onClick={clearCoupon}
                    variant="outline"
                    className="rounded-xl border-red-200 text-error hover:bg-red-50 hover:text-error font-bold font-bengali h-12 px-6"
                  >
                    বাদ দিন
                  </Button>
                ) : (
                  <Button 
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim() || validateCoupon.isPending}
                    className="rounded-xl bg-fire text-white font-bold font-bengali h-12 px-6 hover:bg-fire-dark transition-all"
                  >
                    {validateCoupon.isPending ? "..." : "প্রয়োগ"}
                  </Button>
                )}
              </div>
              {coupon && (
                <p className="text-success text-sm font-bengali mt-2 font-medium">
                  {coupon.code} প্রয়োগ করা হয়েছে (-{formatPrice(discount)})
                </p>
              )}
            </div>

            <div className="space-y-3 font-bengali pt-4 border-t border-border mb-6">
              <div className="flex justify-between text-muted">
                <span>সাবটোটাল</span>
                <span className="font-semibold text-charcoal">{formatPrice(currentSubtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>ডিসকাউন্ট ({coupon?.code})</span>
                  <span className="font-semibold">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted">
                <span>ডেলিভারি চার্জ</span>
                <span className="font-semibold text-charcoal">{formatPrice(deliveryFee)}</span>
              </div>

              <div className="pt-4 border-t border-border flex justify-between items-end">
                <span className="text-lg font-bold text-charcoal">সর্বমোট</span>
                <span className="text-3xl font-bold text-fire">{formatPrice(total)}</span>
              </div>
            </div>

            <Button
              type="submit"
              form="checkout-form"
              disabled={placeOrder.isPending}
              className="flex items-center justify-center gap-2 w-full py-6 bg-fire text-white rounded-xl font-bengali font-bold text-lg hover:bg-fire-dark transition-all hover:shadow-lg hover:shadow-fire/25 active:scale-[0.98] disabled:opacity-50"
            >
              {placeOrder.isPending ? "প্রসেস হচ্ছে..." : (
                <>
                  <CheckCircle2 size={20} />
                  অর্ডার কনফার্ম করুন
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
