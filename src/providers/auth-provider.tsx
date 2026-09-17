"use client";

import { useEffect, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { token, user, setUser, logout } = useAuthStore();

  const { data, isError } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const res = await api.get(API_ROUTES.AUTH.ME);
      return res.data;
    },
    enabled: !!token && !user,
    staleTime: 1000 * 60 * 15, // 15 mins
    retry: 1,
  });

  useEffect(() => {
    if (data?.data) {
      setUser(data.data);
    }
  }, [data, setUser]);

  useEffect(() => {
    if (isError) {
      logout();
    }
  }, [isError, logout]);

  return <>{children}</>;
}
