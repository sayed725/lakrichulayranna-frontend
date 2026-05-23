import { useMutation } from "@tanstack/react-query";
import api, { type ApiError } from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";
import { useCouponStore } from "@/store/coupon.store";
import { toast } from "sonner";

export const useValidateCoupon = () => {
  const setCoupon = useCouponStore((state) => state.setCoupon);

  return useMutation({
    mutationFn: async ({ code, subtotal }: { code: string; subtotal: number }) => {
      const res = await api.post(API_ROUTES.COUPONS.VALIDATE, { code, subtotal });
      return { data: res.data.data, subtotal };
    },
    onSuccess: ({ data, subtotal }) => {
      setCoupon(data, subtotal);
      toast.success("কুপন প্রয়োগ হয়েছে!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "কুপন সঠিক নয়");
    },
  });
};
