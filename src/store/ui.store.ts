import { create } from "zustand";

interface UIState {
  isCartOpen: boolean;
  isMobileMenuOpen: boolean;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleMenu: () => void;
  openMenu: () => void;
  closeMenu: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isCartOpen: false,
  isMobileMenuOpen: false,

  toggleCart: () =>
    set((state) => ({
      isCartOpen: !state.isCartOpen,
      isMobileMenuOpen: false, // Close menu when cart opens
    })),

  openCart: () => set({ isCartOpen: true, isMobileMenuOpen: false }),

  closeCart: () => set({ isCartOpen: false }),

  toggleMenu: () =>
    set((state) => ({
      isMobileMenuOpen: !state.isMobileMenuOpen,
      isCartOpen: false, // Close cart when menu opens
    })),

  openMenu: () => set({ isMobileMenuOpen: true, isCartOpen: false }),

  closeMenu: () => set({ isMobileMenuOpen: false }),
}));
