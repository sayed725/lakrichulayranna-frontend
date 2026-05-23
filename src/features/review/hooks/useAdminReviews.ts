"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";
import { toast } from "sonner";

export const useAdminReviews = () => {
  return useQuery({
    queryKey: ["admin", "reviews"],
    queryFn: async () => {
      const res = await api.get(API_ROUTES.ADMIN.REVIEWS);
      return res.data.data;
    },
  });
};

export const useApproveReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: string) => {
      const res = await api.patch(`${API_ROUTES.ADMIN.REVIEWS}/${reviewId}/approve`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
      toast.success("রিভিউ অনুমোদন করা হয়েছে");
    },
    onError: (error: any) => {
      toast.error(error.message || "অনুমোদন করতে সমস্যা হয়েছে");
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: string) => {
      const res = await api.delete(`${API_ROUTES.ADMIN.REVIEWS}/${reviewId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
      toast.success("রিভিউ মুছে ফেলা হয়েছে");
    },
    onError: (error: any) => {
      toast.error(error.message || "মুছে ফেলতে সমস্যা হয়েছে");
    },
  });
};
