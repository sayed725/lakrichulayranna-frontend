import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api, { type ApiError } from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";
import { useCartStore } from "@/store/cart.store";
import { useCouponStore } from "@/store/coupon.store";
import { useAuthStore } from "@/store/auth.store";

export const usePlaceOrder = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearCart = useCartStore((state) => state.clearCart);
  const clearCoupon = useCouponStore((state) => state.clearCoupon);
  const { user } = useAuthStore();

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
      
      // Store orderNumber in localStorage for guest users
      if (!user && data.orderNumber) {
        const existingOrders = JSON.parse(localStorage.getItem("guestOrders") || "[]");
        if (!existingOrders.includes(data.orderNumber)) {
          existingOrders.unshift(data.orderNumber); // Add to beginning
          localStorage.setItem("guestOrders", JSON.stringify(existingOrders));
        }
      }
      
      // Redirect to my orders page if user is logged in, otherwise to success page
      // Use window.location.href to ensure redirect happens immediately
      if (user) {
        window.location.href = "/dashboard/customer/orders";
      } else {
        window.location.href = `/order-success?orderNumber=${data.orderNumber}`;
      }
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "অর্ডার প্লেস করতে সমস্যা হয়েছে");
    },
  });
};
