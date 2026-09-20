import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { env } from "@/config/env";
import { useAuthStore } from "@/store/auth.store";

// Types for standardized error responses
export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// Create axios instance
const api = axios.create({
  baseURL: env.API_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle token refresh & error standardization
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If 401 and not already retrying, attempt token refresh (except for login requests)
    const isLoginRequest = originalRequest.url?.includes("/auth/login");
    if (error.response?.status === 401 && !originalRequest._retry && !isLoginRequest) {
      if (isRefreshing) {
        // Queue the request while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${env.API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const { token } = response.data.data;

        // Update token in Zustand store and cookies
        useAuthStore.getState().setToken(token);

        processQueue(null, token);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Clear auth data in Zustand store, cookies & localStorage on refresh failure
        useAuthStore.getState().logout();

        if (typeof window !== "undefined") {
          const pathname = window.location.pathname;
          const isProtected = pathname.startsWith("/dashboard") || pathname.startsWith("/checkout");
          if (isProtected) {
            window.location.href = `/login?callbackUrl=${encodeURIComponent(pathname)}`;
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Helper function for user-friendly error messages
    let errorMessage = error.response?.data?.message;

    if (!errorMessage) {
      if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
        errorMessage = "সার্ভার প্রতিক্রিয়া জানাতে সময় নিচ্ছে। অনুগ্রহ করে আবার চেষ্টা করুন।";
      } else if (error.message === "Network Error" || !error.response) {
        errorMessage = "ইন্টারনেট সংযোগ বা সার্ভারে সমস্যা হচ্ছে। অনুগ্রহ করে আপনার নেটওয়ার্ক চেক করুন।";
      } else {
        errorMessage = error.message || "কিছু ভুল হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।";
      }
    }

    // Standardize error response
    const apiError: ApiError = {
      message: errorMessage,
      statusCode: error.response?.status || 500,
      errors: error.response?.data?.errors,
    };

    return Promise.reject(apiError);
  }
);

export default api;
