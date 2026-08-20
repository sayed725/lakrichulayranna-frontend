"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/shared/logo/Logo";
import { Container } from "@/components/shared/container/Container";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Menu,
  LogOut,
  LayoutDashboard,
  Truck,
  Home,
  Package,
  ChevronRight,
  X,
  ShoppingBag,
  BookOpen,
  ClipboardListIcon,
  Flame,
  Candy,
  Pizza,
  Coffee,
  ChevronDown,
  Utensils,
  Store,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { useUIStore } from "@/store/ui.store";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@/services/category.service";
import Image from "next/image";
import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";

interface NavSubItem {
  title: string;
  href: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  image?: string;
}

interface NavItem {
  title: string;
  titleBn: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems?: NavSubItem[];
}

const subscribeToHydration = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const mounted = useSyncExternalStore(
    subscribeToHydration,
    getClientSnapshot,
    getServerSnapshot
  );

  const { user, isAuthenticated, logout } = useAuthStore();
  const cartItemCount = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const { toggleCart } = useUIStore();

  const cartCount = mounted ? cartItemCount : 0;
  const isLoggedIn = mounted ? isAuthenticated() : false;
  const userRole = isLoggedIn && user ? user.role : null;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch categories for mega menu matching the menu page query
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get(API_ROUTES.CATEGORIES.BASE);
      return res.data.data;
    },
  });

  const rawCategories = Array.isArray(categoriesData) 
    ? (categoriesData as Category[])
    : (categoriesData as any)?.categories || [];

  const categories: NavSubItem[] = rawCategories.map((cat: Category) => {
    const lowerName = cat.name.toLowerCase();
    let Icon = Package;
    if (lowerName.includes('spic') || lowerName.includes('hot') || lowerName.includes('ঝাল')) Icon = Flame;
    else if (lowerName.includes('sweet') || lowerName.includes('dessert') || lowerName.includes('মিষ্টি')) Icon = Candy;
    else if (lowerName.includes('drink') || lowerName.includes('beverage') || lowerName.includes('চা') || lowerName.includes('কফি')) Icon = Coffee;
    else if (lowerName.includes('pizza') || lowerName.includes('combo') || lowerName.includes('খিচুড়ি')) Icon = Pizza;
    
    return {
      title: cat.name,
      href: `/products?category.name=${encodeURIComponent(cat.name)}`,
      description: cat.description || `${cat.name} এর চমৎকার স্বাদ নিন`,
      icon: Icon,
      image: cat.imageUrl
    };
  });

  const menuItems: NavItem[] = [
    { title: "Home", titleBn: "হোম", href: "/", icon: Home },
    { 
      title: "Products", 
      titleBn: "পণ্য সমূহ",
      href: "/products", 
      icon: Store,
      subItems: categories.length > 0 ? categories : undefined
    },
    { 
      title: "My Orders", 
      titleBn: isLoggedIn && userRole === "ADMIN" ? "ড্যাশবোর্ড" : "আমার অর্ডার", 
      href: isLoggedIn 
        ? userRole === "ADMIN" 
          ? "/dashboard/admin" 
          : "/dashboard/customer/orders" 
        : "/my-orders", 
      icon: LayoutDashboard 
    },
    { title: "About", titleBn: "আমাদের সম্পর্কে", href: "/about", icon: BookOpen },
    { title: "Contact", titleBn: "যোগাযোগ", href: "/contact", icon: ClipboardListIcon },
  ];

  const userInitial =
    user?.name?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "?";

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const closeMobileMenu = () => setIsOpen(false);

  const dashboardHref = userRole === "ADMIN" ? "/dashboard/admin" : "/dashboard/customer/orders";

  return (
    <nav
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-500 border-b py-2.5 lg:py-2.5",
        isScrolled
          ? "bg-cream/90 backdrop-blur-xl border-border/80 shadow-md shadow-charcoal/[0.03]"
          : "bg-cream/40 backdrop-blur-md border-transparent"
      )}
    >
      {/* Subtle ambient gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-fire/[0.03] via-transparent to-terracotta/[0.03] pointer-events-none" />

      <Container className="relative z-10">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between w-full">
          {/* Logo */}
          <Logo size="sm" />

          {/* Desktop Navigation */}
          <div className="flex items-center gap-6 lg:gap-8 flex-1 justify-center">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/");
              
              if (item.subItems) {
                return (
                  <div key={item.title} className="relative group/navItem flex items-center h-full py-2">
                    <Link
                      href={item.href}
                      className={cn(
                        "relative flex items-center gap-1 text-sm font-medium font-bengali transition-colors hover:text-fire",
                        isActive
                          ? "text-fire font-bold"
                          : "text-charcoal/90 hover:text-fire",
                        "after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-fire after:transition-all after:duration-300 hover:after:w-full",
                        isActive && "after:w-full"
                      )}
                    >
                      {item.titleBn}
                      {/* <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover/navItem:rotate-180 text-charcoal/50 group-hover/navItem:text-fire" /> */}
                    </Link>

                    {/* Mega Menu Dropdown */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 translate-y-2 pointer-events-none group-hover/navItem:opacity-100 group-hover/navItem:translate-y-0 group-hover/navItem:pointer-events-auto transition-all duration-300 z-50">
                      <div className="w-[700px] rounded-2xl border border-border bg-cream/95 backdrop-blur-xl shadow-xl overflow-hidden flex flex-col">
                        <div className="grid grid-cols-3 gap-2 p-4">
                          {item.subItems.map((sub) => {
                            const SubIcon = sub.icon;
                            return (
                              <Link
                                key={sub.title}
                                href={sub.href}
                                className="flex items-start gap-3 p-3 rounded-xl hover:bg-fire/5 transition-colors group/sub"
                              >
                                <div className="relative shrink-0 w-12 h-12 rounded-lg overflow-hidden border border-border">
                                  {sub.image ? (
                                    <Image 
                                      src={sub.image} 
                                      alt={sub.title} 
                                      fill 
                                      sizes="48px"
                                      className="object-cover group-hover/sub:scale-110 transition-transform duration-500" 
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-fire/10 flex items-center justify-center text-fire">
                                      <SubIcon className="w-5 h-5" />
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-sm text-charcoal font-bengali group-hover/sub:text-fire transition-colors truncate">{sub.title}</p>
                                  <p className="text-xs text-charcoal/60 font-bengali mt-0.5 line-clamp-1">{sub.description}</p>
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={item.href} className="flex items-center h-full py-2">
                  <Link
                    href={item.href}
                    className={cn(
                      "relative text-sm font-medium font-bengali transition-colors hover:text-fire",
                      isActive
                        ? "text-fire font-bold"
                        : "text-charcoal/90 hover:text-fire",
                      "after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-fire after:transition-all after:duration-300 hover:after:w-full",
                      isActive && "after:w-full"
                    )}
                  >
                    {item.titleBn}
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Desktop Right Side */}
          <div className="flex items-center gap-3">
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

            {!mounted ? (
              <div className="h-10 w-10 bg-cream-dark rounded-full animate-pulse" />
            ) : isLoggedIn && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full p-0 ring-2 ring-fire hover:ring-fire-dark transition-all duration-300"
                    />
                  }
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=E85D24&color=fff&bold=true`}
                      alt={user.name} 
                      className="object-cover" 
                    />
                    <AvatarFallback className="bg-gradient-to-br from-fire to-terracotta text-white font-bold text-sm">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-60 mt-2 rounded-2xl border border-border bg-cream p-2 shadow-xl"
                >
                  <DropdownMenuLabel className="font-normal px-3 py-3 border-b border-border mb-1">
                    <p className="font-bold text-sm text-charcoal truncate">{user.name}</p>
                    <p className="text-xs text-muted truncate mt-0.5">{user.email}</p>
                  </DropdownMenuLabel>

                  <DropdownMenuItem
                    render={<Link href={dashboardHref} className="flex items-center w-full font-bengali" />}
                    className="cursor-pointer rounded-xl px-3 py-2.5 focus:bg-fire/5 focus:text-fire"
                  >
                    {userRole === "ADMIN" ? (
                      <><LayoutDashboard className="mr-2.5 h-4 w-4 text-fire" /> অ্যাডমিন ড্যাশবোর্ড</>
                    ) : (
                      <><Truck className="mr-2.5 h-4 w-4 text-fire" /> অর্ডার ট্র্যাক করুন</>
                    )}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem
                    className="text-error focus:bg-error/5 cursor-pointer rounded-xl px-3 py-2.5 font-bengali"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2.5 h-4 w-4" />
                    লগআউট
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button nativeButton={false} render={<Link href="/login" />} className="bg-gradient-to-r from-fire to-terracotta hover:from-fire-dark hover:to-terracotta-dark text-white rounded-xl shadow-lg hover:shadow-fire/25 transition-all duration-300 font-bold text-sm px-6 h-10 hover:scale-105 border-0 font-bengali">
                লগইন
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Header */}
        <div className="flex md:hidden items-center justify-between w-full">
          {/* Left: Hamburger menu */}
          <div className="flex-1 flex justify-start">
            {mounted && (
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl border border-border bg-cream/60 hover:bg-fire/5 hover:border-fire/30 transition-all duration-300"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                } />
                <SheetContent side="left" className="w-[85vw] sm:w-[400px] p-0 flex flex-col bg-cream border-r border-border" showCloseButton={false}>
                  <SheetHeader className="p-4 border-b border-border flex flex-row items-center justify-between space-y-0">
                    <SheetTitle className="sr-only">মোবাইল নেভিগেশন মেনু</SheetTitle>
                    <SheetDescription className="sr-only">ন্যাভিগেশন লিংক এবং অ্যাকাউন্ট সেটিংস অ্যাক্সেস করুন।</SheetDescription>
                    <Logo size="sm" />
                    <SheetClose className="rounded-xl p-2 hover:bg-fire/5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-fire border border-transparent hover:border-fire/10">
                      <X className="h-5 w-5 text-charcoal/60 hover:text-fire" />
                      <span className="sr-only">বন্ধ করুন</span>
                    </SheetClose>
                  </SheetHeader>

                  <div className="flex flex-col flex-1 overflow-hidden p-4">
                    <Tabs defaultValue="menu" className="w-full flex flex-col flex-1 min-h-0">
                      <TabsList className="flex w-full bg-cream-dark/30 mb-5 shrink-0 h-12 rounded-xl p-1">
                        <TabsTrigger value="menu" className="flex-1 h-full text-sm font-bold font-bengali rounded-lg text-charcoal/60 data-[state=active]:bg-cream data-[state=active]:text-fire data-[state=active]:shadow-sm transition-all duration-300">মেনু</TabsTrigger>
                        <TabsTrigger value="categories" className="flex-1 h-full text-sm font-bold font-bengali rounded-lg text-charcoal/60 data-[state=active]:bg-cream data-[state=active]:text-fire data-[state=active]:shadow-sm transition-all duration-300">ক্যাটাগরি</TabsTrigger>
                      </TabsList>

                      <TabsContent value="menu" className="flex-1 mt-0 focus-visible:outline-none focus-visible:ring-0 overflow-y-auto pr-1">
                        <div className="space-y-1">
                          {menuItems.map((item) => {
                            const IconComp = item.icon;
                            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/");

                            return (
                              <div key={item.href} className="flex flex-col">
                                <div className="flex items-center w-full group">
                                  <Link
                                    href={item.href}
                                    onClick={closeMobileMenu}
                                    className={cn(
                                      "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 flex-1",
                                      isActive
                                        ? "text-fire font-bold bg-fire/5"
                                        : "text-charcoal hover:bg-fire/5 hover:text-fire"
                                    )}
                                  >
                                    <IconComp className={cn(
                                      "h-5 w-5 transition-colors",
                                      isActive ? "text-fire" : "text-charcoal/50 group-hover:text-fire"
                                    )} />
                                    <span className="text-base font-medium font-bengali">{item.titleBn}</span>
                                  </Link>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </TabsContent>

                      <TabsContent value="categories" className="flex-1 mt-0 focus-visible:outline-none focus-visible:ring-0 overflow-y-auto pr-1">
                        <div className="space-y-1">
                          {categories.map((cat) => {
                            const SubIcon = cat.icon;
                            return (
                              <Link
                                key={cat.title}
                                href={cat.href}
                                onClick={closeMobileMenu}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-fire/5 group"
                              >
                                <div className="relative shrink-0 w-10 h-10 rounded-lg overflow-hidden border border-border">
                                  {cat.image ? (
                                    <Image 
                                      src={cat.image} 
                                      alt={cat.title} 
                                      fill 
                                      sizes="40px"
                                      className="object-cover group-hover:scale-110 transition-transform duration-500" 
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-fire/10 flex items-center justify-center text-fire">
                                      <SubIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="text-base font-medium font-bengali text-charcoal group-hover:text-fire transition-colors">{cat.title}</span>
                                  {cat.description && (
                                    <span className="text-xs text-charcoal/60 font-bengali truncate">{cat.description}</span>
                                  )}
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                      </TabsContent>
                    </Tabs>

                    {/* Divider + Account Section */}
                    <div className="mt-auto border-t border-border pt-4 space-y-3 shrink-0">
                      {isLoggedIn && user ? (
                        <>
                          {/* User Profile Card */}
                          <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-fire/5 to-terracotta/5 border border-border">
                            <Avatar className="h-11 w-11 ring-2 ring-fire/20">
                              <AvatarImage 
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=E85D24&color=fff&bold=true`}
                                alt={user.name} 
                                className="object-cover" 
                              />
                              <AvatarFallback className="bg-gradient-to-br from-fire to-terracotta text-white font-bold">
                                {userInitial}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="font-bold text-sm leading-none truncate text-charcoal">{user.name}</p>
                              <p className="text-xs text-muted mt-1 truncate">{user.email}</p>
                            </div>
                          </div>

                          {/* Dashboard Link */}
                          <Link
                            href={dashboardHref}
                            onClick={closeMobileMenu}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-cream-dark/30 hover:bg-cream-dark/50 transition-colors"
                          >
                            {userRole === "ADMIN"
                              ? <LayoutDashboard className="h-5 w-5 text-fire" />
                              : <Truck className="h-5 w-5 text-fire" />}
                            <span className="text-sm font-semibold font-bengali text-charcoal">
                              {userRole === "ADMIN" ? "অ্যাডমিন ড্যাশবোর্ড" : "আমার অর্ডার ট্র্যাক করুন"}
                            </span>
                            <ChevronRight className="h-4 w-4 ml-auto text-charcoal/45" />
                          </Link>

                          {/* Logout */}
                          <button
                            onClick={() => {
                              handleLogout();
                              closeMobileMenu();
                            }}
                            className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-error hover:bg-error/5 transition-colors"
                          >
                            <LogOut className="h-5 w-5" />
                            <span className="text-sm font-semibold font-bengali">লগআউট করুন</span>
                          </button>
                        </>
                      ) : (
                         <Button nativeButton={false} render={<Link href="/login" onClick={closeMobileMenu} />} className="w-full h-12 bg-gradient-to-r from-fire to-terracotta hover:from-fire-dark hover:to-terracotta-dark text-white rounded-xl shadow-lg hover:shadow-fire/25 transition-all duration-300 font-bold text-base border-0 font-bengali">
                           লগইন করুন
                         </Button>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>

          {/* Middle: Logo */}
          <div className="flex-shrink-0">
            <Logo size="sm" />
          </div>

          {/* Right: Cart */}
          <div className="flex-1 flex justify-end">
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
          </div>
        </div>
      </Container>
    </nav>
  );
}
