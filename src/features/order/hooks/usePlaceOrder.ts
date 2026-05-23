import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api, { type ApiError } from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";
import { useCartStore } from "@/store/cart.store";
import { useCouponStore } from "@/store/coupon.store";

export const usePlaceOrder = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearCart = useCartStore((state) => state.clearCart);
  const clearCoupon = useCouponStore((state) => state.clearCoupon);

  return useMutation({
    mutationFn: async (orderData: any) => {
      const res = await api.post(API_ROUTES.ORDERS.BASE, orderData);
      return res.data.data;
    },
    onSuccess: (data) => {
      toast.success("অর্ডার সফলভাবে প্লেস করা হয়েছে!");
      clearCart();
      clearCoupon();
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      // Redirect to success page with order number
      router.push(`/order-success?orderNumber=${data.orderNumber}`);
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "অর্ডার প্লেস করতে সমস্যা হয়েছে");
    },
  });
};
