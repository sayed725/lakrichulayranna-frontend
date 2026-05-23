"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ShieldCheck, MapPin, Phone, User, FileText, CheckCircle2 } from "lucide-react";

import { Container } from "@/components/shared/container/Container";
import { FormInput } from "@/components/forms/FormInput";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { useCouponStore } from "@/store/coupon.store";
import { usePlaceOrder } from "@/features/order/hooks/usePlaceOrder";
import { formatPrice } from "@/lib/utils";

const checkoutSchema = z.object({
  fullName: z.string().min(3, "কমপক্ষে ৩ অক্ষরের নাম প্রয়োজন"),
  phone: z.string().regex(/^(01)[3-9][0-9]{8}$/, "সঠিক বাংলাদেশী মোবাইল নম্বর দিন"),
  address: z.string().min(10, "বিস্তারিত ঠিকানা দিন"),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { items, subtotal } = useCartStore();
  const { user } = useAuthStore();
  const { coupon, discount } = useCouponStore();
  const placeOrder = usePlaceOrder();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
    },
  });

  useEffect(() => {
    setMounted(true);
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items.length, router]);

  if (!mounted || items.length === 0) return null;

  const currentSubtotal = subtotal();
  const deliveryFee = 60; // Fixed for now, could be dynamic
  const total = currentSubtotal - discount + deliveryFee;

  const onSubmit = (data: CheckoutFormValues) => {
    const orderData = {
      items: items.map(item => ({
        itemId: item.id,
        quantity: item.quantity
      })),
      couponCode: coupon?.code,
      deliveryAddress: {
        fullName: data.fullName,
        phone: data.phone,
        address: data.address,
      },
      notes: data.notes,
      paymentMethod: "COD", // Hardcoded for now per requirements
    };
    
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
                      {...register("fullName")}
                      error={errors.fullName?.message}
                    />
                  </div>
                  <div className="relative">
                    <Phone size={18} className="absolute right-4 top-10 text-muted-light" />
                    <FormInput
                      label="মোবাইল নম্বর *"
                      placeholder="01XXXXXXXXX"
                      {...register("phone")}
                      error={errors.phone?.message}
                    />
                  </div>
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
                <Image src="/cod-icon.png" alt="COD" width={40} height={40} className="opacity-50" onError={(e) => e.currentTarget.style.display = 'none'} />
              </label>
            </div>
          </form>
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-5">
          <div className="bg-charcoal text-cream p-6 sm:p-8 rounded-2xl sticky top-[calc(var(--nav-height)+2rem)]">
            <h2 className="text-xl font-bold font-bengali mb-6 border-b border-white/10 pb-4">
              অর্ডারের সারসংক্ষেপ
            </h2>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-white/10">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-fire text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bengali font-semibold text-sm line-clamp-2">
                      {item.name}
                    </h4>
                    <p className="text-fire-light font-bold mt-1">
                      {formatPrice((item.discountPrice ?? item.price) * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 font-bengali pt-4 border-t border-white/10 mb-6">
              <div className="flex justify-between text-cream/70">
                <span>সাবটোটাল</span>
                <span className="font-semibold text-cream">{formatPrice(currentSubtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>ডিসকাউন্ট ({coupon?.code})</span>
                  <span className="font-semibold">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-cream/70">
                <span>ডেলিভারি চার্জ</span>
                <span className="font-semibold text-cream">{formatPrice(deliveryFee)}</span>
              </div>
              
              <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                <span className="text-lg font-bold">সর্বমোট</span>
                <span className="text-3xl font-bold text-fire">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={placeOrder.isPending}
              className="flex items-center justify-center gap-2 w-full py-4 bg-fire text-white rounded-xl font-bengali font-bold text-lg hover:bg-fire-dark transition-all hover:shadow-lg hover:shadow-fire/25 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {placeOrder.isPending ? "প্রসেস হচ্ছে..." : (
                <>
                  <CheckCircle2 size={20} />
                  অর্ডার কনফার্ম করুন
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
}
