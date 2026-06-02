"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBanners, createBanner, updateBanner, Banner } from "@/services/banner.service";
import { toast } from "sonner";

export const useAdminBanners = (params?: any) => {
  return useQuery({
    queryKey: ["admin", "banners", params],
    queryFn: () => getBanners(params),
  });
};

export const useToggleBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bannerId, isActive }: { bannerId: string; isActive: boolean }) => {
      return updateBanner(bannerId, { isActive });
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
      const { deleteBanner: deleteBannerApi } = await import("@/services/banner.service");
      return deleteBannerApi(bannerId);
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

export const useCreateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "banners"] });
      toast.success("ব্যানার তৈরি করা হয়েছে");
    },
    onError: (error: any) => {
      toast.error(error.message || "ব্যানার তৈরি করতে সমস্যা হয়েছে");
    },
  });
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateBanner(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "banners"] });
      toast.success("ব্যানার আপডেট করা হয়েছে");
    },
    onError: (error: any) => {
      toast.error(error.message || "ব্যানার আপডেট করতে সমস্যা হয়েছে");
    },
  });
};
