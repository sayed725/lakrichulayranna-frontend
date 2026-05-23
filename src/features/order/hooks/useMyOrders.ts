import { useQuery } from "@tanstack/react-query";
import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";

export const useMyOrders = () => {
  return useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const res = await api.get(API_ROUTES.ORDERS.MY_ORDERS);
      return Array.isArray(res.data.data) ? res.data.data : res.data.data?.orders || [];
    },
  });
};
