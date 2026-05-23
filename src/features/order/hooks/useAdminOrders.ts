"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";
import { toast } from "sonner";

export const useAdminOrders = (status?: string) => {
  return useQuery({
    queryKey: ["admin", "orders", status],
    queryFn: async () => {
      const url = status && status !== "ALL" 
        ? `${API_ROUTES.ADMIN.ORDERS}?status=${status}` 
        : API_ROUTES.ADMIN.ORDERS;
      const res = await api.get(url);
      return res.data.data;
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const res = await api.patch(`${API_ROUTES.ADMIN.ORDERS}/${orderId}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      toast.success("অর্ডারের স্ট্যাটাস আপডেট করা হয়েছে");
    },
    onError: (error: any) => {
      toast.error(error.message || "স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে");
    },
  });
};
