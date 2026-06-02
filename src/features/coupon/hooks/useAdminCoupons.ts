"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";
import { toast } from "sonner";

interface CouponQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  isActive?: boolean;
  discountType?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const useAdminCoupons = (params: CouponQueryParams = {}) => {
  const {
    page = 1,
    limit = 10,
    searchTerm,
    isActive,
    discountType,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;

  return useQuery({
    queryKey: ["admin", "coupons", page, searchTerm, isActive, discountType, sortBy, sortOrder],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (page) queryParams.append("page", page.toString());
      if (limit) queryParams.append("limit", limit.toString());
      if (searchTerm) queryParams.append("searchTerm", searchTerm);
      if (isActive !== undefined) queryParams.append("isActive", isActive.toString());
      if (discountType) queryParams.append("discountType", discountType);
      if (sortBy) queryParams.append("sortBy", sortBy);
      if (sortOrder) queryParams.append("sortOrder", sortOrder);

      const res = await api.get(`${API_ROUTES.ADMIN.COUPONS}?${queryParams.toString()}`);
      return res.data;
    },
  });
};

export const useToggleCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ couponId, isActive }: { couponId: string; isActive: boolean }) => {
      const res = await api.patch(`${API_ROUTES.ADMIN.COUPONS}/${couponId}`, { isActive });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
      toast.success("কুপন স্ট্যাটাস আপডেট করা হয়েছে");
    },
    onError: (error: any) => {
      toast.error(error.message || "আপডেট করতে সমস্যা হয়েছে");
    },
  });
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post(API_ROUTES.ADMIN.COUPONS, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
      toast.success("Coupon created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create coupon");
    },
  });
};

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await api.patch(`${API_ROUTES.ADMIN.COUPONS}/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
      toast.success("Coupon updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update coupon");
    },
  });
};
