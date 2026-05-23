"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Star, AlertCircle } from "lucide-react";
import { Container } from "@/components/shared/container/Container";
import { ItemCard } from "@/components/item/ItemCard";
import { PageLoader } from "@/components/loaders/PageLoader";
import { useCartStore } from "@/store/cart.store";
import { formatPrice } from "@/lib/utils";
import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";
import { toast } from "sonner";

export default function ItemDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const addItem = useCartStore((state) => state.addItem);
  const [qty, setQty] = useState(1);

  const { data: itemData, isLoading, isError } = useQuery({
    queryKey: ["item", slug],
    queryFn: async () => {
      const res = await api.get(API_ROUTES.ITEMS.BY_SLUG(slug));
      return res.data.data;
    },
  });

  if (isLoading) return <PageLoader />;

  if (isError || !itemData) {
    return (
      <Container className="py-20 text-center">
        <h2 className="text-2xl font-bold text-charcoal font-bengali mb-4">
          আইটেমটি খুঁজে পাওয়া যায়নি
        </h2>
      </Container>
    );
  }

  const item = itemData.item || itemData;
  const relatedItems = itemData.relatedItems || [];
  const effectivePrice = item.discountPrice ?? item.price;
  const hasDiscount = item.discountPrice !== null;
  const discountPercentage = hasDiscount 
    ? Math.round(((item.price - item.discountPrice!) / item.price) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      discountPrice: item.discountPrice ?? undefined,
      imageUrl: item.imageUrl,
      slug: item.slug,
    }, qty);
    toast.success(`${qty}x ${item.name} কার্টে যোগ করা হয়েছে!`);
  };

  return (
    <div className="py-12 bg-cream">
      <Container>
        {/* Top Section */}
        <div className="bg-white rounded-3xl p-4 sm:p-8 border border-border shadow-sm mb-12">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-cream-dark border border-border">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                  priority
                />
                {hasDiscount && (
                  <span className="absolute top-4 left-4 bg-error text-white font-bold px-3 py-1.5 rounded-xl shadow-lg">
                    -{discountPercentage}% ছাড়
                  </span>
                )}
                {!item.isAvailable && (
                  <span className="absolute top-4 right-4 bg-charcoal text-cream font-bold px-3 py-1.5 rounded-xl shadow-lg">
                    স্টকে নেই
                  </span>
                )}
              </div>
              {/* Optional: Thumbnails if item.images exists */}
              {item.images && item.images.length > 0 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-fire shrink-0 cursor-pointer">
                    <Image src={item.imageUrl} alt="thumb" fill className="object-cover" />
                  </div>
                  {item.images.map((img: string, i: number) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-transparent hover:border-fire/50 shrink-0 cursor-pointer opacity-70 hover:opacity-100 transition-all">
                      <Image src={img} alt={`thumb-${i}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col">
              <div className="mb-2 inline-flex items-center gap-1.5 px-3 py-1 bg-fire/10 text-fire text-sm font-semibold rounded-full w-fit">
                {item.category?.name || "Category"}
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-bengali text-charcoal mb-4 leading-tight">
                {item.name}
              </h1>

              {/* Reviews summary */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <div className="flex items-center text-warning">
                  <Star size={18} fill="currentColor" />
                  <span className="font-bold ml-1 text-charcoal">4.8</span>
                  <span className="text-muted text-sm ml-1">(১২০ রিভিউ)</span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-bold text-fire">
                    {formatPrice(effectivePrice)}
                  </span>
                  {hasDiscount && (
                    <span className="text-xl text-muted line-through mb-1">
                      {formatPrice(item.price)}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-muted font-bengali text-lg leading-relaxed mb-8 flex-1">
                {item.description}
              </p>

              {/* Add to Cart Actions */}
              <div className="mt-auto space-y-4">
                {!item.isAvailable && (
                  <div className="flex items-center gap-2 p-4 bg-error/10 text-error rounded-xl font-bengali font-semibold">
                    <AlertCircle size={20} />
                    দুঃখিত, এই আইটেমটি বর্তমানে স্টকে নেই।
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center justify-between px-2 bg-cream rounded-2xl border border-border w-full sm:w-36 h-14">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      disabled={!item.isAvailable || qty <= 1}
                      className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white text-charcoal transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="font-bold text-lg">{qty}</span>
                    <button
                      onClick={() => setQty(qty + 1)}
                      disabled={!item.isAvailable}
                      className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white text-charcoal transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  
                  <button
                    onClick={handleAddToCart}
                    disabled={!item.isAvailable}
                    className="flex-1 flex items-center justify-center gap-2 h-14 bg-fire text-white rounded-2xl font-semibold font-bengali text-lg hover:bg-fire-dark transition-all duration-300 hover:shadow-lg hover:shadow-fire/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ShoppingBag size={20} />
                    কার্টে যোগ করুন
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold font-bengali text-charcoal mb-8 border-b border-border pb-4">
            রিভিউ (১২০)
          </h2>
          {/* Review list would go here */}
          <div className="p-8 bg-white border border-border border-dashed rounded-2xl text-center">
            <p className="text-muted font-bengali">রিভিউ সেকশন নির্মাণাধীন...</p>
          </div>
        </div>

        {/* Related Items */}
        {relatedItems.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold font-bengali text-charcoal mb-8">
              সম্পর্কিত খাবার
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedItems.map((relatedItem: any) => (
                <ItemCard key={relatedItem.id} item={relatedItem} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
