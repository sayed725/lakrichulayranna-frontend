import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
  phone?: string;
  address?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      setUser: (user) => set({ user }),

      setToken: (token) => {
        set({ token });
        if (typeof window !== "undefined") {
          if (token) {
            document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`;
          } else {
            document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          }
        }
      },

      setAuth: (user, token) => {
        set({ user, token });
        if (typeof window !== "undefined") {
          document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`;
        }
      },

      logout: () => {
        set({ user: null, token: null });
        if (typeof window !== "undefined") {
          document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
      },

      isAuthenticated: () => {
        const { token, user } = get();
        return !!token && !!user;
      },

      isAdmin: () => {
        const { user } = get();
        return user?.role === "ADMIN";
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
