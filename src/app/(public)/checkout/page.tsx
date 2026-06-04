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
  const { items, subtotal } = useCartStore();
  const { user } = useAuthStore();
  const { coupon, discount } = useCouponStore();
  const placeOrder = usePlaceOrder();
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
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items.length, router]);

  // Update delivery charge when delivery area changes
  useEffect(() => {
    if (deliveryAreaValue) {
      setSelectedCity(deliveryAreaValue === "inside_dhaka" ? "dhaka" : "other");
    }
  }, [deliveryAreaValue]);

  if (!mounted || items.length === 0) return null;

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
                <Image src="/cod-icon.png" alt="COD" width={40} height={40} className="opacity-50" onError={(e) => e.currentTarget.style.display = 'none'} />
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
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-cream">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-fire text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bengali font-semibold text-sm line-clamp-2 text-charcoal">
                      {item.name}
                    </h4>
                    <p className="text-fire font-bold mt-1">
                      {formatPrice((item.discountPrice ?? item.price) * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
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
