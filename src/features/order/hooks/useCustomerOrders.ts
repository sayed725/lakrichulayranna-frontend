"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";

export const useCustomerOrders = () => {
  return useQuery({
    queryKey: ["customer", "orders"],
    queryFn: async () => {
      const res = await api.get(API_ROUTES.ORDERS.MY_ORDERS);
      return res.data.data;
    },
  });
};

export const useCustomerOrder = (id: string) => {
  return useQuery({
    queryKey: ["customer", "order", id],
    queryFn: async () => {
      const res = await api.get(API_ROUTES.ORDERS.BY_ID(id));
      return res.data.data;
    },
    enabled: !!id,
  });
};

export const usePublicOrder = (orderNumber: string) => {
  return useQuery({
    queryKey: ["public", "order", orderNumber],
    queryFn: async () => {
      const res = await api.get(API_ROUTES.ORDERS.BY_ORDER_NUMBER(orderNumber));
      return res.data.data;
    },
    enabled: !!orderNumber,
  });
};
