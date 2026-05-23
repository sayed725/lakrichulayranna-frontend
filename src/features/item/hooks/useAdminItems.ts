"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";
import { toast } from "sonner";

export const useAdminItems = () => {
  return useQuery({
    queryKey: ["admin", "items"],
    queryFn: async () => {
      const res = await api.get(API_ROUTES.ADMIN.ITEMS);
      return res.data.data;
    },
  });
};

export const useToggleItemAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, isAvailable }: { itemId: string; isAvailable: boolean }) => {
      const res = await api.patch(`${API_ROUTES.ADMIN.ITEMS}/${itemId}/toggle-availability`, { isAvailable });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "items"] });
      toast.success("আইটেমের প্রাপ্যতা আপডেট করা হয়েছে");
    },
    onError: (error: any) => {
      toast.error(error.message || "আপডেট করতে সমস্যা হয়েছে");
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      const res = await api.delete(`${API_ROUTES.ADMIN.ITEMS}/${itemId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "items"] });
      toast.success("আইটেমটি মুছে ফেলা হয়েছে");
    },
    onError: (error: any) => {
      toast.error(error.message || "মুছে ফেলতে সমস্যা হয়েছে");
    },
  });
};
