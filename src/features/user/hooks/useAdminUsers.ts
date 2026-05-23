"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const res = await api.get(API_ROUTES.ADMIN.USERS);
      return res.data.data;
    },
  });
};
