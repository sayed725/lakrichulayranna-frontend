"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAdminItems } from "@/features/item/hooks/useAdminItems";
import { useAdminCoupons } from "@/features/coupon/hooks/useAdminCoupons";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

const createOrderSchema = z.object({
  customerName: z.string().min(1, "নাম আবশ্যক"),
  customerPhone: z.string().min(11, "ফোন নম্বর আবশ্যক"),
  customerEmail: z.string().email().optional().or(z.literal("")),
  deliveryArea: z.enum(["inside_dhaka", "outside_dhaka"]),
  address: z.string().min(1, "ঠিকানা আবশ্যক"),
  paymentMethod: z.enum(["COD", "ONLINE"]),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});

type CreateOrderFormData = z.infer<typeof createOrderSchema>;

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export function CreateOrderModal({ isOpen, onClose, onSubmit, isSubmitting }: CreateOrderModalProps) {
  const { data: itemsResponse } = useAdminItems();
  const { data: coupons } = useAdminCoupons();
  const items = itemsResponse?.data || [];
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState("ঢাকা");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<CreateOrderFormData>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      deliveryArea: "inside_dhaka",
      paymentMethod: "COD",
    },
  });

  const deliveryAreaValue = watch("deliveryArea");

  useEffect(() => {
    if (deliveryAreaValue) {
      setSelectedCity(deliveryAreaValue === "inside_dhaka" ? "dhaka" : "other");
    }
  }, [deliveryAreaValue]);

  const handleAddItem = (item: any) => {
    const existingItem = selectedItems.find((i) => i.id === item.id);
    if (existingItem) {
      setSelectedItems(selectedItems.map((i) => 
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter((i) => i.id !== itemId));
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    setSelectedItems(selectedItems.map((i) => 
      i.id === itemId ? { ...i, quantity } : i
    ));
  };

  const calculateDeliveryCharge = (deliveryArea: string, items: any[]) => {
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

  const subtotal = selectedItems.reduce((sum, item) => {
    const price = item.discountPrice ?? item.price;
    return sum + price * item.quantity;
  }, 0);

  const deliveryCharge = calculateDeliveryCharge(selectedCity, selectedItems);
  const total = subtotal + deliveryCharge;

  const onFormSubmit = (data: CreateOrderFormData) => {
    if (selectedItems.length === 0) {
      alert("অন্তত একটি আইটেম নির্বাচন করুন");
      return;
    }

    const orderData = {
      items: selectedItems.map((item) => ({
        itemId: item.id,
        quantity: item.quantity,
      })),
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || undefined,
      paymentMethod: data.paymentMethod,
      deliveryAddress: {
        area: data.deliveryArea === "inside_dhaka" ? "Dhaka" : "Outside Dhaka",
        city: data.deliveryArea === "inside_dhaka" ? "dhaka" : "other",
        street: data.address,
        country: "Bangladesh",
      },
      isInsideDhaka: data.deliveryArea === "inside_dhaka",
      deliveryCharge,
      couponCode: data.couponCode || undefined,
      notes: data.notes || undefined,
    };

    onSubmit(orderData);
    reset();
    setSelectedItems([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold font-bengali text-charcoal">ম্যানুয়াল অর্ডার তৈরি করুন</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-cream-dark rounded-full transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left: Form */}
              <div className="space-y-6">
                <div className="bg-cream-dark/30 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold font-bengali text-charcoal mb-4">গ্রাহক তথ্য</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2 font-bengali">
                        নাম *
                      </label>
                      <input
                        {...register("customerName")}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm focus:border-fire focus:ring-1 focus:ring-fire/20 outline-none transition-all"
                        placeholder="গ্রাহকের নাম"
                      />
                      {errors.customerName && (
                        <p className="text-error text-xs mt-1">{errors.customerName.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2 font-bengali">
                        ফোন নম্বর *
                      </label>
                      <input
                        {...register("customerPhone")}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm focus:border-fire focus:ring-1 focus:ring-fire/20 outline-none transition-all"
                        placeholder="01XXXXXXXXX"
                      />
                      {errors.customerPhone && (
                        <p className="text-error text-xs mt-1">{errors.customerPhone.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2 font-bengali">
                        ইমেইল (ঐচ্ছিক)
                      </label>
                      <input
                        {...register("customerEmail")}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm focus:border-fire focus:ring-1 focus:ring-fire/20 outline-none transition-all"
                        placeholder="ইমেইল ঠিকানা"
                      />
                      {errors.customerEmail && (
                        <p className="text-error text-xs mt-1">{errors.customerEmail.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-cream-dark/30 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold font-bengali text-charcoal mb-4">ডেলিভারি তথ্য</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2 font-bengali">
                        ডেলিভারি এলাকা *
                      </label>
                      <select
                        {...register("deliveryArea")}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm focus:border-fire focus:ring-1 focus:ring-fire/20 outline-none transition-all cursor-pointer"
                      >
                        <option value="inside_dhaka">ঢাকার ভিতরে (১০০ টাকা)</option>
                        <option value="outside_dhaka">ঢাকার বাহিরে (১৫০ টাকা)</option>
                      </select>
                      {errors.deliveryArea && (
                        <p className="text-error text-xs mt-1">{errors.deliveryArea.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2 font-bengali">
                        ঠিকানা *
                      </label>
                      <textarea
                        {...register("address")}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm focus:border-fire focus:ring-1 focus:ring-fire/20 outline-none transition-all resize-none"
                        placeholder="বাসা নং, রাস্তা, এলাকা..."
                      />
                      {errors.address && (
                        <p className="text-error text-xs mt-1">{errors.address.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-cream-dark/30 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold font-bengali text-charcoal mb-4">পেমেন্ট ও অন্যান্য</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2 font-bengali">
                        পেমেন্ট মেথড *
                      </label>
                      <select
                        {...register("paymentMethod")}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm focus:border-fire focus:ring-1 focus:ring-fire/20 outline-none transition-all cursor-pointer"
                      >
                        <option value="COD">ক্যাশ অন ডেলিভারি</option>
                        <option value="ONLINE">অনলাইন পেমেন্ট</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2 font-bengali">
                        কুপন কোড (ঐচ্ছিক)
                      </label>
                      <input
                        {...register("couponCode")}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm focus:border-fire focus:ring-1 focus:ring-fire/20 outline-none transition-all"
                        placeholder="কুপন কোড লিখুন"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2 font-bengali">
                        নোট (ঐচ্ছিক)
                      </label>
                      <textarea
                        {...register("notes")}
                        rows={2}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm focus:border-fire focus:ring-1 focus:ring-fire/20 outline-none transition-all resize-none"
                        placeholder="অর্ডার সম্পর্কিত নোট..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Items Selection */}
              <div className="space-y-6">
                <div className="bg-cream-dark/30 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold font-bengali text-charcoal mb-4">আইটেম নির্বাচন করুন</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {items?.map((item: any) => (
                      <div
                        key={item.id}
                        onClick={() => handleAddItem(item)}
                        className="flex items-center gap-4 p-3 bg-white rounded-xl border border-border hover:border-fire cursor-pointer transition-all"
                      >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-cream">
                          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bengali font-semibold text-sm text-charcoal line-clamp-1">{item.name}</h4>
                          <p className="text-fire font-bold text-sm">{formatPrice(item.discountPrice ?? item.price)}</p>
                        </div>
                        <Plus size={20} className="text-fire shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-cream-dark/30 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold font-bengali text-charcoal mb-4">নির্বাচিত আইটেমসমূহ</h3>
                  {selectedItems.length === 0 ? (
                    <p className="text-muted text-sm text-center py-4">কোনো আইটেম নির্বাচন করা হয়নি</p>
                  ) : (
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {selectedItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-border">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-cream">
                            <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bengali font-semibold text-xs text-charcoal line-clamp-1">{item.name}</h4>
                            <p className="text-fire font-bold text-xs">{formatPrice(item.discountPrice ?? item.price)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-lg bg-cream-dark text-charcoal hover:bg-fire hover:text-white transition-colors cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-lg bg-cream-dark text-charcoal hover:bg-fire hover:text-white transition-colors cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-cream-dark/30 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold font-bengali text-charcoal mb-4">সারসংক্ষেপ</h3>
                  <div className="space-y-3 font-bengali text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted">সাবটোটাল</span>
                      <span className="font-semibold text-charcoal">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">ডেলিভারি চার্জ</span>
                      <span className="font-semibold text-charcoal">{formatPrice(deliveryCharge)}</span>
                    </div>
                    <div className="pt-3 border-t border-border flex justify-between items-end">
                      <span className="text-lg font-bold text-charcoal">সর্বমোট</span>
                      <span className="text-2xl font-bold text-fire">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-cream-dark text-charcoal rounded-xl font-bold font-bengali hover:bg-cream-dark/80 transition-all cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button
                type="submit"
                disabled={isSubmitting || selectedItems.length === 0}
                className="px-6 py-3 bg-fire text-white rounded-xl font-bold font-bengali hover:bg-fire-dark transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? "প্রসেস হচ্ছে..." : "অর্ডার তৈরি করুন"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
