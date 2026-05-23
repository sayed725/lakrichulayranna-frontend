"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";
import { toast } from "sonner";

export const useAdminCategories = () => {
  return useQuery({
    queryKey: ["admin", "categories"],
    queryFn: async () => {
      const res = await api.get(API_ROUTES.ADMIN.CATEGORIES);
      return res.data.data;
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryId: string) => {
      const res = await api.delete(`${API_ROUTES.ADMIN.CATEGORIES}/${categoryId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      toast.success("ক্যাটাগরি মুছে ফেলা হয়েছে");
    },
    onError: (error: any) => {
      toast.error(error.message || "মুছে ফেলতে সমস্যা হয়েছে");
    },
  });
};
