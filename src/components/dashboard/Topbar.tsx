"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, User, LogOut, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { ADMIN_NAV_LINKS, DASHBOARD_NAV_LINKS } from "@/lib/constants";

interface TopbarProps {
  onMobileMenuToggle: () => void;
}

export function Topbar({ onMobileMenuToggle }: TopbarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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

  // Generate breadcrumbs
  const generateBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean);
    
    // Create an array of breadcrumb objects
    const breadcrumbs = paths.map((path, index) => {
      const href = "/" + paths.slice(0, index + 1).join("/");
      
      // Try to find a matching label from our constants
      let label = path.charAt(0).toUpperCase() + path.slice(1);
      let labelBn = label;

      const allLinks = [...ADMIN_NAV_LINKS, ...DASHBOARD_NAV_LINKS];
      const match = allLinks.find(link => link.href === href);
      
      if (match) {
        labelBn = match.labelBn;
      } else if (path === "dashboard") {
        labelBn = "ড্যাশবোর্ড";
      } else if (path === "admin") {
        labelBn = "অ্যাডমিন";
      } else if (path === "customer") {
        labelBn = "কাস্টমার";
      }

      let finalHref = href;
      if (path === "dashboard") {
        finalHref = user?.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/customer";
      }

      return { href: finalHref, label: labelBn, isLast: index === paths.length - 1 };
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-border bg-white px-4 shadow-sm sm:gap-6 sm:px-6 lg:px-8">
      {/* Mobile Menu Toggle */}
      <button
        onClick={onMobileMenuToggle}
        className="lg:hidden p-2 -ml-2 text-charcoal hover:bg-cream rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-fire/50"
        aria-label="Toggle Menu"
      >
        <Menu size={24} />
      </button>

      {/* Breadcrumbs (Left Side) */}
      <div className="flex-1 flex items-center overflow-hidden">
        <nav className="hidden sm:flex text-sm font-medium text-muted font-bengali" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            {breadcrumbs.map((crumb, index) => (
              <li key={`${crumb.href}-${index}`} className="flex items-center">
                {index > 0 && <ChevronRight size={16} className="mx-2 text-muted-light shrink-0" />}
                {crumb.isLast ? (
                  <span className="text-charcoal font-bold" aria-current="page">
                    {crumb.label}
                  </span>
                ) : (
                  <Link href={crumb.href} className="hover:text-fire transition-colors">
                    {crumb.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Right Side - Profile Dropdown */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-full border border-border p-1 pr-3 hover:border-fire transition-all focus:outline-none focus:ring-2 focus:ring-fire/50 bg-white"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-cream-dark">
              {user ? (
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=E85D24&color=fff&bold=true`}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-charcoal font-bold bg-cream-dark">
                  U
                </div>
              )}
            </div>
            <span className="text-sm font-semibold font-bengali text-charcoal hidden sm:block">
              {user?.name || "User"}
            </span>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-border rounded-xl shadow-xl py-2 z-50 animate-scale-in origin-top-right">
              <div className="px-4 py-2 border-b border-border">
                <p className="font-semibold text-charcoal font-bengali text-sm truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-muted truncate mt-0.5">
                  {user?.email}
                </p>
              </div>

              <div className="p-1.5">
                <Link
                  href="/"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium font-bengali text-charcoal hover:bg-cream transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  <User size={16} />
                  <span>হোম পেজ</span>
                </Link>
                
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                    window.location.href = "/login";
                  }}
                  className="flex items-center gap-2.5 w-full text-left px-3 py-2 mt-1 rounded-lg text-sm font-medium font-bengali text-error hover:bg-error/10 transition-colors"
                >
                  <LogOut size={16} />
                  <span>লগআউট</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
