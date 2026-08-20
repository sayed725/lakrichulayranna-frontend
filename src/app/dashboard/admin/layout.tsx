"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  UtensilsCrossed, 
  Tags, 
  Image as ImageIcon, 
  Ticket, 
  Star, 
  Users, 
  Settings,
  LogOut,
  Menu,
  X,
  Mail
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { Logo } from "@/components/shared/logo/Logo";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";

const ADMIN_LINKS = [
  { name: "ওভারভিউ", href: "/dashboard/admin", icon: LayoutDashboard },
  { name: "অর্ডারসমূহ", href: "/dashboard/admin/orders", icon: ShoppingBag },
  { name: "আইটেমসমূহ", href: "/dashboard/admin/items", icon: UtensilsCrossed },
  { name: "ক্যাটাগরি", href: "/dashboard/admin/categories", icon: Tags },
  { name: "ব্যানার", href: "/dashboard/admin/banners", icon: ImageIcon },
  { name: "কুপন", href: "/dashboard/admin/coupons", icon: Ticket },
  { name: "রিভিউ", href: "/dashboard/admin/reviews", icon: Star },
  { name: "ব্যবহারকারী", href: "/dashboard/admin/users", icon: Users },
  { name: "যোগাযোগ", href: "/dashboard/admin/contacts", icon: Mail },
  { name: "সেটিংস", href: "/dashboard/admin/settings", icon: Settings },
];

function AdminSidebarLinks({ pathname }: { pathname: string }) {
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarMenu className="gap-1">
      {ADMIN_LINKS.map((link) => {
        const isActive = pathname === link.href;
        return (
          <SidebarMenuItem key={link.name}>
            <Link
              href={link.href}
              onClick={() => setOpenMobile(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bengali font-semibold transition-all ${
                isActive
                  ? "bg-fire text-white shadow-md shadow-fire/20"
                  : "text-muted hover:bg-fire/10 hover:text-fire"
              }`}
            >
              <link.icon size={20} className="shrink-0" />
              <span className="font-bengali">{link.name}</span>
            </Link>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-cream flex w-full">
        {/* Sidebar */}
        <Sidebar className="border-r border-border bg-white" collapsible="icon">
          <SidebarHeader className="p-6 border-b border-border flex items-center justify-center bg-white shrink-0">
            <Logo size="sm" />
          </SidebarHeader>
          
          <SidebarContent className="p-4 bg-white">
            <SidebarGroup className="p-0">
              <SidebarGroupContent>
                <AdminSidebarLinks pathname={pathname} />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen min-w-0 bg-cream">
          <Topbar />
          <main className="flex-1 p-4 sm:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
