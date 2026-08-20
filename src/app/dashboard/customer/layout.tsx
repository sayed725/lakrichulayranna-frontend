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

const CUSTOMER_LINKS = [
  { name: "ওভারভিউ", href: "/dashboard/customer", icon: LayoutDashboard },
  { name: "আমার অর্ডার", href: "/dashboard/customer/orders", icon: ShoppingBag },
  { name: "প্রোফাইল", href: "/dashboard/customer/profile", icon: UserIcon },
  { name: "আমার রিভিউ", href: "/dashboard/customer/reviews", icon: Star },
];

function CustomerSidebarLinks({ pathname }: { pathname: string }) {
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarMenu className="gap-1">
      {CUSTOMER_LINKS.map((link) => {
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

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
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
                <CustomerSidebarLinks pathname={pathname} />
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
