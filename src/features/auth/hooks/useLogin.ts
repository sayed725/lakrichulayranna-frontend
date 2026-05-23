import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import api, { type ApiError } from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";

export const useLogin = (callbackUrl?: string) => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (credentials: any) => {
      const res = await api.post(API_ROUTES.AUTH.LOGIN, credentials);
      return res.data;
    },
    onSuccess: (data) => {
      const { user, token, accessToken } = data.data;
      setAuth(user, token || accessToken);
      toast.success("লগইন সফল হয়েছে!");

      // Use a hard navigation so the browser sends a fresh HTTP request
      // that includes the token cookie — the server-side proxy needs it.
      const redirectTo = callbackUrl
        ? callbackUrl
        : user.role === "ADMIN"
        ? "/dashboard/admin"
        : "/dashboard/customer";

      window.location.href = redirectTo;
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "লগইন ব্যর্থ হয়েছে");
    },
  });
};
