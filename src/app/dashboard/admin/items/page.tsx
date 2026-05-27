"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getItems, createItem, updateItem, deleteItem } from "@/services/item.service";
import { getCategories } from "@/services/category.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, ImageIcon, XCircle, Filter, Search, RefreshCw } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useToggleItemAvailability, useDeleteItem } from "@/features/item/hooks/useAdminItems";

export default function AdminItemsPage() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    weight: "",
    price: 0,
    categoryId: "",
    imageUrl: "",
    semiTitle: "",
    images: [] as string[],
    isAvailable: true,
    isFeatured: false,
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
      isAvailable: isAvailableFilter === "all" ? undefined : isAvailableFilter === "active",
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
      semiTitle: "",
      images: [],
      isAvailable: true,
      isFeatured: false,
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
      semiTitle: item.semiTitle || "",
      images: Array.isArray(item.images) ? item.images : (item.images ? [item.images] : []),
      isAvailable: item.isAvailable,
      isFeatured: item.isFeatured,
      isSpicy: item.isSpicy || false,
      description: item.description || "",
    });
    setIsEditOpen(true);
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

  if (itemsLoading) return <ItemsLoadingSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border">
        <div>
          <h1 className="text-2xl font-bold font-bengali text-charcoal">আইটেমসমূহ</h1>
          <p className="text-muted-foreground text-sm hidden md:block font-bengali">মেনুর সকল খাবার পরিচালনা করুন</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={(val) => {
          if (val) resetForm();
          setIsCreateOpen(val);
        }}>
          <Button className="bg-fire text-white font-semibold hover:bg-fire-dark" onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            নতুন আইটেম
          </Button>
          <DialogContent className="max-w-2xl">
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
                        <SelectValue placeholder="All Categories" />
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
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Status</h3>
                    <Select value={isAvailableFilter} onValueChange={(v) => { setIsAvailableFilter(v || "all"); setPage(1); }}>
                      <SelectTrigger className="w-full h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
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
                <SelectValue placeholder="Category" />
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
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
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

      <div className="border border-border bg-card rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-cream/50 dark:bg-charcoal-light/30 text-charcoal dark:text-cream text-xs uppercase font-bengali">
              <tr>
                <th className="px-6 py-4 w-16">Image</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4 text-center">Featured</th>
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
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" className="hover:bg-primary/10" size="icon" onClick={() => openEdit(item)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive border-border hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-destructive"
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
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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

      {meta && meta.totalPage > 1 && (
        <div className="mt-4 bg-card border-border rounded-xl overflow-hidden shadow-sm">
          <USPagination 
            page={page} 
            totalPage={meta.totalPage} 
            onPageChange={(p) => setPage(p)} 
          />
        </div>
      )}

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
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
    </div>
  );
}
