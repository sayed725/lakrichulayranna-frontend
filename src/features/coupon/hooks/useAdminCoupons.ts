"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";
import { toast } from "sonner";

export const useAdminCoupons = () => {
  return useQuery({
    queryKey: ["admin", "coupons"],
    queryFn: async () => {
      const res = await api.get(API_ROUTES.ADMIN.COUPONS);
      return res.data.data;
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
