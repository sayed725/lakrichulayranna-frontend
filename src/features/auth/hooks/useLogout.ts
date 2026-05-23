import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";

export const useLogout = () => {
  const router = useRouter();
  const logoutStore = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.post(API_ROUTES.AUTH.LOGOUT);
    },
    onSettled: () => {
      // Regardless of success/fail, clean up local state
      logoutStore();
      queryClient.clear();
      toast.success("সফলভাবে লগআউট হয়েছে");
      router.push("/");
    },
  });
};
