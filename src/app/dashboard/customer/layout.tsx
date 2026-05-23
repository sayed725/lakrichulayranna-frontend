"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  User as UserIcon, 
  Star, 
  LayoutDashboard,
  X
} from "lucide-react";
import { Logo } from "@/components/shared/logo/Logo";
import { Topbar } from "@/components/dashboard/Topbar";

const CUSTOMER_LINKS = [
  { name: "ওভারভিউ", href: "/dashboard/customer", icon: LayoutDashboard },
  { name: "আমার অর্ডার", href: "/dashboard/customer/orders", icon: ShoppingBag },
  { name: "প্রোফাইল", href: "/dashboard/customer/profile", icon: UserIcon },
  { name: "আমার রিভিউ", href: "/dashboard/customer/reviews", icon: Star },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <div className="flex flex-col gap-2">
      {CUSTOMER_LINKS.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bengali font-semibold transition-all ${
              isActive
                ? "bg-fire text-white shadow-md shadow-fire/20"
                : "text-muted hover:bg-fire/10 hover:text-fire"
            }`}
          >
            <link.icon size={20} />
            {link.name}
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-border fixed h-screen z-20">
        <div className="p-6 border-b border-border flex items-center justify-center">
          <Logo size="sm" />
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <NavLinks />
        </div>
      </aside>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-charcoal/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-4/5 max-w-sm bg-white shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <Logo size="sm" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-charcoal hover:bg-cream rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <NavLinks onClick={() => setIsMobileMenuOpen(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen min-w-0 lg:ml-72 bg-cream">
        <Topbar onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        <div className="flex-1 p-4 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
