"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";
import { toast } from "sonner";

export const useAdminOrders = (params?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: string;
  paymentMethod?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  const {
    page = 1,
    limit = 10,
    searchTerm,
    status,
    paymentMethod,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params || {};

  return useQuery({
    queryKey: ["admin", "orders", page, limit, searchTerm, status, paymentMethod, sortBy, sortOrder],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("limit", limit.toString());
      
      if (searchTerm) queryParams.append("search", searchTerm);
      if (status && status !== "all" && status !== "ALL") queryParams.append("status", status);
      if (paymentMethod && paymentMethod !== "all") queryParams.append("paymentMethod", paymentMethod);
      if (sortBy) queryParams.append("sortBy", sortBy);
      if (sortOrder) queryParams.append("sortOrder", sortOrder);

      const url = `${API_ROUTES.ADMIN.ORDERS}?${queryParams.toString()}`;
      const res = await api.get(url);
      return res.data;
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

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const res = await api.delete(`${API_ROUTES.ADMIN.ORDERS}/${orderId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      toast.success("অর্ডার মুছে ফেলা হয়েছে");
    },
    onError: (error: any) => {
      toast.error(error.message || "অর্ডার মুছে ফেলতে সমস্যা হয়েছে");
    },
  });
};

export const useCreateManualOrder = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: any) => {
      const res = await api.post(API_ROUTES.ORDERS.BASE, orderData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      toast.success("ম্যানুয়াল অর্ডার তৈরি করা হয়েছে");
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.message || "অর্ডার তৈরি করতে সমস্যা হয়েছে");
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, data }: { orderId: string; data: any }) => {
      const res = await api.patch(`${API_ROUTES.ADMIN.ORDERS}/${orderId}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      toast.success("অর্ডার আপডেট করা হয়েছে");
    },
    onError: (error: any) => {
      toast.error(error.message || "অর্ডার আপডেট করতে সমস্যা হয়েছে");
    },
  });
};

export const useUpdateOrderItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, data }: { orderId: string; data: any }) => {
      const res = await api.put(`${API_ROUTES.ADMIN.ORDERS}/${orderId}/items`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      toast.success("অর্ডার আইটেমস আপডেট করা হয়েছে");
    },
    onError: (error: any) => {
      toast.error(error.message || "অর্ডার আইটেমস আপডেট করতে সমস্যা হয়েছে");
    },
  });
};
