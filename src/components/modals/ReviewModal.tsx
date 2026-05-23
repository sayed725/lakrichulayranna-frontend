"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, MessageSquarePlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StarRating } from "@/components/dashboard/StarRating";
import { useSubmitReview, useCustomerReviews } from "@/features/review/hooks/useCustomerReviews";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any | null;
}

export function ReviewModal({ isOpen, onClose, order }: ReviewModalProps) {
  const submitReview = useSubmitReview();
  const { data: reviews } = useCustomerReviews();
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // Get unique items from the order and filter out ones already reviewed
  const reviewableItems = order?.items
    ?.filter((item: any) => item?.item?.id)
    ?.filter((item: any, index: number, self: any[]) => 
      index === self.findIndex((t) => t?.item?.id === item?.item?.id)
    )
    ?.map((i: any) => i.item)
    ?.filter((item: any) => !reviews?.some((r: any) => r.itemId === item.id)) || [];

  useEffect(() => {
    if (isOpen) {
      setSelectedItem(null);
      setRating(5);
      setComment("");
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    submitReview.mutate(
      { itemId: selectedItem.id, rating, comment },
      {
        onSuccess: () => {
          onClose();
        }
      }
    );
  };

  return (
    <AnimatePresence>
      {isOpen && order && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-border bg-cream-dark/30 flex items-center justify-between">
              <h2 className="text-xl font-bold font-bengali text-charcoal flex items-center gap-2">
                <MessageSquarePlus className="text-fire" size={24} />
                রিভিউ দিন (অর্ডার #{order.orderNumber})
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-muted hover:text-charcoal hover:bg-white rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {reviewableItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted font-bengali mb-2">রিভিউ দেওয়ার মতো কোনো আইটেম নেই।</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Item Selection */}
                  <div>
                    <label className="block text-sm font-bold font-bengali text-charcoal mb-3">
                      খাবার নির্বাচন করুন *
                    </label>
                    <div className="grid gap-3">
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
                            {item.imageUrl && (
                               <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                            )}
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

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-3 border border-border text-charcoal rounded-xl font-bold font-bengali hover:bg-cream transition-colors"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      disabled={!selectedItem || submitReview.isPending}
                      className="flex items-center justify-center gap-2 px-8 py-3 bg-fire text-white rounded-xl font-bold font-bengali hover:bg-fire-dark transition-all disabled:opacity-50 cursor-pointer shadow-sm active:scale-95"
                    >
                      {submitReview.isPending ? "সাবমিট হচ্ছে..." : "সাবমিট করুন"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
