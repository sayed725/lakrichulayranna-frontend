"use client";

import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Star, MessageSquarePlus, MessageCircle, Edit2, Trash2, X  } from "lucide-react";
import { useCustomerReviews, useSubmitReview, useUpdateReview, useDeleteReview } from "@/features/review/hooks/useCustomerReviews";
import { useCustomerOrders } from "@/features/order/hooks/useCustomerOrders";
import { StarRating } from "@/components/dashboard/StarRating";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function CustomerReviewsPage() {
  const { data: reviews, isLoading: reviewsLoading } = useCustomerReviews();
  const { data: orders, isLoading: ordersLoading } = useCustomerOrders();
  

  const submitReview = useSubmitReview();
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();

  const [activeTab, setActiveTab] = useState<"MY_REVIEWS" | "WRITE_REVIEW">("MY_REVIEWS");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  // Get unique items from delivered orders to review
  const reviewableItems = orders
    ?.filter((o: any) => o.status === "DELIVERED")
    ?.flatMap((o: any) => o.items)
    ?.filter((item: any) => item?.item?.id)
    ?.filter((item: any, index: number, self: any[]) => 
      index === self.findIndex((t) => t?.item?.id === item?.item?.id)
    )
    ?.map((i: any) => i.item) || [];

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    submitReview.mutate(
      { itemId: selectedItem.id, rating, comment },
      {
        onSuccess: () => {
          setSelectedItem(null);
          setRating(5);
          setComment("");
          setActiveTab("MY_REVIEWS");
        }
      }
    );
  };

  const handleEditClick = (review: any) => {
    setEditingReviewId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment || "");
  };

  const handleUpdateReview = (reviewId: string) => {
    updateReview.mutate(
      { reviewId, rating: editRating, comment: editComment },
      {
        onSuccess: () => {
          setEditingReviewId(null);
        }
      }
    );
  };

  const handleDeleteClick = (reviewId: string) => {
    toast("রিভিউ মুছে ফেলতে চান?", {
      description: "এই অ্যাকশনটি বাতিল করা যাবে না।",
      action: {
        label: "মুছুন",
        onClick: () => deleteReview.mutate(reviewId),
      },
      cancel: {
        label: "বাতিল",
        onClick: () => {},
      },
      style: { backgroundColor: "#fff", borderColor: "#EF4444" }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-bengali text-charcoal mb-1">
          আমার রিভিউ
        </h1>
        <p className="text-muted font-bengali">আপনার পূর্ববর্তী রিভিউ দেখুন এবং নতুন রিভিউ দিন</p>
      </div>

      <div className="flex gap-2 border-b border-border mb-6 overflow-x-auto no-scrollbar">
        <Button
          variant="ghost"
          onClick={() => setActiveTab("MY_REVIEWS")}
          className={`pb-3 sm:pb-4 px-3 sm:px-4 h-auto font-bold font-bengali text-base sm:text-lg border-b-2 rounded-none hover:bg-transparent transition-colors border-t-0 border-x-0 whitespace-nowrap ${
            activeTab === "MY_REVIEWS" 
              ? "border-fire text-fire hover:text-fire" 
              : "border-transparent text-muted hover:text-charcoal"
          }`}
        >
          আমার প্রদত্ত রিভিউ
        </Button>
        <Button
          variant="ghost"
          onClick={() => setActiveTab("WRITE_REVIEW")}
          className={`pb-3 sm:pb-4 px-3 sm:px-4 h-auto font-bold font-bengali text-base sm:text-lg border-b-2 rounded-none hover:bg-transparent transition-colors border-t-0 border-x-0 whitespace-nowrap ${
            activeTab === "WRITE_REVIEW" 
              ? "border-fire text-fire hover:text-fire" 
              : "border-transparent text-muted hover:text-charcoal"
          }`}
        >
          নতুন রিভিউ লিখুন
        </Button>
      </div>

      {activeTab === "MY_REVIEWS" ? (
        /* My Reviews List */
        <div className="grid gap-4 sm:gap-6 w-full max-w-full overflow-hidden">
          {reviewsLoading ? (
            <div className="p-8 text-center animate-pulse text-muted font-bengali">লোড হচ্ছে...</div>
          ) : reviews && reviews.length > 0 ? (
            reviews.map((review: any) => (
              <div key={review.id} className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 border border-border shadow-sm group hover:shadow-md transition-all duration-300 w-full overflow-hidden">
                {editingReviewId === review.id ? (
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border border-border bg-cream shadow-inner mx-auto sm:mx-0">
                      {(review.item?.imageUrl || review.item?.image) ? (
                        <Image 
                          src={review.item?.imageUrl || review.item?.image} 
                          alt={review.item?.name || "খাবারের ছবি"} 
                          fill 
                          className="object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted font-bengali bg-cream-dark/20 text-xs">
                          ছবি নেই
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-4 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-base sm:text-lg font-bengali text-charcoal truncate">{review.item?.name}</h3>
                        <Button
                          variant="destructive"
                          onClick={() => setEditingReviewId(null)}
                          className="p-2 h-auto w-auto text-muted hover:text-charcoal bg-cream hover:bg-cream-dark/30 rounded-full border-0 transition-colors shrink-0"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                      <StarRating value={editRating} onChange={setEditRating} size={22} />
                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2.5 rounded-2xl border border-border bg-cream/30 focus:bg-white text-sm font-bengali outline-none focus:border-fire transition-all resize-none"
                        placeholder="আপনার মতামত..."
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => setEditingReviewId(null)}
                          className="px-4 py-2 h-auto bg-cream hover:bg-cream-dark/30 text-charcoal rounded-xl font-bold font-bengali border-0 transition-all text-xs sm:text-sm"
                        >
                          বাতিল
                        </Button>
                        <Button
                          onClick={() => handleUpdateReview(review.id)}
                          disabled={updateReview.isPending}
                          className="px-5 py-2 h-auto bg-fire text-white rounded-xl font-bold font-bengali hover:bg-fire-dark transition-all disabled:opacity-50 border-0 text-xs sm:text-sm"
                        >
                          {updateReview.isPending ? "আপডেট হচ্ছে..." : "আপডেট করুন"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3.5 sm:gap-4 w-full">
                    {/* Header: Item image, title, rating & actions */}
                    <div className="flex items-start justify-between gap-2.5 w-full">
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                        <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border border-border/80 bg-cream shadow-inner">
                          {(review.item?.imageUrl || review.item?.image) ? (
                            <Image 
                              src={review.item?.imageUrl || review.item?.image} 
                              alt={review.item?.name || "খাবারের ছবি"} 
                              fill 
                              className="object-cover transition-transform duration-500 group-hover:scale-105" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted font-bengali bg-cream-dark/20 text-xs">
                              ছবি নেই
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 space-y-1 flex-1">
                          <h3 className="font-bold text-sm sm:text-lg font-bengali text-charcoal truncate">
                            {review.item?.name}
                          </h3>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <StarRating value={review.rating} readonly size={14} />
                            <span className="text-[11px] sm:text-xs font-semibold text-charcoal bg-cream/80 px-1.5 py-0.5 rounded-full font-latin">
                              {Number(review.rating).toFixed(1)}
                            </span>
                          </div>
                          <p className="text-[10px] sm:text-xs text-muted font-latin">
                            {format(new Date(review.createdAt), "dd MMM, yyyy")}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 shrink-0 bg-cream/50 p-1 rounded-xl border border-border/40">
                        <Button
                          variant="ghost"
                          onClick={() => handleEditClick(review)}
                          className="text-muted hover:text-fire transition-colors h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-lg hover:bg-white"
                          title="এডিট করুন"
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => handleDeleteClick(review.id)}
                          className="text-muted hover:text-error transition-colors h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-lg hover:bg-white"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>

                    {/* Review comment content box */}
                    <div className="bg-cream/30 p-3 sm:p-4 rounded-2xl border border-border/40 w-full overflow-hidden">
                      <p className="text-charcoal/90 font-bengali text-xs sm:text-sm leading-relaxed break-words whitespace-pre-line">
                        {review.comment || "কোনো লিখিত মতামত প্রদান করা হয়নি।"}
                      </p>
                    </div>

                    {/* Footer Status Badge */}
                    <div className="flex items-center justify-between pt-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold font-bengali border ${
                          review.isApproved 
                            ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" 
                            : "bg-amber-500/10 text-amber-700 border-amber-500/20"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${review.isApproved ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                          {review.isApproved ? "অনুমোদিত" : "অপেক্ষমাণ"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl border border-border border-dashed p-12 text-center">
              <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center text-muted mx-auto mb-4">
                <MessageCircle size={24} />
              </div>
              <h2 className="text-xl font-bold font-bengali text-charcoal mb-2">কোনো রিভিউ নেই</h2>
              <p className="text-muted font-bengali">আপনি এখনও কোনো খাবারের রিভিউ দেননি।</p>
            </div>
          )}
        </div>
      ) : (
        /* Write Review Form */
        <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden w-full max-w-full">
          <div className="p-4 sm:p-6 border-b border-border/80 bg-cream/40">
            <h2 className="text-lg sm:text-xl font-bold font-bengali text-charcoal flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-fire/10 text-fire">
                <MessageSquarePlus size={20} className="sm:w-6 sm:h-6" />
              </span>
              আপনার অভিজ্ঞতা শেয়ার করুন
            </h2>
          </div>
          
          <div className="p-4 sm:p-8">
            {ordersLoading ? (
              <div className="py-12 text-center text-muted font-bengali animate-pulse">খাবার লোড হচ্ছে...</div>
            ) : reviewableItems.length === 0 ? (
              <div className="text-center py-10 px-4 bg-cream/20 rounded-2xl border border-dashed border-border">
                <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center text-muted mx-auto mb-3">
                  <MessageCircle size={22} />
                </div>
                <p className="text-charcoal font-bold font-bengali text-base mb-1">রিভিউ দেওয়ার মত কোনো আইটেম নেই</p>
                <p className="text-xs sm:text-sm text-muted font-bengali">শুধুমাত্র ডেলিভারি সম্পন্ন হওয়া অর্ডারের খাবারের রিভিউ দেওয়া সম্ভব।</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-6 sm:space-y-8 max-w-3xl">
                {/* Item Selection */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-bold font-bengali text-charcoal">
                      খাবার নির্বাচন করুন <span className="text-fire">*</span>
                    </label>
                    {selectedItem && (
                      <span className="text-xs text-emerald-600 font-bengali font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        আইটেম সিলেক্ট করা হয়েছে
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-h-64 sm:max-h-80 overflow-y-auto pr-1">
                    {reviewableItems.map((item: any) => {
                      const isSelected = selectedItem?.id === item.id;
                      return (
                        <div 
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          className={`flex items-center gap-3 p-3 rounded-2xl border-2 cursor-pointer transition-all duration-200 group relative ${
                            isSelected 
                              ? "border-fire bg-fire/5 shadow-sm ring-1 ring-fire/30" 
                              : "border-border/80 hover:border-fire/40 hover:bg-cream/20"
                          }`}
                        >
                          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 border border-border shadow-inner bg-cream">
                            {item.imageUrl ? (
                              <Image 
                                src={item.imageUrl} 
                                alt={item.name} 
                                fill 
                                className="object-cover transition-transform duration-300 group-hover:scale-105" 
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted text-[10px] bg-cream-dark/20">
                                ছবি নেই
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="font-bold font-bengali text-sm text-charcoal block truncate">
                              {item.name}
                            </span>
                            <span className="text-[11px] text-muted font-bengali">
                              ট্যাপ করে নির্বাচন করুন
                            </span>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-fire text-white flex items-center justify-center text-xs shrink-0">
                              ✓
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Rating */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold font-bengali text-charcoal">
                    রেটিং দিন <span className="text-fire">*</span>
                  </label>
                  <div className="bg-cream/40 p-4 sm:p-5 rounded-2xl border border-border/80 flex flex-col items-center sm:items-start gap-2">
                    <StarRating value={rating} onChange={setRating} size={28} />
                    <span className="text-xs text-muted font-bengali">
                      {rating === 5 ? "অসাধারণ! ⭐⭐⭐⭐⭐" : rating === 4 ? "খুব ভালো ⭐⭐⭐⭐" : rating === 3 ? "মোটামুটি ⭐⭐⭐" : rating === 2 ? "সন্তোষজনক নয় ⭐⭐" : "খুব খারাপ ⭐"}
                    </span>
                  </div>
                </div>

                {/* Comment */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold font-bengali text-charcoal">
                    আপনার মতামত <span className="text-muted text-xs font-normal">(ঐচ্ছিক)</span>
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="w-full p-3.5 sm:p-4 rounded-2xl border border-border bg-cream/20 focus:bg-white text-sm font-bengali outline-none focus:border-fire focus:ring-2 focus:ring-fire/10 transition-all resize-none"
                    placeholder="খাবারের স্বাদ, মান ও ডেলিভারি অভিজ্ঞতা বিস্তারিত লিখুন..."
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={!selectedItem || submitReview.isPending}
                    className="w-full sm:w-auto h-11 px-8 rounded-xl bg-fire text-white hover:bg-fire-dark font-bold font-bengali shadow-md hover:shadow-fire/20 active:scale-95 transition-all text-base gap-2 shrink-0 cursor-pointer border-0"
                  >
                    <MessageSquarePlus size={20} />
                    {submitReview.isPending ? "সাবমিট হচ্ছে..." : "রিভিউ সাবমিট করুন"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
