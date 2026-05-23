import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import api, { type ApiError } from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";

export const useRegister = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (userData: any) => {
      const res = await api.post(API_ROUTES.AUTH.REGISTER, userData);
      return res.data;
    },
    onSuccess: (data) => {
      const { user, token, accessToken } = data.data;
      setAuth(user, token || accessToken);
      toast.success("অ্যাকাউন্ট তৈরি সফল হয়েছে!");
      router.push(user.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/customer");
      router.refresh();
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "অ্যাকাউন্ট তৈরি ব্যর্থ হয়েছে");
    },
  });
};
