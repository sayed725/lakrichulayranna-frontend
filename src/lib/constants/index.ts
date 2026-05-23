// ═══════════════════════════════════════════════
// API Route Constants
// Maps to backend: /api/v1/*
// ═══════════════════════════════════════════════

export const API_ROUTES = {
  // Auth
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh-token",
    ME: "/auth/me",
  },

  // Users
  USERS: {
    BASE: "/users",
    BY_ID: (id: string) => `/users/${id}`,
    PROFILE: "/users/profile",
  },

  // Categories
  CATEGORIES: {
    BASE: "/categories",
    BY_ID: (id: string) => `/categories/${id}`,
    BY_SLUG: (slug: string) => `/categories/slug/${slug}`,
  },

  // Items (Menu)
  ITEMS: {
    BASE: "/items",
    BY_ID: (id: string) => `/items/${id}`,
    BY_SLUG: (slug: string) => `/items/slug/${slug}`,
    FEATURED: "/items?isFeatured=true",
  },

  // Orders
  ORDERS: {
    BASE: "/orders",
    BY_ID: (id: string) => `/orders/${id}`,
    MY_ORDERS: "/orders/my-orders",
    INVOICE: (id: string) => `/orders/${id}/invoice`,
  },

  // Coupons
  COUPONS: {
    BASE: "/coupons",
    VALIDATE: "/coupons/validate",
    BY_CODE: (code: string) => `/coupons/code/${code}`,
  },

  // Reviews
  REVIEWS: {
    BASE: "/reviews",
    BY_ITEM: (itemId: string) => `/reviews/item/${itemId}`,
  },

  // Banners
  BANNERS: {
    BASE: "/banners",
    ACTIVE: "/banners?isActive=true",
  },

  // Settings
  SETTINGS: {
    BASE: "/settings",
  },

  // Admin – maps to the same backend routes; admin access is enforced server-side via middleware
  ADMIN: {
    ORDERS: "/orders",
    ITEMS: "/items",
    CATEGORIES: "/categories",
    BANNERS: "/banners",
    COUPONS: "/coupons",
    REVIEWS: "/reviews",
    USERS: "/users",
  },
} as const;

// ═══════════════════════════════════════════════
// Navigation Links
// ═══════════════════════════════════════════════

export interface NavLink {
  label: string;
  labelBn: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Home", labelBn: "হোম", href: "/" },
  { label: "Menu", labelBn: "মেনু", href: "/menu" },
  { label: "About", labelBn: "আমাদের সম্পর্কে", href: "/about" },
  { label: "Contact", labelBn: "যোগাযোগ", href: "/contact" },
];

export const DASHBOARD_NAV_LINKS: NavLink[] = [
  { label: "Orders", labelBn: "অর্ডার", href: "/dashboard/customer/orders" },
  { label: "Profile", labelBn: "প্রোফাইল", href: "/dashboard/customer/profile" },
];

export const ADMIN_NAV_LINKS: NavLink[] = [
  { label: "Dashboard", labelBn: "ড্যাশবোর্ড", href: "/dashboard/admin" },
  { label: "Orders", labelBn: "অর্ডার", href: "/dashboard/admin/orders" },
  { label: "Menu Items", labelBn: "মেনু আইটেম", href: "/dashboard/admin/items" },
  { label: "Categories", labelBn: "ক্যাটাগরি", href: "/dashboard/admin/categories" },
  { label: "Coupons", labelBn: "কুপন", href: "/dashboard/admin/coupons" },
  { label: "Banners", labelBn: "ব্যানার", href: "/dashboard/admin/banners" },
  { label: "Users", labelBn: "ব্যবহারকারী", href: "/dashboard/admin/users" },
  { label: "Settings", labelBn: "সেটিংস", href: "/dashboard/admin/settings" },
];

// ═══════════════════════════════════════════════
// Order Status Labels & Colors
// ═══════════════════════════════════════════════

export type OrderStatusKey =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "DELIVERED"
  | "CANCELLED";

interface StatusConfig {
  label: string;
  labelBn: string;
  color: string;
  bgColor: string;
  textColor: string;
}

export const ORDER_STATUS: Record<OrderStatusKey, StatusConfig> = {
  PENDING: {
    label: "Pending",
    labelBn: "অপেক্ষমাণ",
    color: "#F59E0B",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    textColor: "text-amber-700 dark:text-amber-400",
  },
  CONFIRMED: {
    label: "Confirmed",
    labelBn: "নিশ্চিত",
    color: "#3B82F6",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    textColor: "text-blue-700 dark:text-blue-400",
  },
  PREPARING: {
    label: "Preparing",
    labelBn: "প্রস্তুত হচ্ছে",
    color: "#E85D24",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    textColor: "text-orange-700 dark:text-orange-400",
  },
  READY: {
    label: "Ready",
    labelBn: "প্রস্তুত",
    color: "#8B5CF6",
    bgColor: "bg-violet-100 dark:bg-violet-900/30",
    textColor: "text-violet-700 dark:text-violet-400",
  },
  DELIVERED: {
    label: "Delivered",
    labelBn: "ডেলিভারি সম্পন্ন",
    color: "#22C55E",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    textColor: "text-green-700 dark:text-green-400",
  },
  CANCELLED: {
    label: "Cancelled",
    labelBn: "বাতিল",
    color: "#EF4444",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    textColor: "text-red-700 dark:text-red-400",
  },
} as const;

// ═══════════════════════════════════════════════
// Payment Method Labels
// ═══════════════════════════════════════════════

export const PAYMENT_METHODS = {
  COD: { label: "Cash on Delivery", labelBn: "ক্যাশ অন ডেলিভারি" },
  ONLINE: { label: "Online Payment", labelBn: "অনলাইন পেমেন্ট" },
} as const;

export const PAYMENT_STATUS = {
  PENDING: { label: "Pending", labelBn: "অপেক্ষমাণ" },
  PAID: { label: "Paid", labelBn: "পরিশোধিত" },
  FAILED: { label: "Failed", labelBn: "ব্যর্থ" },
} as const;
