"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Search, RefreshCw, Filter, ImageIcon, Eye, MoreVertical, XCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import { triggerRevalidation } from "@/lib/revalidate";
import { getBanners, createBanner, updateBanner, deleteBanner as deleteBannerApi, Banner } from "@/services/banner.service";
import AddBannerForm from "@/components/dashboard/AddBannerForm";
import BannersLoadingSkeleton from "@/components/dashboard/BannersLoadingSkeleton";
import USPagination from "@/components/shared/USPagination";
import { format } from "date-fns";

export default function AdminBannersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [isActiveFilter, setIsActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("order");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    badge: "",
    image: "",
    order: 0,
    banner: false,
    isActive: true,
    categoryId: "",
    buttonText: "",
  });

  const { data: bannerResponse, isLoading: bannersLoading } = useQuery({
    queryKey: ["banners", page, debouncedSearch, isActiveFilter, sortBy, sortOrder],
    queryFn: () => getBanners({
      limit: 10,
      page,
      searchTerm: debouncedSearch,
      isActive: isActiveFilter === "active" ? true : isActiveFilter === "inactive" ? false : undefined,
      sortBy,
      sortOrder
    }),
    placeholderData: (previousData) => previousData,
  });

  const banners = bannerResponse?.data || [];
  const meta = bannerResponse?.meta;

  const createMutation = useMutation({
    mutationFn: createBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      triggerRevalidation({ tag: "banners" });
      toast.success("Banner created successfully");
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create banner");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => updateBanner(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ["banners"] });

      const previousQueriesData = queryClient.getQueriesData({ queryKey: ["banners"] });

      queryClient.setQueriesData({ queryKey: ["banners"] }, (old: any) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: old.data.map((banner: any) =>
            banner.id === id ? { ...banner, ...payload } : banner
          ),
        };
      });

      return { previousQueriesData };
    },
    onError: (error: any, _variables, context: any) => {
      if (context?.previousQueriesData) {
        context.previousQueriesData.forEach(([queryKey, data]: [any, any]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(error.message || "Failed to update banner");
    },
    onSuccess: () => {
      triggerRevalidation({ tag: "banners" });
      toast.success("Banner updated successfully");
      setIsEditOpen(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBannerApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      triggerRevalidation({ tag: "banners" });
      toast.success("Banner deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete banner");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => updateBanner(id, { isActive }),
    onMutate: async ({ id, isActive }) => {
      await queryClient.cancelQueries({ queryKey: ["banners"] });

      const previousQueriesData = queryClient.getQueriesData({ queryKey: ["banners"] });

      queryClient.setQueriesData({ queryKey: ["banners"] }, (old: any) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: old.data.map((banner: any) =>
            banner.id === id ? { ...banner, isActive } : banner
          ),
        };
      });

      return { previousQueriesData };
    },
    onError: (error: any, _variables, context: any) => {
      if (context?.previousQueriesData) {
        context.previousQueriesData.forEach(([queryKey, data]: [any, any]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(error.message || "Failed to update banner status");
    },
    onSuccess: () => {
      triggerRevalidation({ tag: "banners" });
      toast.success("Banner status updated");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      badge: "",
      image: "",
      order: 0,
      banner: false,
      isActive: true,
      categoryId: "",
      buttonText: "",
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ id: selectedBanner.id, payload: formData });
  };

  const openEdit = (banner: Banner) => {
    setSelectedBanner(banner);
    setFormData({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      badge: banner.badge || "",
      image: banner.image || "",
      order: banner.order || 0,
      banner: banner.banner ?? false,
      isActive: banner.isActive ?? true,
      categoryId: banner.categoryId || "",
      buttonText: banner.buttonText || "",
    });
    setIsEditOpen(true);
  };

  const handleViewBanner = (banner: Banner) => {
    setSelectedBanner(banner);
    setIsViewDialogOpen(true);
  };

  const resetFilters = () => {
    setSearch("");
    setIsActiveFilter("all");
    setSortBy("order");
    setSortOrder("asc");
    setPage(1);
  };

  const isFiltered = search || isActiveFilter !== "all";

  const getSortLabel = () => {
    if (sortBy === "order" && sortOrder === "asc") return "Order: Low to High";
    if (sortBy === "order" && sortOrder === "desc") return "Order: High to Low";
    if (sortBy === "createdAt" && sortOrder === "desc") return "Newest First";
    if (sortBy === "createdAt" && sortOrder === "asc") return "Oldest First";
    return "Sort By";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border">
        <div>
          <h1 className="text-2xl font-bold font-bengali text-charcoal">ব্যানারসমূহ</h1>
          <p className="text-muted-foreground text-sm hidden md:block font-bengali">হোমপেজ স্লাইডার ব্যানার পরিচালনা করুন</p>
        </div>
        <Button onClick={() => { resetForm(); setIsCreateOpen(true); }} className="bg-fire text-white font-semibold hover:bg-fire-dark rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> নতুন ব্যানার
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-row gap-2 sm:gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search banners..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 pr-10 h-11 w-full bg-background border-border focus-visible:ring-fire/20 focus-visible:border-fire/50 rounded-xl"
          />
          {search && (
            <button 
              onClick={() => { setSearch(""); setPage(1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-fire transition-colors"
            >
              <XCircle className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-auto">
          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <Button variant="outline" className="w-auto gap-2 border-border hover:bg-cream hover:border-fire/30 hover:text-fire rounded-xl h-11 px-3 sm:px-4 transition-all" onClick={() => setIsFilterOpen(true)}>
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                {isFiltered && <span className="flex h-2 w-2 rounded-full bg-fire" />}
              </Button>
              <SheetContent side="right" className="w-[85vw] sm:w-[400px] p-0 flex flex-col" showCloseButton={false}>
                <SheetHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0">
                  <SheetTitle className="text-xl font-bold flex items-center gap-2">
                    <Filter className="w-5 h-5 text-fire" /> Filters
                  </SheetTitle>
                  <SheetClose className="rounded-xl p-2 hover:bg-cream dark:hover:bg-charcoal-light transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-fire border border-transparent hover:border-fire/30">
                    <XCircle className="h-5 w-5 text-muted-foreground hover:text-fire" />
                  </SheetClose>
                </SheetHeader>
                
                <div className="p-6 space-y-8 flex-1 overflow-y-auto">
                  <SheetDescription className="sr-only">Filter and sort banners table</SheetDescription>
                  
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Status</h3>
                    <Select value={isActiveFilter} onValueChange={(v) => { setIsActiveFilter(v || "all"); setPage(1); }}>
                      <SelectTrigger className="w-full h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
                        <SelectValue placeholder="All Status">
                          {isActiveFilter === "all" ? "All Status" :
                           isActiveFilter === "active" ? "Active" :
                           isActiveFilter === "inactive" ? "Inactive" : "Status"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Sort By</h3>
                    <Select value={`${sortBy}-${sortOrder}`} onValueChange={(v) => {
                      const [by, order] = (v || "order-asc").split('-');
                      setSortBy(by);
                      setSortOrder(order as "asc" | "desc");
                      setPage(1);
                    }}>
                      <SelectTrigger className="w-full h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
                        <SelectValue placeholder="Sort By">{getSortLabel()}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="order-asc">Order: Low to High</SelectItem>
                        <SelectItem value="order-desc">Order: High to Low</SelectItem>
                        <SelectItem value="createdAt-desc">Newest First</SelectItem>
                        <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-6 border-t border-border bg-cream/50 dark:bg-charcoal-light/30">
                  <Button 
                    onClick={() => { resetFilters(); setIsFilterOpen(false); }}
                    variant="outline" 
                    disabled={!isFiltered}
                    className="w-full h-12 rounded-xl border-border hover:bg-fire hover:text-white hover:border-fire transition-all font-bold"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" /> Reset All Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Inline Filters */}
          <div className="hidden lg:flex flex-wrap gap-2 items-center">
          <Select value={isActiveFilter} onValueChange={(v) => { setIsActiveFilter(v || "all"); setPage(1); }}>
            <SelectTrigger className="w-[130px] h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
              <SelectValue placeholder="Status">
                {isActiveFilter === "all" ? "All Status" :
                 isActiveFilter === "active" ? "Active" :
                 isActiveFilter === "inactive" ? "Inactive" : "Status"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={`${sortBy}-${sortOrder}`} onValueChange={(v) => {
            const [by, order] = (v || "order-asc").split('-');
            setSortBy(by);
            setSortOrder(order as "asc" | "desc");
            setPage(1);
          }}>
            <SelectTrigger className="w-[180px] h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
              <SelectValue placeholder="Sort By">{getSortLabel()}</SelectValue>
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="order-asc">Order: Low to High</SelectItem>
              <SelectItem value="order-desc">Order: High to Low</SelectItem>
              <SelectItem value="createdAt-desc">Newest First</SelectItem>
              <SelectItem value="createdAt-asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>

            {isFiltered && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetFilters} 
                className="text-muted-foreground hover:text-fire hover:bg-cream h-10 px-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      {bannersLoading ? (
        <BannersLoadingSkeleton />
      ) : (
        <div className="border border-border bg-card rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-cream/50 dark:bg-charcoal-light/30 text-charcoal dark:text-cream text-xs uppercase font-bengali">
                <tr>
                  <th className="px-6 py-4">Banner</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {banners.map((banner: Banner) => (
                <tr key={banner.id} className="hover:bg-cream/30 dark:hover:bg-charcoal-light/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-32 h-16 rounded-lg overflow-hidden border border-border bg-cream shrink-0">
                        {banner.image ? (
                          <Image src={banner.image} alt={banner.title || "Banner"} fill sizes="128px" className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold">{banner.title || "Untitled Banner"}</div>
                        {/* {banner.badge && (
                          <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-fire text-white rounded-full mb-1">
                            {banner.badge}
                          </span>
                        )} */}
                        {banner.subtitle && (
                          <div className="text-xs text-muted-foreground line-clamp-1">{banner.subtitle}</div>
                        )}
                        {/* {banner.buttonText && (
                          <div className="text-xs text-muted-foreground">Button: {banner.buttonText}</div>
                        )} */}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {banner.category ? (
                      <span className="text-sm text-muted-foreground">{banner.category.name}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-charcoal bg-cream px-3 py-1 rounded-full">
                      {banner.order}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Switch
                      checked={banner.isActive}
                      onCheckedChange={(checked) => {
                        toggleMutation.mutate({
                          id: banner.id,
                          isActive: checked
                        });
                      }}
                      className="data-checked:bg-green-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-2 hover:bg-fire/10 hover:text-fire rounded-lg transition-colors cursor-pointer text-muted-foreground">
                        <MoreVertical size={18} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewBanner(banner)}>
                          <Eye size={16} className="mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEdit(banner)}>
                          <Edit2 size={16} className="mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            toast.error("Confirm Deletion", {
                              description: `Are you sure you want to delete ${banner.title}?`,
                              action: {
                                label: "Delete",
                                onClick: () => deleteMutation.mutate(banner.id)
                              },
                              cancel: {
                                label: "Cancel",
                                onClick: () => { }
                              }
                            });
                          }}
                          className="text-destructive focus:text-destructive"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 size={16} className="mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center flex-wrap mt-4">
          <USPagination
            page={page}
            totalPage={meta.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={(open) => { if (!open) resetForm(); setIsCreateOpen(open); }}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-bengali">নতুন ব্যানার যোগ করুন</DialogTitle>
          </DialogHeader>
          <AddBannerForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleCreateSubmit}
            isPending={createMutation.isPending}
            buttonText="ব্যানার তৈরি করুন"
            onCancel={() => { resetForm(); setIsCreateOpen(false); }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={(open) => { if (!open) resetForm(); setIsEditOpen(open); }}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-bengali">ব্যানার এডিট করুন</DialogTitle>
          </DialogHeader>
          <AddBannerForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleEditSubmit}
            isPending={updateMutation.isPending}
            buttonText="ব্যানার আপডেট করুন"
            onCancel={() => { resetForm(); setIsEditOpen(false); }}
          />
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden sm:rounded-3xl border-border shadow-2xl">
          <DialogHeader className="p-4 sm:p-6 border-b border-border/60 bg-muted/10 pr-12">
            <div className="flex items-center justify-between gap-4">
              <div>
                <DialogTitle className="text-xl font-bold font-bengali text-charcoal flex items-center gap-2">
                  <Eye className="w-5 h-5 text-fire shrink-0" />
                  <span>ব্যানার বিস্তারিত</span>
                </DialogTitle>
                <DialogDescription className="text-muted-foreground text-xs mt-1 font-bengali">
                  ব্যানারের সম্পূর্ণ বিস্তারিত তথ্য ও কনফিগারেশন
                </DialogDescription>
              </div>
              {selectedBanner && (
                <span className={`px-3 py-1 rounded-full text-xs font-bold font-bengali ${
                  selectedBanner.isActive 
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" 
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                }`}>
                  {selectedBanner.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
                </span>
              )}
            </div>
          </DialogHeader>

          {selectedBanner && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* Banner Image Preview Card */}
              <div className="bg-card rounded-2xl border border-border/70 overflow-hidden shadow-xs">
                {selectedBanner.image ? (
                  <div className="relative w-full h-44 sm:h-56 bg-muted/30">
                    <Image
                      src={selectedBanner.image}
                      alt={selectedBanner.title || "Banner Preview"}
                      fill
                      className="object-cover"
                    />
                    {selectedBanner.badge && (
                      <span className="absolute top-3 left-3 px-3 py-1 text-xs font-bold bg-fire text-white rounded-full shadow-md font-bengali">
                        {selectedBanner.badge}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-44 sm:h-56 bg-muted/30 flex items-center justify-center border-b border-border/60">
                    <ImageIcon className="w-12 h-12 text-muted-foreground/50" />
                  </div>
                )}

                <div className="p-4 sm:p-5 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedBanner.category?.name && (
                      <span className="px-2.5 py-0.5 rounded-md bg-fire/10 text-fire text-xs font-bold font-bengali">
                        {selectedBanner.category.name}
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-md bg-muted/40 text-muted-foreground text-xs font-medium font-latin">
                      Display Order: #{selectedBanner.order}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-charcoal font-bengali">{selectedBanner.title || "Untitled Banner"}</h3>
                  {selectedBanner.subtitle && (
                    <p className="text-sm text-muted-foreground font-bengali leading-relaxed">{selectedBanner.subtitle}</p>
                  )}
                </div>
              </div>

              {/* Status & Type Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-muted/10 rounded-xl border border-border/50 text-center space-y-1">
                  <span className="text-xs text-muted-foreground block font-bengali">স্ট্যাটাস</span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md inline-block ${
                    selectedBanner.isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                  }`}>
                    {selectedBanner.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="p-3.5 bg-muted/10 rounded-xl border border-border/50 text-center space-y-1">
                  <span className="text-xs text-muted-foreground block font-bengali">ব্যানার টাইপ</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-md inline-block bg-fire/10 text-fire font-latin">
                    {selectedBanner.banner ? "Main Banner" : "Regular"}
                  </span>
                </div>
                <div className="p-3.5 bg-muted/10 rounded-xl border border-border/50 text-center space-y-1 col-span-2 sm:col-span-1">
                  <span className="text-xs text-muted-foreground block font-bengali">বাটন টেক্সট</span>
                  <span className="text-xs font-bold text-charcoal font-bengali truncate block">
                    {selectedBanner.buttonText || "N/A"}
                  </span>
                </div>
              </div>

              {/* Footer Meta */}
              <div className="p-4 bg-muted/10 rounded-2xl border border-border/50 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground font-bengali">
                <div>
                  <span className="font-semibold text-charcoal mr-1">তৈরি করা হয়েছে:</span>
                  <span>{format(new Date(selectedBanner.createdAt), "dd MMM, yyyy 'at' HH:mm")}</span>
                </div>
                {selectedBanner.updatedAt && (
                  <div>
                    <span className="font-semibold text-charcoal mr-1">সর্বশেষ আপডেট:</span>
                    <span>{format(new Date(selectedBanner.updatedAt), "dd MMM, yyyy 'at' HH:mm")}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
