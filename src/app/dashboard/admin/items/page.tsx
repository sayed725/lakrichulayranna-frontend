"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getItems, createItem, updateItem, deleteItem } from "@/services/item.service";
import { getCategories } from "@/services/category.service";
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
  });

  const { data: catResponse } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const items = itemResponse?.data || [];
  const meta = itemResponse?.meta;
  const categories = catResponse?.data || [];

  const createMutation = useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast.success("Item updated successfully");
      setIsEditOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update item");
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
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border">
        <div>
          <h1 className="text-2xl font-bold font-bengali text-charcoal">আইটেমসমূহ</h1>
          <p className="text-muted-foreground text-sm hidden md:block font-bengali">মেনুর সকল খাবার পরিচালনা করুন</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={(val) => {
          if (val) {
            resetForm();
            if (categories.length > 0) {
              setFormData(prev => ({ ...prev, categoryId: categories[0].id }));
            }
          }
          setIsCreateOpen(val);
        }}>
          <Button className="bg-fire text-white font-semibold hover:bg-fire-dark" onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            নতুন আইটেম
          </Button>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>নতুন আইটেম তৈরি করুন</DialogTitle>
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
            className="pl-9 pr-10 h-11 w-full bg-background border-border focus-visible:ring-fire/20 focus-visible:border-fire/50 rounded-xl font-bengali"
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
        <div className="border border-border bg-card rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-cream/50 dark:bg-charcoal-light/30 text-charcoal dark:text-cream text-xs uppercase font-bengali">
                <tr>
                  <th className="px-6 py-4 w-16">Image</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-right">Price</th>
                  <th className="px-6 py-4 text-center">Best Selling</th>
                  <th className="px-6 py-4 text-center">Featured</th>
                  <th className="px-6 py-4 text-center">Cat. Featured</th>
                  <th className="px-6 py-4 text-center">New</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item: any) => (
                <tr key={item.id} className="hover:bg-cream/30 dark:hover:bg-charcoal-light/20 transition-colors">
                  <td className="px-6 py-4">
                    {item.imageUrl || (item.images && item.images[0]) ? (
                      <img src={item.imageUrl || item.images[0]} alt={item.name} className="w-10 h-10 object-cover rounded-md border-border" />
                    ) : (
                      <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center border-border">
                        <ImageIcon className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{item.weight} {item.isSpicy && '🌶️'}</div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{item.category?.name || "-"}</td>
                  <td className="px-6 py-4 text-right font-bold text-fire">{formatPrice(item.price)}</td>
                  <td className="px-6 py-4 text-center">
                    <Switch
                      checked={item.isBestSelling}
                      onCheckedChange={(checked) => {
                        updateMutation.mutate({
                          id: item.id,
                          payload: { isBestSelling: checked }
                        });
                      }}
                      disabled={updateMutation.isPending}
                      className="data-checked:bg-purple-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Switch
                      checked={item.isFeatured}
                      onCheckedChange={(checked) => {
                        updateMutation.mutate({
                          id: item.id,
                          payload: { isFeatured: checked }
                        });
                      }}
                      disabled={updateMutation.isPending}
                      className="data-checked:bg-amber-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Switch
                      checked={item.isCategoryFeatured}
                      onCheckedChange={(checked) => {
                        updateMutation.mutate({
                          id: item.id,
                          payload: { isCategoryFeatured: checked }
                        });
                      }}
                      disabled={updateMutation.isPending}
                      className="data-checked:bg-orange-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Switch
                      checked={item.isNew}
                      onCheckedChange={(checked) => {
                        updateMutation.mutate({
                          id: item.id,
                          payload: { isNew: checked }
                        });
                      }}
                      disabled={updateMutation.isPending}
                      className="data-checked:bg-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Switch 
                      checked={item.isAvailable}
                      onCheckedChange={(checked) => {
                        updateMutation.mutate({
                          id: item.id,
                          payload: { isAvailable: checked }
                        });
                      }}
                      disabled={updateMutation.isPending}
                      className="data-checked:bg-green-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-2 hover:bg-cream/50 rounded-lg transition-colors">
                        <MoreVertical size={18} className="text-muted-foreground" />
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
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                    No items found. Time to add some tasty snacks!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {meta && meta.totalPage > 1 && (
        <div className="mt-4 bg-card border-border rounded-xl overflow-hidden shadow-sm">
          <USPagination 
            page={page} 
            totalPage={meta.totalPage} 
            onPageChange={(p) => setPage(p)} 
          />
        </div>
      )}

      <Dialog open={isEditOpen} onOpenChange={(val) => {
        if (!val) resetForm();
        setIsEditOpen(val);
      }}>
        <DialogContent className="max-w-3xl">
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-bengali">আইটেম বিস্তারিত দেখুন</DialogTitle>
            <DialogDescription>সম্পূর্ণ আইটেমের বিস্তারিত তথ্য</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center gap-4 p-4 bg-cream/30 dark:bg-charcoal-light/20 rounded-lg">
                {selectedItem.imageUrl || (selectedItem.images && selectedItem.images[0]) ? (
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={selectedItem.imageUrl || selectedItem.images[0]}
                      alt={selectedItem.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-cream dark:bg-charcoal-light flex items-center justify-center shrink-0">
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-charcoal font-bengali">{selectedItem.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold text-fire text-lg">{formatPrice(selectedItem.price)}</span>
                    {selectedItem.weight && (
                      <span className="text-muted-foreground">• {selectedItem.weight}</span>
                    )}
                  </div>
                </div>
              </div>

              {selectedItem.description && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Description</label>
                  <p className="text-charcoal font-bengali">{selectedItem.description}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Category</label>
                <p className="text-charcoal">{selectedItem.category?.name || "-"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Status</label>
                  <p className="text-charcoal">{selectedItem.isAvailable ? "Available" : "Unavailable"}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Featured</label>
                  <p className="text-charcoal">{selectedItem.isFeatured ? "Yes" : "No"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Best Selling</label>
                  <p className="text-charcoal">{selectedItem.isBestSelling ? "Yes" : "No"}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Spicy</label>
                  <p className="text-charcoal">{selectedItem.isSpicy ? "Yes" : "No"}</p>
                </div>
              </div>

              {selectedItem.slug && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Slug</label>
                  <p className="text-charcoal font-mono text-sm">{selectedItem.slug}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Created At</label>
                <p className="text-charcoal">{format(new Date(selectedItem.createdAt), "dd MMM, yyyy 'at' HH:mm")}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
