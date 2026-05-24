"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";

export const useAdminContacts = () => {
  return useQuery({
    queryKey: ["admin", "contacts"],
    queryFn: async () => {
      const res = await api.get(API_ROUTES.CONTACTS.BASE);
      return res.data.data;
    },
  });
};
