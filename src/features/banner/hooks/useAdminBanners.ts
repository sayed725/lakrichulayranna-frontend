"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";
import { toast } from "sonner";

export const useAdminBanners = () => {
  return useQuery({
    queryKey: ["admin", "banners"],
    queryFn: async () => {
      const res = await api.get(API_ROUTES.ADMIN.BANNERS);
      return res.data.data;
    },
  });
};

export const useToggleBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bannerId, isActive }: { bannerId: string; isActive: boolean }) => {
      const res = await api.patch(`${API_ROUTES.ADMIN.BANNERS}/${bannerId}/toggle`, { isActive });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "banners"] });
      toast.success("ব্যানার স্ট্যাটাস আপডেট করা হয়েছে");
    },
    onError: (error: any) => {
      toast.error(error.message || "আপডেট করতে সমস্যা হয়েছে");
    },
  });
};

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bannerId: string) => {
      const res = await api.delete(`${API_ROUTES.ADMIN.BANNERS}/${bannerId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "banners"] });
      toast.success("ব্যানার মুছে ফেলা হয়েছে");
    },
    onError: (error: any) => {
      toast.error(error.message || "মুছে ফেলতে সমস্যা হয়েছে");
    },
  });
};
