"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, ArrowLeft, Package, Flame, Sparkles, Weight, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Container } from "@/components/shared/container/Container";
import { ItemCard } from "@/components/item/ItemCard";
import { PageLoader } from "@/components/loaders/PageLoader";
import { useCartStore } from "@/store/cart.store";
import { formatPrice } from "@/lib/utils";
import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function ItemDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const addItem = useCartStore((state) => state.addItem);
  const [qty, setQty] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"similar" | "reviews">("similar");

  const { data: itemData, isLoading, isError } = useQuery({
    queryKey: ["item", slug],
    queryFn: async () => {
      // First fetch all items to find the one with matching slug
      const res = await api.get(API_ROUTES.ITEMS.BASE);
      const items = Array.isArray(res.data.data) ? res.data.data : res.data.data?.items || [];
      const item = items.find((i: any) => i.slug === slug);
      
      if (!item) {
        throw new Error('Item not found');
      }
      
      // Then fetch full item details by ID
      const detailRes = await api.get(API_ROUTES.ITEMS.BY_ID(item.id));
      return detailRes.data.data;
    },
  });

  // Related items query - must be before conditional returns
  const item = itemData?.item || itemData;
  const { data: relatedResponse } = useQuery({
    queryKey: ["related-items", item?.categoryId, item?.id],
    queryFn: async () => {
      const res = await api.get(`${API_ROUTES.ITEMS.BASE}?category.id=${item?.categoryId}`);
      const items = Array.isArray(res.data.data) ? res.data.data : res.data.data?.items || [];
      return items.filter((i: any) => i.id !== item.id).slice(0, 4);
    },
    enabled: !!item?.categoryId,
  });

  const relatedItems = relatedResponse || [];

  // Reviews query - must be before conditional returns
  const { data: reviewsResponse, isLoading: isReviewsLoading } = useQuery({
    queryKey: ["item-reviews", item?.id],
    queryFn: async () => {
      const res = await api.get(`${API_ROUTES.REVIEWS.BY_ITEM(item?.id)}`);
      return res.data.data || [];
    },
    enabled: !!item?.id,
  });

  const reviews = reviewsResponse || [];

  if (isLoading) return <PageLoader />;

  if (isError || !itemData) {
    return (
      <Container className="py-20 text-center">
        <div className="w-24 h-24 bg-cream rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="w-10 h-10 text-muted-light" />
        </div>
        <h2 className="text-2xl font-bold text-charcoal font-bengali mb-4">
          আইটেমটি খুঁজে পাওয়া যায়নি
        </h2>
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 px-6 py-3 bg-fire text-white rounded-xl font-semibold font-bengali hover:bg-fire-dark transition-colors mt-4"
        >
          <ArrowLeft className="w-4 h-4" />
          মেনুতে ফিরে যান
        </Link>
      </Container>
    );
  }

  const effectivePrice = item.discountPrice ?? item.price;
  const hasDiscount = item.discountPrice !== null;
  const discountPercentage = hasDiscount 
    ? Math.round(((item.price - item.discountPrice!) / item.price) * 100)
    : 0;

  // Build gallery array from imageUrl + images[]
  const allImages: string[] = item
    ? [item.imageUrl, ...(Array.isArray(item.images) ? item.images : [])].filter(Boolean) as string[]
    : [];

  // Fallback for missing image
  const itemImageUrl = item.imageUrl || "/placeholder-food.jpg";
  const itemAltText = item.name || "Food item";

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

  const nextImage = () => {
    if (allImages.length > 1) {
      setActiveImageIndex((prev) => (prev + 1) % allImages.length);
    }
  };

  const prevImage = () => {
    if (allImages.length > 1) {
      setActiveImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Container className="w-11/12 pt-8 pb-20">
        {/* Breadcrumb */}
        <Link href="/menu" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-fire mb-10 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          মেনুতে ফিরে যান
        </Link>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          
          {/* Left: Image Gallery */}
          <div className="space-y-4 lg:sticky lg:top-24">
            {/* Hero Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-cream-dark border border-border shadow-xl shadow-fire/5 group">
              <Image
                src={allImages[activeImageIndex] || itemImageUrl}
                alt={itemAltText}
                fill
                className="object-cover"
                priority
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {item.isFeatured && (
                  <span className="bg-fire/90 text-white backdrop-blur-md border-none py-1.5 px-3 text-xs font-bold tracking-wider uppercase shadow-lg shadow-fire/20 rounded-xl flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    বেস্ট সেলার
                  </span>
                )}
                {hasDiscount && (
                  <span className="bg-error/90 text-white backdrop-blur-md border-none py-1.5 px-3 text-xs font-bold tracking-wider uppercase shadow-lg shadow-error/20 rounded-xl">
                    -{discountPercentage}% ছাড়
                  </span>
                )}
              </div>

              <div className="absolute top-4 right-4 z-10">
                {item.isSpicy && (
                  <span className="bg-red-500/90 text-white backdrop-blur-md border-none py-1.5 px-3 text-xs font-bold tracking-wider uppercase shadow-lg shadow-red-500/20 rounded-xl flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    ঝাল
                  </span>
                )}
                {!item.isAvailable && (
                  <span className="bg-charcoal/90 text-cream backdrop-blur-md border-none py-1.5 px-3 text-xs font-bold tracking-wider uppercase shadow-lg rounded-xl">
                    স্টকে নেই
                  </span>
                )}
              </div>

              {/* Navigation arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg z-10 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg z-10 cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Image counter */}
                  <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full z-10">
                    {activeImageIndex + 1} / {allImages.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={cn(
                      "relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer shadow-sm",
                      activeImageIndex === i
                        ? "border-fire ring-2 ring-fire/20 shadow-md"
                        : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <Image src={img} alt={`${itemAltText} ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col pt-2">
            {/* Category */}
            <div className="text-fire font-bold tracking-widest uppercase text-xs mb-3">
              {item.category?.name || "Category"}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-bengali text-charcoal leading-tight mb-3">
              {item.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-fire">
                {formatPrice(effectivePrice)}
              </span>
              {hasDiscount && (
                <span className="text-xl text-muted line-through mb-1">
                  {formatPrice(item.price)}
                </span>
              )}
            </div>

            {/* Product Specs */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {item.weight && (
                <div className="flex items-center gap-3 bg-cream/40 rounded-2xl px-4 py-3 border border-border">
                  <div className="w-9 h-9 rounded-xl bg-fire/10 flex items-center justify-center shrink-0">
                    <Weight className="w-4 h-4 text-fire" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted uppercase tracking-wider font-semibold">ওজন</p>
                    <p className="font-bold text-sm">{item.weight}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 bg-emerald-500/5 rounded-2xl px-4 py-3 border border-emerald-500/10">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-[11px] text-muted uppercase tracking-wider font-semibold">স্ট্যাটাস</p>
                  <p className="font-bold text-sm text-emerald-600">
                    {item.isAvailable ? "স্টকে আছে" : "স্টকে নেই"}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {item.description && (
              <div className="mb-8">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-3">এই খাবার সম্পর্কে</h3>
                <p className="text-muted font-bengali leading-relaxed">
                  {item.description}
                </p>
              </div>
            )}

            {/* Add to Cart Section */}
            <div className="mt-auto space-y-5 pt-6 border-t border-border">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-muted font-bengali">পরিমাণ</span>
                <div className="flex items-center bg-cream/50 rounded-xl border border-border overflow-hidden">
                  <button
                    className="w-11 h-11 flex items-center justify-center hover:bg-white transition-colors disabled:opacity-30 cursor-pointer"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    disabled={qty <= 1 || !item.isAvailable}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="w-14 h-11 flex items-center justify-center font-bold text-lg border-x border-border">{qty}</div>
                  <button
                    className="w-11 h-11 flex items-center justify-center hover:bg-white transition-colors disabled:opacity-30 cursor-pointer"
                    onClick={() => setQty(qty + 1)}
                    disabled={!item.isAvailable}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-muted ml-auto font-medium font-bengali">
                  মোট: <span className="text-charcoal font-bold text-lg">{formatPrice(effectivePrice * qty)}</span>
                </span>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!item.isAvailable}
                className="w-full flex items-center justify-center gap-2 h-14 bg-fire text-white rounded-2xl font-bold font-bengali text-lg hover:bg-fire-dark transition-all duration-300 shadow-lg shadow-fire/20 hover:shadow-fire/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                কার্টে যোগ করুন — {formatPrice(effectivePrice * qty)}
              </button>
            </div>
          </div>
        </div>

        {/* Tabbed Section */}
        <div className="mt-20 space-y-10">
          {/* Tab Navigation */}
          <div className="flex items-center justify-center border-b border-border pb-px">
            <div className="flex gap-8 relative">
              <button
                onClick={() => setActiveTab("similar")}
                className={cn(
                  "pb-4 text-sm font-bold uppercase tracking-widest transition-all relative font-bengali",
                  activeTab === "similar" 
                    ? "text-fire" 
                    : "text-muted hover:text-charcoal"
                )}
              >
                সম্পর্কিত খাবার
                {activeTab === "similar" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-fire" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={cn(
                  "pb-4 text-sm font-bold uppercase tracking-widest transition-all relative font-bengali",
                  activeTab === "reviews" 
                    ? "text-fire" 
                    : "text-muted hover:text-charcoal"
                )}
              >
                রিভিউ ({reviews.length})
                {activeTab === "reviews" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-fire" />
                )}
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "similar" ? (
                <div className="space-y-12">
                  {relatedItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {relatedItems.map((relatedItem: any, index: number) => (
                        <motion.div
                          key={relatedItem.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.1 * index }}
                        >
                          <ItemCard item={relatedItem} />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-cream/50 rounded-[2.5rem] border border-dashed border-border">
                      <p className="text-muted font-bengali font-medium">কোন সম্পর্কিত খাবার পাওয়া যায়নি।</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-8">
                  {isReviewsLoading ? (
                    <div className="p-8 bg-white border border-border rounded-2xl text-center">
                      <p className="text-muted font-bengali">লোড হচ্ছে...</p>
                    </div>
                  ) : reviews.length > 0 ? (
                    <>
                      {/* Overall Rating Summary */}
                      <div className="bg-white border border-border rounded-2xl p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Left: Average Rating */}
                          <div className="flex flex-col items-center justify-center text-center">
                            <div className="text-6xl font-bold text-fire mb-2">
                              {reviews.length > 0 ? (reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length).toFixed(1) : "0.0"}
                            </div>
                            <div className="flex items-center gap-1 text-warning mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={20}
                                  className={i < Math.round(reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length) ? "fill-current" : "opacity-30"}
                                />
                              ))}
                            </div>
                            <p className="text-muted font-bengali">{reviews.length} টি রিভিউ</p>
                          </div>

                          {/* Right: Rating Distribution */}
                          <div className="space-y-3">
                            {[5, 4, 3, 2, 1].map((star) => {
                              const count = reviews.filter((r: any) => r.rating === star).length;
                              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                              return (
                                <div key={star} className="flex items-center gap-3">
                                  <span className="text-sm font-semibold w-12">{star} তারা</span>
                                  <div className="flex-1 h-2 bg-cream rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-fire rounded-full transition-all duration-500"
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                  <span className="text-sm text-muted w-12 text-right">{count}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Individual Reviews */}
                      <div className="space-y-4">
                        {reviews.map((review: any, index: number) => (
                          <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 * index }}
                            className="bg-white border border-border rounded-2xl p-6"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-fire/10 flex items-center justify-center">
                                  <span className="text-fire font-bold text-sm">
                                    {review.user?.name?.charAt(0) || "U"}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-semibold text-charcoal font-bengali">{review.user?.name || "Anonymous"}</p>
                                  <p className="text-xs text-muted">
                                    {new Date(review.createdAt).toLocaleDateString('bn-BD')}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 text-warning">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={16}
                                    className={i < review.rating ? "fill-current" : "opacity-30"}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-muted font-bengali leading-relaxed">{review.comment}</p>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="p-8 bg-white border border-border border-dashed rounded-2xl text-center">
                      <p className="text-muted font-bengali">এখনো কোন রিভিউ নেই।</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </div>
  );
}
