"use client";

import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Star, MessageSquarePlus, MessageCircle, Edit2, Trash2, X } from "lucide-react";
import { useCustomerReviews, useSubmitReview, useUpdateReview, useDeleteReview } from "@/features/review/hooks/useCustomerReviews";
import { useCustomerOrders } from "@/features/order/hooks/useCustomerOrders";
import { StarRating } from "@/components/dashboard/StarRating";
import { toast } from "sonner";

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

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border mb-6">
        <button
          onClick={() => setActiveTab("MY_REVIEWS")}
          className={`pb-4 px-4 font-bold font-bengali text-lg border-b-2 transition-colors ${
            activeTab === "MY_REVIEWS" 
              ? "border-fire text-fire" 
              : "border-transparent text-muted hover:text-charcoal"
          }`}
        >
          আমার প্রদত্ত রিভিউ
        </button>
        <button
          onClick={() => setActiveTab("WRITE_REVIEW")}
          className={`pb-4 px-4 font-bold font-bengali text-lg border-b-2 transition-colors ${
            activeTab === "WRITE_REVIEW" 
              ? "border-fire text-fire" 
              : "border-transparent text-muted hover:text-charcoal"
          }`}
        >
          নতুন রিভিউ লিখুন
        </button>
      </div>

      {activeTab === "MY_REVIEWS" ? (
        /* My Reviews List */
        <div className="grid gap-6">
          {reviewsLoading ? (
            <div className="p-8 text-center animate-pulse text-muted font-bengali">লোড হচ্ছে...</div>
          ) : reviews && reviews.length > 0 ? (
            reviews.map((review: any) => (
              <div key={review.id} className="bg-white rounded-3xl p-6 border border-border shadow-sm flex flex-col sm:flex-row gap-6">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-border bg-cream">
                  {review.item?.imageUrl && (
                    <Image src={review.item.imageUrl} alt={review.item.name} fill className="object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  {editingReviewId === review.id ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg font-bengali text-charcoal">{review.item?.name}</h3>
                        <button onClick={() => setEditingReviewId(null)} className="p-2 text-muted hover:text-charcoal bg-cream rounded-full">
                          <X size={16} />
                        </button>
                      </div>
                      <StarRating value={editRating} onChange={setEditRating} size={24} />
                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 rounded-xl border border-border bg-white text-sm font-bengali outline-none focus:border-fire transition-all resize-none"
                        placeholder="আপনার মতামত..."
                      />
                      <button
                        onClick={() => handleUpdateReview(review.id)}
                        disabled={updateReview.isPending}
                        className="px-6 py-2 bg-fire text-white rounded-xl font-bold font-bengali hover:bg-fire-dark transition-all disabled:opacity-50"
                      >
                        {updateReview.isPending ? "আপডেট হচ্ছে..." : "আপডেট করুন"}
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                        <h3 className="font-bold text-lg font-bengali text-charcoal line-clamp-1">
                          {review.item?.name}
                        </h3>
                        <div className="flex items-center gap-4">
                          <div className="text-xs text-muted font-latin shrink-0">
                            {format(new Date(review.createdAt), "dd MMM, yyyy")}
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleEditClick(review)} className="text-charcoal hover:text-fire transition-colors" title="এডিট করুন">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDeleteClick(review.id)} className="text-error hover:text-red-700 transition-colors" title="মুছে ফেলুন">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <StarRating value={review.rating} readonly size={18} />
                      </div>
                      <p className="text-muted font-bengali text-sm leading-relaxed">
                        {review.comment || "কোনো লিখিত মতামত প্রদান করা হয়নি।"}
                      </p>
                      
                      {/* Status */}
                      <div className="mt-4 flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-md text-xs font-semibold font-bengali ${
                          review.isApproved ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                        }`}>
                          {review.isApproved ? "অনুমোদিত" : "অপেক্ষমাণ"}
                        </span>
                      </div>
                    </>
                  )}
                </div>
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
        <div className="bg-white rounded-3xl border border-border overflow-hidden">
          <div className="p-6 border-b border-border bg-cream-dark/30">
            <h2 className="text-xl font-bold font-bengali text-charcoal flex items-center gap-2">
              <MessageSquarePlus className="text-fire" size={24} />
              আপনার অভিজ্ঞতা শেয়ার করুন
            </h2>
          </div>
          
          <div className="p-6 sm:p-8">
            {ordersLoading ? (
              <p className="text-center text-muted animate-pulse">খাবার লোড হচ্ছে...</p>
            ) : reviewableItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted font-bengali mb-2">রিভিউ দেওয়ার মতো কোনো আইটেম নেই।</p>
                <p className="text-sm text-muted font-bengali">শুধুমাত্র ডেলিভারি সম্পন্ন হয়েছে এমন খাবারের রিভিউ দেওয়া যাবে।</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-8 max-w-2xl">
                {/* Item Selection */}
                <div>
                  <label className="block text-sm font-bold font-bengali text-charcoal mb-3">
                    খাবার নির্বাচন করুন *
                  </label>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {reviewableItems.map((item: any) => (
                      <div 
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedItem?.id === item.id 
                            ? "border-fire bg-fire/5" 
                            : "border-border hover:border-fire/50"
                        }`}
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                        </div>
                        <span className="font-semibold font-bengali text-sm text-charcoal line-clamp-2">
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-bold font-bengali text-charcoal mb-3">
                    রেটিং দিন *
                  </label>
                  <div className="bg-cream-dark/30 inline-block p-4 rounded-2xl border border-border">
                    <StarRating value={rating} onChange={setRating} size={32} />
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-bold font-bengali text-charcoal mb-3">
                    আপনার মতামত (ঐচ্ছিক)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm font-bengali outline-none focus:border-fire focus:ring-1 focus:ring-fire/20 transition-all resize-none"
                    placeholder="খাবারটি সম্পর্কে আপনার অভিজ্ঞতা বিস্তারিত লিখুন..."
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={!selectedItem || submitReview.isPending}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-fire text-white rounded-xl font-bold font-bengali hover:bg-fire-dark transition-all disabled:opacity-50 cursor-pointer shadow-sm active:scale-95"
                  >
                    <MessageSquarePlus size={20} />
                    {submitReview.isPending ? "সাবমিট হচ্ছে..." : "রিভিউ সাবমিট করুন"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
