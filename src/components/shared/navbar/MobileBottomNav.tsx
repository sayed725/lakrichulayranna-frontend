"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Store, 
  LayoutGrid, 
  ShoppingBag, 
  User, 
  Truck, 
  LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";

export default function MobileBottomNav() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const { totalItems } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine user status and links
  const isLoggedIn = mounted ? isAuthenticated() : false;
  const userRole = isLoggedIn && user ? user.role : null;
  const profileHref = isLoggedIn
    ? userRole === "ADMIN"
      ? "/dashboard/admin/orders"
      : "/dashboard/customer/profile"
    : "/login";

  const navItems = [
    { id: "home", title: "হোম", href: "/", icon: Home },
    { id: "menu", title: "পণ্য সমূহ", href: "/products", icon: Store },
    { id: "cart", title: "কার্ট", href: "/cart", icon: ShoppingBag, badge: true },
    { 
      id: "orders",
      title: isLoggedIn && userRole === "ADMIN" ? "ড্যাশবোর্ড" : "আমার অর্ডার", 
      href: isLoggedIn 
        ? userRole === "ADMIN" 
          ? "/dashboard/admin" 
          : "/dashboard/customer/orders" 
        : "/my-orders", 
      icon: LayoutDashboard 
    },
    { 
      id: "profile",
      title: isLoggedIn && userRole !== "ADMIN" ? "প্রোফাইল" : isLoggedIn && userRole === "ADMIN" ? "অর্ডার" : "লগইন", 
      href: profileHref, 
      icon: !isLoggedIn 
        ? User 
        : userRole === "ADMIN" 
          ? Truck 
          : User
    },
  ];

  const cartCount = mounted ? totalItems() : 0;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-cream/95 dark:bg-charcoal/95 backdrop-blur-md border-t border-border/80 dark:border-border-dark/80 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] px-3 py-1 flex justify-around items-center transition-transform duration-300 ease-in-out md:hidden font-bengali safe-bottom",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        // Exact match for Home "/", prefix match for others to keep active state
        const isActive = item.href === "/" 
          ? pathname === "/" 
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "relative flex flex-col items-center justify-center flex-1 py-1 rounded-2xl transition-all duration-300 cursor-pointer",
              isActive 
                ? "text-fire font-bold scale-105" 
                : "text-charcoal/70 dark:text-cream/70 hover:text-fire dark:hover:text-fire"
            )}
          >
            <div className={cn(
              "p-1.5 rounded-xl transition-all duration-300",
              isActive ? "bg-fire/10 text-fire" : "bg-transparent"
            )}>
              <Icon className="w-5 h-5" />
            </div>
            
            <span className="text-[10px] sm:text-[11px] mt-0.5 tracking-wide">
              {item.title}
            </span>
            
            {/* Cart Badge */}
            {item.badge && cartCount > 0 && (
              <span className="absolute top-1 right-[20%] min-w-4 h-4 px-1 bg-fire text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-cream dark:ring-charcoal animate-scale-in">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
