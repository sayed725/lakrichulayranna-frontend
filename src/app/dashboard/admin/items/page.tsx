"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getItems, createItem, updateItem, deleteItem } from "@/services/item.service";
import { getCategories } from "@/services/category.service";
import { triggerRevalidation } from "@/lib/revalidate";

const decodeHtmlEntities = (str: string) => {
  if (!str) return "";
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&');
};
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, ImageIcon, XCircle, Filter, Search, RefreshCw, Eye, MoreVertical, Edit2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { formatPrice } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetDescription,
} from "@/components/ui/sheet";
import AddItemForm from "@/components/dashboard/AddItemForm";
import ItemsLoadingSkeleton from "@/components/dashboard/ItemsLoadingSkeleton";
import { useDebounce } from "@/hooks/useDebounce";
import USPagination from "@/components/shared/USPagination";
import Image from "next/image";
import { format } from "date-fns";
import { useToggleItemAvailability, useDeleteItem } from "@/features/item/hooks/useAdminItems";

export default function AdminItemsPage() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    weight: "",
    price: 0,
    categoryId: "",
    imageUrl: "",
    slug: "",
    images: [] as string[],
    isAvailable: true,
    isFeatured: false,
    isBestSelling: false,
    isCategoryFeatured: false,
    isNew: false,
    isSpicy: false,
    description: "",
    discountPrice: null as number | null,
  });

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [categoryNameFilter, setCategoryNameFilter] = useState("all");
  const [isAvailableFilter, setIsAvailableFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const { data: itemResponse, isLoading: itemsLoading } = useQuery({
    queryKey: ["items", page, debouncedSearch, categoryNameFilter, isAvailableFilter, sortBy, sortOrder],
    queryFn: () => getItems({
      limit: 10,
      page,
      searchTerm: debouncedSearch,
      "category.name": categoryNameFilter === "all" ? undefined : categoryNameFilter,
      isBestSelling: isAvailableFilter === "bestSelling" ? true : undefined,
      isFeatured: isAvailableFilter === "featured" ? true : undefined,
      isCategoryFeatured: isAvailableFilter === "categoryFeatured" ? true : undefined,
      isNew: isAvailableFilter === "new" ? true : undefined,
      isAvailable: isAvailableFilter === "available" ? true : undefined,
      sortBy,
      sortOrder
    }),
    placeholderData: (previousData) => previousData,
  });

  const { data: catResponse } = useQuery({
    queryKey: ["categories", "all"],
    queryFn: () => getCategories({ limit: 1000 }),
  });

  const items = itemResponse?.data || [];
  const meta = itemResponse?.meta;
  const categories = catResponse?.data || [];

  const createMutation = useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      triggerRevalidation({ tag: "items" });
      toast.success("Item created successfully");
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create item");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => updateItem(id, payload),
    onMutate: async ({ id, payload }) => {
      // Cancel outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: ["items"] });

      // Snapshot previous query data for rollback on failure
      const previousQueriesData = queryClient.getQueriesData({ queryKey: ["items"] });

      // Optimistically update all cached items queries instantly (0ms delay!)
      queryClient.setQueriesData({ queryKey: ["items"] }, (old: any) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: old.data.map((item: any) =>
            item.id === id ? { ...item, ...payload } : item
          ),
        };
      });

      return { previousQueriesData };
    },
    onError: (error: any, _variables, context: any) => {
      // Rollback to previous state on error
      if (context?.previousQueriesData) {
        context.previousQueriesData.forEach(([queryKey, data]: [any, any]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(error.message || "Failed to update item");
    },
    onSuccess: () => {
      triggerRevalidation({ tag: "items" });
      toast.success("Item updated successfully");
      setIsEditOpen(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });

  const deleteMutationHook = useDeleteItem();

  const resetForm = () => {
    setFormData({
      name: "",
      weight: "",
      price: 0,
      categoryId: "",
      imageUrl: "",
      slug: "",
      images: [],
      isAvailable: true,
      isFeatured: false,
      isBestSelling: false,
      isCategoryFeatured: false,
      isNew: false,
      isSpicy: false,
      description: "",
      discountPrice: null,
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      toast.error("Please select a category");
      return;
    }
    createMutation.mutate(formData);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      toast.error("Please select a category");
      return;
    }
    updateMutation.mutate({ id: selectedItem.id, payload: formData });
  };

  const openEdit = (item: any) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      weight: item.weight || "",
      price: item.price || 0,
      categoryId: item.categoryId || "",
      imageUrl: item.imageUrl || "",
      slug: item.slug || "",
      images: Array.isArray(item.images) ? item.images : (item.images ? [item.images] : []),
      isAvailable: item.isAvailable,
      isFeatured: item.isFeatured,
      isBestSelling: item.isBestSelling || false,
      isCategoryFeatured: item.isCategoryFeatured || false,
      isNew: item.isNew || false,
      isSpicy: item.isSpicy || false,
      description: item.description || "",
      discountPrice: item.discountPrice ?? null,
    });
    setIsEditOpen(true);
  };

  const handleViewItem = (item: any) => {
    setSelectedItem(item);
    setIsViewDialogOpen(true);
  };

  const resetFilters = () => {
    setSearch("");
    setCategoryNameFilter("all");
    setIsAvailableFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  const isFiltered = search !== "" || categoryNameFilter !== "all" || isAvailableFilter !== "all" || sortBy !== "createdAt" || sortOrder !== "desc";

  const getSortLabel = () => {
    const sortMap: Record<string, string> = {
      "createdAt-desc": "Newest First",
      "createdAt-asc": "Oldest First",
      "price-desc": "Price: High to Low",
      "price-asc": "Price: Low to High",
      "name-desc": "Name: Z to A",
      "name-asc": "Name: A to Z",
    };
    return sortMap[`${sortBy}-${sortOrder}`] || "Sort By";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-card p-4 sm:p-5 rounded-2xl border border-border shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-bengali text-charcoal dark:text-cream">আইটেমসমূহ</h1>
          <p className="text-muted-foreground text-xs sm:text-sm font-bengali mt-0.5">মেনুর সকল খাবার পরিচালনা করুন</p>
        </div>
        <Dialog
          open={isCreateOpen}
          disablePointerDismissal
          onOpenChange={(val) => {
            if (val) {
              resetForm();
              if (categories.length > 0) {
                setFormData(prev => ({ ...prev, categoryId: categories[0].id }));
              }
            }
            setIsCreateOpen(val);
          }}
        >
          <Button className="bg-fire text-white font-semibold hover:bg-fire-dark rounded-xl h-11 px-4 self-stretch sm:self-auto" onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            নতুন আইটেম
          </Button>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl font-bold font-bengali">নতুন আইটেম তৈরি করুন</DialogTitle>
            </DialogHeader>
            
            <AddItemForm
              formData={formData}
              setFormData={setFormData}
              categories={categories}
              onSubmit={handleCreateSubmit}
              isPending={createMutation.isPending}
              buttonText="আইটেম তৈরি করুন"
              onCancel={() => setIsCreateOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search Header */}
      <div className="flex flex-row gap-2 sm:gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="খাবারের নাম খুঁজুন..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 pr-10 h-11 w-full bg-background border-border focus-visible:ring-fire/20 focus-visible:border-fire/50 rounded-xl font-bengali text-sm"
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
          {/* Mobile/Tablet Filter Drawer */}
          <div className="lg:hidden">
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <Button variant="outline" className="w-auto gap-2 border-border hover:bg-cream hover:border-fire/30 hover:text-fire rounded-xl h-11 px-3.5 transition-all" onClick={() => setIsFilterOpen(true)}>
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline text-xs font-semibold">Filters</span>
                {isFiltered && <span className="flex h-2 w-2 rounded-full bg-fire" />}
              </Button>
              <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col" showCloseButton={false}>
                <SheetHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0">
                  <SheetTitle className="text-xl font-bold flex items-center gap-2">
                    <Filter className="w-5 h-5 text-fire" /> Filters
                  </SheetTitle>
                  <SheetClose className="rounded-xl p-2 hover:bg-cream dark:hover:bg-charcoal-light transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-fire border border-transparent hover:border-fire/30">
                    <XCircle className="h-5 w-5 text-muted-foreground hover:text-fire" />
                  </SheetClose>
                </SheetHeader>
                
                <div className="p-6 space-y-8 flex-1 overflow-y-auto">
                  <SheetDescription className="sr-only">Filter and sort items catalog table</SheetDescription>
                  
                  {/* Category Filter */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Category</h3>
                    <Select value={categoryNameFilter} onValueChange={(v) => { setCategoryNameFilter(v || "all"); setPage(1); }}>
                      <SelectTrigger className="w-full h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
                        <SelectValue placeholder="All Categories">
                          {categoryNameFilter === "all" ? "All Categories" : categoryNameFilter}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((c: any) => (
                          <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Filter By</h3>
                    <Select value={isAvailableFilter} onValueChange={(v) => { setIsAvailableFilter(v || "all"); setPage(1); }}>
                      <SelectTrigger className="w-full h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
                        <SelectValue placeholder="All Status">
                          {isAvailableFilter === "all" ? "All Status" :
                           isAvailableFilter === "bestSelling" ? "Best Selling" :
                           isAvailableFilter === "featured" ? "Featured" :
                           isAvailableFilter === "categoryFeatured" ? "Category Featured" :
                           isAvailableFilter === "new" ? "New" :
                           isAvailableFilter === "available" ? "Availability" : "Status"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="bestSelling">Best Selling</SelectItem>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="categoryFeatured">Category Featured</SelectItem>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="available">Availability</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort By */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Sort Items</h3>
                    <Select value={`${sortBy}-${sortOrder}`} onValueChange={(v) => {
                      const [by, order] = (v || "createdAt-desc").split('-');
                      setSortBy(by);
                      setSortOrder(order as "asc" | "desc");
                      setPage(1);
                    }}>
                      <SelectTrigger className="w-full h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
                        <SelectValue placeholder="Sort By">{getSortLabel()}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="createdAt-desc">Newest First</SelectItem>
                        <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="name-asc">Name: A to Z</SelectItem>
                        <SelectItem value="name-desc">Name: Z to A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-6 border-t border-border bg-cream/50 dark:bg-charcoal-light/30">
                  <Button 
                    onClick={resetFilters} 
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
            <Select value={categoryNameFilter} onValueChange={(v) => { setCategoryNameFilter(v || "all"); setPage(1); }}>
              <SelectTrigger className="w-[180px] h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
                <SelectValue placeholder="Category">
                  {categoryNameFilter === "all" ? "All Categories" : categoryNameFilter}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c: any) => (
                  <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={isAvailableFilter} onValueChange={(v) => { setIsAvailableFilter(v || "all"); setPage(1); }}>
              <SelectTrigger className="w-[130px] h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
                <SelectValue placeholder="Status">
                  {isAvailableFilter === "all" ? "All Status" : 
                   isAvailableFilter === "bestSelling" ? "Best Selling" :
                   isAvailableFilter === "featured" ? "Featured" :
                   isAvailableFilter === "categoryFeatured" ? "Cat. Featured" :
                   isAvailableFilter === "new" ? "New" :
                   isAvailableFilter === "available" ? "Availability" : "Status"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="bestSelling">Best Selling</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="categoryFeatured">Cat. Featured</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="available">Availability</SelectItem>
              </SelectContent>
            </Select>

            <Select value={`${sortBy}-${sortOrder}`} onValueChange={(v) => {
              const [by, order] = (v || "createdAt-desc").split('-');
              setSortBy(by);
              setSortOrder(order as "asc" | "desc");
              setPage(1);
            }}>
              <SelectTrigger className="w-[180px] h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
                <SelectValue placeholder="Sort By">{getSortLabel()}</SelectValue>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
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

      {itemsLoading ? (
        <ItemsLoadingSkeleton />
      ) : (
        <>
          {/* Mobile & Tablet Card View (< lg) */}
          <div className="lg:hidden space-y-3.5">
            {items.map((item: any) => (
              <div
                key={item.id}
                className="bg-white dark:bg-charcoal border border-border/80 dark:border-white/10 rounded-2xl p-3.5 sm:p-4 space-y-3 shadow-xs hover:shadow-md transition-shadow"
              >
                {/* Header: Image, Title, Category, Price & Menu */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {item.imageUrl || (item.images && item.images[0]) ? (
                      <img
                        src={item.imageUrl || item.images[0]}
                        alt={item.name}
                        className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-xl border border-border/60 shrink-0 shadow-2xs"
                      />
                    ) : (
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-muted/60 rounded-xl flex items-center justify-center border border-border/60 shrink-0">
                        <ImageIcon className="w-5 h-5 text-muted-foreground/70" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <h3 className="font-bold text-sm sm:text-base text-charcoal dark:text-cream leading-snug line-clamp-1">
                        {item.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                        <span className="inline-block truncate max-w-[120px] font-medium text-charcoal/80 dark:text-cream/80">
                          {item.category?.name || "General"}
                        </span>
                        {item.weight && (
                          <span className="font-latin text-[11px] shrink-0 text-muted-foreground">
                            • {item.weight}
                          </span>
                        )}
                        {item.isSpicy && <span className="shrink-0 text-xs" title="Spicy">🌶️</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-fire text-sm sm:text-base font-latin whitespace-nowrap">
                        {formatPrice(item.discountPrice ?? item.price)}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-1 hover:bg-cream-dark/50 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-muted-foreground -mr-1">
                          <MoreVertical size={18} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuItem onClick={() => handleViewItem(item)}>
                            <Eye size={16} className="mr-2" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEdit(item)}>
                            <Edit2 size={16} className="mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              toast.error("Confirm Deletion", {
                                description: `Are you sure you want to delete ${item.name}?`,
                                action: {
                                  label: "Delete",
                                  onClick: () => deleteMutationHook.mutate(item.id),
                                },
                                cancel: { label: "Cancel", onClick: () => {} },
                              });
                            }}
                            className="text-destructive focus:text-destructive"
                            disabled={deleteMutationHook.isPending}
                          >
                            <Trash2 size={16} className="mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {item.discountPrice && (
                      <span className="text-[11px] text-muted-foreground line-through font-latin">
                        {formatPrice(item.price)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Toggle Controls */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2.5 border-t border-border/50 dark:border-white/5">
                  <div className="flex items-center justify-between sm:flex-col sm:justify-between bg-cream/40 dark:bg-white/[0.03] p-2 rounded-xl border border-border/40 dark:border-white/5 min-h-[48px] sm:min-h-[58px]">
                    <span className="text-muted-foreground font-medium text-[11px] truncate px-1">Available</span>
                    <Switch
                      checked={item.isAvailable}
                      onCheckedChange={(checked) => {
                        updateMutation.mutate({
                          id: item.id,
                          payload: { isAvailable: checked },
                        });
                      }}
                      className="data-checked:bg-green-500 scale-90"
                    />
                  </div>

                  <div className="flex items-center justify-between sm:flex-col sm:justify-between bg-cream/40 dark:bg-white/[0.03] p-2 rounded-xl border border-border/40 dark:border-white/5 min-h-[48px] sm:min-h-[58px]">
                    <span className="text-muted-foreground font-medium text-[11px] truncate px-1">Best Seller</span>
                    <Switch
                      checked={item.isBestSelling}
                      onCheckedChange={(checked) => {
                        updateMutation.mutate({
                          id: item.id,
                          payload: { isBestSelling: checked },
                        });
                      }}
                      className="data-checked:bg-purple-500 scale-90"
                    />
                  </div>

                  <div className="flex items-center justify-between sm:flex-col sm:justify-between bg-cream/40 dark:bg-white/[0.03] p-2 rounded-xl border border-border/40 dark:border-white/5 min-h-[48px] sm:min-h-[58px]">
                    <span className="text-muted-foreground font-medium text-[11px] truncate px-1">Featured</span>
                    <Switch
                      checked={item.isFeatured}
                      onCheckedChange={(checked) => {
                        updateMutation.mutate({
                          id: item.id,
                          payload: { isFeatured: checked },
                        });
                      }}
                      className="data-checked:bg-amber-500 scale-90"
                    />
                  </div>

                  <div className="flex items-center justify-between sm:flex-col sm:justify-between bg-cream/40 dark:bg-white/[0.03] p-2 rounded-xl border border-border/40 dark:border-white/5 min-h-[48px] sm:min-h-[58px]">
                    <span className="text-muted-foreground font-medium text-[11px] truncate px-1">Cat. Feat.</span>
                    <Switch
                      checked={item.isCategoryFeatured}
                      onCheckedChange={(checked) => {
                        updateMutation.mutate({
                          id: item.id,
                          payload: { isCategoryFeatured: checked },
                        });
                      }}
                      className="data-checked:bg-orange-500 scale-90"
                    />
                  </div>

                  <div className="flex items-center justify-between sm:flex-col sm:justify-between bg-cream/40 dark:bg-white/[0.03] p-2 rounded-xl border border-border/40 dark:border-white/5 min-h-[48px] sm:min-h-[58px] col-span-2 sm:col-span-1">
                    <span className="text-muted-foreground font-medium text-[11px] truncate px-1">New Item</span>
                    <Switch
                      checked={item.isNew}
                      onCheckedChange={(checked) => {
                        updateMutation.mutate({
                          id: item.id,
                          payload: { isNew: checked },
                        });
                      }}
                      className="data-checked:bg-blue-500 scale-90"
                    />
                  </div>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="p-8 text-center bg-card rounded-2xl border border-border text-muted-foreground">
                কোনো খাবার পাওয়া যায়নি।
              </div>
            )}
          </div>

          {/* Desktop Table View (>= lg) */}
          <div className="hidden lg:block border border-border bg-card rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-cream/50 dark:bg-charcoal-light/30 text-charcoal dark:text-cream text-xs uppercase font-bengali">
                  <tr>
                    <th className="px-4 py-3 w-16">Image</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3 text-right">Price</th>
                    <th className="px-4 py-3 text-center">Best Selling</th>
                    <th className="px-4 py-3 text-center">Featured</th>
                    <th className="px-4 py-3 text-center">Cat. Featured</th>
                    <th className="px-4 py-3 text-center">New</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map((item: any) => (
                    <tr key={item.id} className="hover:bg-cream/30 dark:hover:bg-charcoal-light/20 transition-colors">
                      <td className="px-4 py-3">
                        {item.imageUrl || (item.images && item.images[0]) ? (
                          <img src={item.imageUrl || item.images[0]} alt={item.name} className="w-10 h-10 object-cover rounded-md border-border" />
                        ) : (
                          <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center border-border">
                            <ImageIcon className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.weight} {item.isSpicy && '🌶️'}</div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{item.category?.name || "-"}</td>
                      <td className="px-4 py-3 text-right font-bold text-fire">{formatPrice(item.price)}</td>
                      <td className="px-4 py-3 text-center">
                        <Switch
                          checked={item.isBestSelling}
                          onCheckedChange={(checked) => {
                            updateMutation.mutate({
                              id: item.id,
                              payload: { isBestSelling: checked }
                            });
                          }}
                          className="data-checked:bg-purple-500"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Switch
                          checked={item.isFeatured}
                          onCheckedChange={(checked) => {
                            updateMutation.mutate({
                              id: item.id,
                              payload: { isFeatured: checked }
                            });
                          }}
                          className="data-checked:bg-amber-500"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Switch
                          checked={item.isCategoryFeatured}
                          onCheckedChange={(checked) => {
                            updateMutation.mutate({
                              id: item.id,
                              payload: { isCategoryFeatured: checked }
                            });
                          }}
                          className="data-checked:bg-orange-500"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Switch
                          checked={item.isNew}
                          onCheckedChange={(checked) => {
                            updateMutation.mutate({
                              id: item.id,
                              payload: { isNew: checked }
                            });
                          }}
                          className="data-checked:bg-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Switch 
                          checked={item.isAvailable}
                          onCheckedChange={(checked) => {
                            updateMutation.mutate({
                              id: item.id,
                              payload: { isAvailable: checked }
                            });
                          }}
                          className="data-checked:bg-green-500"
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="p-2 hover:bg-fire/10 hover:text-fire rounded-lg transition-colors cursor-pointer text-muted-foreground">
                            <MoreVertical size={18} />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewItem(item)}>
                              <Eye size={16} className="mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEdit(item)}>
                              <Edit2 size={16} className="mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                toast.error("Confirm Deletion", {
                                  description: `Are you sure you want to delete ${item.name}?`,
                                  action: {
                                    label: "Delete",
                                    onClick: () => deleteMutationHook.mutate(item.id)
                                  },
                                  cancel: {
                                    label: "Cancel",
                                    onClick: () => { }
                                  }
                                });
                              }}
                              className="text-destructive focus:text-destructive"
                              disabled={deleteMutationHook.isPending}
                            >
                              <Trash2 size={16} className="mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={10} className="px-6 py-8 text-center text-muted-foreground">
                        কোনো খাবার পাওয়া যায়নি।
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {meta && meta.totalPage > 1 && (
        <div className="flex justify-center flex-wrap mt-4">
          <USPagination 
            page={page} 
            totalPage={meta.totalPage} 
            onPageChange={(p) => setPage(p)} 
          />
        </div>
      )}

      <Dialog
        open={isEditOpen}
        disablePointerDismissal
        onOpenChange={(val) => {
          if (!val) resetForm();
          setIsEditOpen(val);
        }}
      >
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>আইটেম এডিট করুন</DialogTitle>
          </DialogHeader>
          <AddItemForm
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            onSubmit={handleEditSubmit}
            isPending={updateMutation.isPending}
            buttonText="আইটেম আপডেট করুন"
            onCancel={() => setIsEditOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* View Item Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden sm:rounded-3xl border-border shadow-2xl">
          <DialogHeader className="p-4 sm:p-6 border-b border-border/60 bg-muted/10 pr-12">
            <div className="flex items-center justify-between gap-4">
              <div>
                <DialogTitle className="text-xl font-bold font-bengali text-charcoal flex items-center gap-2">
                  <Eye className="w-5 h-5 text-fire shrink-0" />
                  <span>আইটেম বিস্তারিত</span>
                </DialogTitle>
                {selectedItem?.slug && (
                  <DialogDescription className="text-muted-foreground font-mono text-xs mt-1">
                    Slug: {selectedItem.slug}
                  </DialogDescription>
                )}
              </div>
              {selectedItem && (
                <span className={`px-3 py-1 rounded-full text-xs font-bold font-bengali ${
                  selectedItem.isAvailable 
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" 
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                }`}>
                  {selectedItem.isAvailable ? "উপলব্ধ" : "অনুপলব্ধ"}
                </span>
              )}
            </div>
          </DialogHeader>

          {selectedItem && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* Main Banner / Header Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-5 bg-card rounded-2xl border border-border/70 shadow-xs">
                {selectedItem.imageUrl || (selectedItem.images && selectedItem.images[0]) ? (
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-border/60 shrink-0 bg-muted/30 shadow-xs">
                    <Image
                      src={selectedItem.imageUrl || selectedItem.images[0]}
                      alt={selectedItem.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-muted/30 flex items-center justify-center shrink-0 border border-border/60">
                    <ImageIcon className="w-10 h-10 text-muted-foreground/60" />
                  </div>
                )}
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedItem.category?.name && (
                      <span className="px-2.5 py-0.5 rounded-md bg-fire/10 text-fire text-xs font-bold font-bengali">
                        {selectedItem.category.name}
                      </span>
                    )}
                    {selectedItem.weight && (
                      <span className="px-2.5 py-0.5 rounded-md bg-muted/40 text-muted-foreground text-xs font-medium">
                        {selectedItem.weight}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-charcoal font-bengali leading-snug">{selectedItem.name}</h3>
                  <div className="flex items-baseline gap-3 pt-1">
                    <span className="font-bold text-fire text-xl sm:text-2xl font-latin">
                      {formatPrice(selectedItem.discountPrice ?? selectedItem.price)}
                    </span>
                    {selectedItem.discountPrice && (
                      <span className="text-sm text-muted-foreground line-through font-latin">
                        {formatPrice(selectedItem.price)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Multiple Images Gallery */}
              {selectedItem.images && selectedItem.images.length > 1 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">গ্যালারি ছবিসমূহ</h4>
                  <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                    {selectedItem.images.map((img: string, idx: number) => (
                      <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-border/60 shrink-0 bg-muted/20">
                        <Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Badges / Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-muted/10 rounded-xl border border-border/50 text-center">
                  <span className="text-xs text-muted-foreground block mb-1">Featured</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${selectedItem.isFeatured ? "bg-amber-500/10 text-amber-600" : "text-muted-foreground"}`}>
                    {selectedItem.isFeatured ? "Yes" : "No"}
                  </span>
                </div>
                <div className="p-3 bg-muted/10 rounded-xl border border-border/50 text-center">
                  <span className="text-xs text-muted-foreground block mb-1">Best Selling</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${selectedItem.isBestSelling ? "bg-emerald-500/10 text-emerald-600" : "text-muted-foreground"}`}>
                    {selectedItem.isBestSelling ? "Yes" : "No"}
                  </span>
                </div>
                <div className="p-3 bg-muted/10 rounded-xl border border-border/50 text-center">
                  <span className="text-xs text-muted-foreground block mb-1">Spicy</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${selectedItem.isSpicy ? "bg-rose-500/10 text-rose-600" : "text-muted-foreground"}`}>
                    {selectedItem.isSpicy ? "Yes" : "No"}
                  </span>
                </div>
                <div className="p-3 bg-muted/10 rounded-xl border border-border/50 text-center">
                  <span className="text-xs text-muted-foreground block mb-1">New Item</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${selectedItem.isNew ? "bg-blue-500/10 text-blue-600" : "text-muted-foreground"}`}>
                    {selectedItem.isNew ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              {/* Description */}
              {selectedItem.description && (
                <div className="p-4 sm:p-5 bg-card rounded-2xl border border-border/70 shadow-xs space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">বিবরণ</h4>
                  <div 
                    className="text-charcoal dark:text-cream font-bengali text-sm leading-relaxed prose-custom w-full overflow-hidden break-words"
                    dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(selectedItem.description) }}
                  />
                </div>
              )}

              {/* Additional Meta */}
              <div className="p-4 bg-muted/10 rounded-2xl border border-border/50 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground font-bengali">
                <div>
                  <span className="font-semibold text-charcoal mr-1">তৈরি করা হয়েছে:</span>
                  <span>{format(new Date(selectedItem.createdAt), "dd MMM, yyyy 'at' HH:mm")}</span>
                </div>
                {selectedItem.updatedAt && (
                  <div>
                    <span className="font-semibold text-charcoal mr-1">সর্বশেষ আপডেট:</span>
                    <span>{format(new Date(selectedItem.updatedAt), "dd MMM, yyyy 'at' HH:mm")}</span>
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
