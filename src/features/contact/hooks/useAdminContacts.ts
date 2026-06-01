"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";

interface ContactQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  isRead?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const useAdminContacts = (params: ContactQueryParams = {}) => {
  const {
    page = 1,
    limit = 10,
    searchTerm,
    isRead,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;

  return useQuery({
    queryKey: ["admin", "contacts", page, searchTerm, isRead, sortBy, sortOrder],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (page) queryParams.append("page", page.toString());
      if (limit) queryParams.append("limit", limit.toString());
      if (searchTerm) queryParams.append("searchTerm", searchTerm);
      if (isRead !== undefined) queryParams.append("isRead", isRead.toString());
      if (sortBy) queryParams.append("sortBy", sortBy);
      if (sortOrder) queryParams.append("sortOrder", sortOrder);

      const res = await api.get(`${API_ROUTES.CONTACTS.BASE}?${queryParams.toString()}`);
      return res.data;
    },
  });
};
