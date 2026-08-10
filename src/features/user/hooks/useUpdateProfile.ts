import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import api, { type ApiError } from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";

export const useUpdateProfile = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (profileData: { name: string; phone: string; address: string }) => {
      const res = await api.patch(API_ROUTES.USERS.PROFILE, profileData);
      return res.data;
    },
    onSuccess: (resData) => {
      const updatedUser = resData.data;
      setUser(updatedUser);
      toast.success("প্রোফাইল সফলভাবে আপডেট করা হয়েছে!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "প্রোফাইল আপডেট করতে সমস্যা হয়েছে");
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (passwordData: any) => {
      // Backend expects oldPassword and newPassword
      const payload = {
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      };
      const res = await api.patch(`${API_ROUTES.USERS.BASE}/change-password`, payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে");
    },
  });
};
