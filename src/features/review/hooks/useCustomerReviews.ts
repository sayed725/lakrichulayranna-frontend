"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";
import { toast } from "sonner";

export const useCustomerReviews = () => {
  return useQuery({
    queryKey: ["customer", "reviews"],
    queryFn: async () => {
      const res = await api.get(`${API_ROUTES.REVIEWS.BASE}/my-reviews`);
      return res.data.data;
    },
  });
};

export const useSubmitReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { itemId: string; rating: number; comment?: string }) => {
      const res = await api.post(API_ROUTES.REVIEWS.BASE, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer", "reviews"] });
      toast.success("আপনার রিভিউ সফলভাবে সাবমিট হয়েছে");
    },
    onError: (error: any) => {
      toast.error(error.message || "রিভিউ সাবমিট করতে সমস্যা হয়েছে");
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { reviewId: string; rating?: number; comment?: string }) => {
      const { reviewId, ...payload } = data;
      const res = await api.patch(`${API_ROUTES.REVIEWS.BASE}/${reviewId}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer", "reviews"] });
      toast.success("রিভিউ সফলভাবে আপডেট হয়েছে");
    },
    onError: (error: any) => {
      toast.error(error.message || "রিভিউ আপডেট করতে সমস্যা হয়েছে");
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: string) => {
      const res = await api.delete(`${API_ROUTES.REVIEWS.BASE}/my-reviews/${reviewId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer", "reviews"] });
      toast.success("রিভিউ সফলভাবে মুছে ফেলা হয়েছে");
    },
    onError: (error: any) => {
      toast.error(error.message || "রিভিউ মুছতে সমস্যা হয়েছে");
    },
  });
};
