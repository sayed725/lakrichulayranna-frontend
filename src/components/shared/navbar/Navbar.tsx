"use client";

import { useEffect, useState, useSyncExternalStore, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, User, LogOut } from "lucide-react";
import { Logo } from "@/components/shared/logo/Logo";
import { Container } from "@/components/shared/container/Container";
import { MobileMenu } from "@/components/shared/navbar/MobileMenu";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { useUIStore } from "@/store/ui.store";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const subscribeToHydration = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const mounted = useSyncExternalStore(
    subscribeToHydration,
    getClientSnapshot,
    getServerSnapshot
  );
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const cartItemCount = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const { toggleCart, isMobileMenuOpen, toggleMenu, closeMenu } = useUIStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const cartCount = mounted ? cartItemCount : 0;
  const isLoggedIn = mounted ? isAuthenticated() : false;

  // Dynamic links based on login role
  const navLinks = [...NAV_LINKS];
  if (isLoggedIn && user) {
    if (user.role === "ADMIN") {
      navLinks.push({ label: "Dashboard", labelBn: "ড্যাশবোর্ড", href: "/dashboard/admin" });
    } else {
      navLinks.push({ label: "My Order", labelBn: "আমার অর্ডার", href: "/dashboard/customer/orders" });
    }
  } else {
    // Guest users - add link to view their orders from localStorage
    navLinks.push({ label: "My Order", labelBn: "আমার অর্ডার", href: "/my-orders" });
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          scrolled
            ? "bg-cream/50 backdrop-blur-sm"
            : "bg-cream/50 backdrop-blur-sm"
        )}
      >
        <Container>
          <nav aria-label="মূল নেভিগেশন" className="flex items-center justify-between h-[var(--nav-height)]">
            {/* Logo */}
            <Logo size="sm" />

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium font-bengali rounded-lg transition-all duration-200",
                      isActive
                        ? "text-fire"
                        : "text-charcoal hover:text-fire hover:bg-fire/5"
                    )}
                  >
                    {link.labelBn}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-fire" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right side: Cart + Auth */}
            <div className="flex items-center gap-2">
              {/* Cart Button */}
              <button
                onClick={toggleCart}
                className="relative p-2.5 rounded-xl hover:bg-fire/5 transition-colors duration-200 group cursor-pointer"
                aria-label="Open cart"
              >
                <ShoppingBag
                  size={22}
                  className="text-charcoal group-hover:text-fire transition-colors"
                />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 flex items-center justify-center text-[11px] font-bold text-white bg-fire rounded-full ring-2 ring-cream animate-scale-in">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>

              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex items-center gap-2 ml-1 relative" ref={dropdownRef}>
                {isLoggedIn && user ? (
                  <div className="relative">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center justify-center w-10 h-10 rounded-full border border-border hover:border-fire transition-all duration-200 cursor-pointer overflow-hidden shadow-sm hover:shadow-fire/10 focus:outline-none"
                      aria-label="Toggle user menu"
                      aria-expanded={dropdownOpen}
                    >
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=E85D24&color=fff&bold=true`}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-64 bg-cream border border-border rounded-2xl shadow-xl py-3 z-50 animate-scale-in">
                        {/* Name and Email */}
                        <div className="px-4 pb-3 border-b border-border">
                          <p className="font-semibold text-charcoal font-bengali text-sm truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-muted truncate mt-0.5">
                            {user.email}
                          </p>
                        </div>

                        {/* Dropdown Options */}
                        <div className="p-1.5 space-y-0.5">
                          <Link
                            href={
                              user.role === "ADMIN"
                                ? "/dashboard/admin"
                                : "/dashboard/customer"
                            }
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium font-bengali text-charcoal hover:bg-fire/5 hover:text-fire transition-all duration-150"
                          >
                            <User size={16} />
                            <span>ড্যাশবোর্ড</span>
                          </Link>
                          
                          <button
                            onClick={() => {
                              setDropdownOpen(false);
                              logout();
                              window.location.href = "/";
                            }}
                            className="flex items-center gap-2.5 w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium font-bengali text-error hover:bg-error/5 transition-all duration-150 cursor-pointer"
                          >
                            <LogOut size={16} />
                            <span>লগআউট</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      href="/login"
                      className="px-5 py-2.5 text-sm font-bold font-bengali text-white bg-fire hover:bg-fire-dark rounded-xl shadow-sm transition-colors"
                    >
                      লগইন করুন
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className="md:hidden p-2.5 rounded-xl hover:bg-fire/5 transition-colors cursor-pointer"
                aria-label={isMobileMenuOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? (
                  <X size={22} className="text-charcoal" />
                ) : (
                  <Menu size={22} className="text-charcoal" />
                )}
              </button>
            </div>
          </nav>
        </Container>
      </header>

      {/* Mobile Menu */}
      <MobileMenu id="mobile-menu" />

      {/* Spacer for fixed navbar */}
      <div className="h-[var(--nav-height)]" />
    </>
  );
}
