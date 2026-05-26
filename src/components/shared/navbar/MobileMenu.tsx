"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function MobileMenu({ id }: { id?: string }) {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isMobileMenuOpen, closeMenu } = useUIStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoggedIn = mounted ? isAuthenticated() : false;

  // Dynamic links based on login role
  const navLinks = [...NAV_LINKS];
  if (isLoggedIn && user) {
    if (user.role === "ADMIN") {
      navLinks.push({ label: "Dashboard", labelBn: "ড্যাশবোর্ড", href: "/dashboard/admin" });
    } else {
      navLinks.push({ label: "My Order", labelBn: "আমার অর্ডার", href: "/dashboard/customer/orders" });
    }
  }

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-charcoal/40 backdrop-blur-sm md:hidden"
            onClick={closeMenu}
          />

          {/* Menu Panel */}
          <motion.div
            id={id}
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
            className="fixed top-[var(--nav-height)] left-0 right-0 z-35 md:hidden bg-cream border-b border-border shadow-xl max-h-[calc(100vh-var(--nav-height))] overflow-y-auto"
          >
            <div className="p-6 space-y-2">
              {/* Nav Links */}
              {navLinks.map((link, index) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className={cn(
                        "flex items-center justify-between px-4 py-3.5 rounded-xl font-bengali text-lg font-medium transition-all duration-200",
                        isActive
                          ? "bg-fire/10 text-fire"
                          : "text-charcoal hover:bg-fire/5 hover:text-fire"
                      )}
                    >
                      <span>{link.labelBn}</span>
                      <span className="text-sm text-muted font-latin">
                        {link.label}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}

              {/* Divider */}
              <div className="py-2">
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              </div>

              {/* Auth Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                {isLoggedIn && user ? (
                  <>
                    <Link
                      href={
                        user.role === "ADMIN"
                          ? "/dashboard/admin"
                          : "/dashboard/customer"
                      }
                      onClick={closeMenu}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-charcoal/5 hover:bg-charcoal/10 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-full bg-fire/10 flex items-center justify-center">
                        <User size={18} className="text-fire" />
                      </div>
                      <div>
                        <p className="font-medium font-bengali text-charcoal">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted">{user.email}</p>
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        closeMenu();
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-error hover:bg-error/5 transition-colors cursor-pointer"
                    >
                      <LogOut size={18} />
                      <span className="font-bengali font-medium">
                        লগআউট
                      </span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3 pt-2">
                    <Link
                      href="/login"
                      onClick={closeMenu}
                      className="w-full text-center px-4 py-3.5 rounded-xl text-white font-bold font-bengali bg-fire hover:bg-fire-dark shadow-sm transition-colors"
                    >
                      লগইন করুন
                    </Link>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
