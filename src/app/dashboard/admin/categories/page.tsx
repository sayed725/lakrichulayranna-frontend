"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search, RefreshCw, Filter, ImageIcon, Eye, MoreVertical } from "lucide-react";
import { format } from "date-fns";
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
import { getCategories, createCategory, updateCategory, deleteCategory as deleteCategoryApi, Category } from "@/services/category.service";
import AddCategoryForm from "@/components/dashboard/AddCategoryForm";
import USPagination from "@/components/shared/USPagination";
import CategoriesLoadingSkeleton from "@/components/dashboard/CategoriesLoadingSkeleton";
import { XCircle } from "lucide-react";

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [isActiveFilter, setIsActiveFilter] = useState("all");
  const [isFeaturedFilter, setIsFeaturedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    isActive: true,
    isFeatured: false,
  });

  const { data: categoryResponse, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories", page, debouncedSearch, isActiveFilter, isFeaturedFilter, sortBy, sortOrder],
    queryFn: () => getCategories({
      limit: 10,
      page,
      searchTerm: debouncedSearch,
      isActive: isActiveFilter === "active" ? true : isActiveFilter === "inactive" ? false : undefined,
      isFeatured: isFeaturedFilter === "featured" ? true : undefined,
      sortBy,
      sortOrder
    }),
    placeholderData: (previousData) => previousData,
  });

  const categories = categoryResponse?.data || [];
  const meta = categoryResponse?.meta;

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      triggerRevalidation({ tag: "categories" });
      toast.success("Category created successfully");
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create category");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => updateCategory(id, payload),
    onMutate: async ({ id, payload }) => {
      // Cancel outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: ["categories"] });

      // Snapshot previous query data for rollback on failure
      const previousQueriesData = queryClient.getQueriesData({ queryKey: ["categories"] });

      // Optimistically update all cached categories queries instantly (0ms delay!)
      queryClient.setQueriesData({ queryKey: ["categories"] }, (old: any) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: old.data.map((category: any) =>
            category.id === id ? { ...category, ...payload } : category
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
      toast.error(error.message || "Failed to update category");
    },
    onSuccess: () => {
      triggerRevalidation({ tag: "categories" });
      toast.success("Category updated successfully");
      setIsEditOpen(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      triggerRevalidation({ tag: "categories" });
      toast.success("Category deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete category");
    },
  });

  // if (categoriesLoading) return <CategoriesLoadingSkeleton />;

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      imageUrl: "",
      isActive: true,
      isFeatured: false,
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ id: selectedCategory.id, payload: formData });
  };

  const openEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      imageUrl: category.imageUrl || "",
      isActive: category.isActive ?? true,
      isFeatured: category.isFeatured ?? false,
    });
    setIsEditOpen(true);
  };

  const handleViewCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsViewDialogOpen(true);
  };

  const resetFilters = () => {
    setSearch("");
    setIsActiveFilter("all");
    setIsFeaturedFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  const isFiltered = search || isActiveFilter !== "all" || isFeaturedFilter !== "all";

  const getSortLabel = () => {
    if (sortBy === "createdAt" && sortOrder === "desc") return "Newest First";
    if (sortBy === "createdAt" && sortOrder === "asc") return "Oldest First";
    if (sortBy === "name" && sortOrder === "asc") return "Name: A-Z";
    if (sortBy === "name" && sortOrder === "desc") return "Name: Z-A";
    return "Sort By";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border">
        <div>
          <h1 className="text-2xl font-bold font-bengali text-charcoal">ক্যাটাগরিসমূহ</h1>
          <p className="text-muted-foreground text-sm hidden md:block font-bengali">মেনুর ক্যাটাগরি তৈরি এবং পরিচালনা করুন</p>
        </div>
        <Button onClick={() => { resetForm(); setIsCreateOpen(true); }} className="bg-fire text-white font-semibold hover:bg-fire-dark rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> নতুন ক্যাটাগরি
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-row gap-2 sm:gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
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
                  <SheetDescription className="sr-only">Filter and sort categories table</SheetDescription>
                  
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
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Featured</h3>
                    <Select value={isFeaturedFilter} onValueChange={(v) => { setIsFeaturedFilter(v || "all"); setPage(1); }}>
                      <SelectTrigger className="w-full h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
                        <SelectValue placeholder="All">
                          {isFeaturedFilter === "all" ? "All" :
                           isFeaturedFilter === "featured" ? "Featured" : "Featured"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="featured">Featured</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Sort By</h3>
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
                        <SelectItem value="name-asc">Name: A-Z</SelectItem>
                        <SelectItem value="name-desc">Name: Z-A</SelectItem>
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

          <Select value={isFeaturedFilter} onValueChange={(v) => { setIsFeaturedFilter(v || "all"); setPage(1); }}>
            <SelectTrigger className="w-[130px] h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
              <SelectValue placeholder="Featured">
                {isFeaturedFilter === "all" ? "All" :
                 isFeaturedFilter === "featured" ? "Featured" : "Featured"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
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
              <SelectItem value="name-asc">Name: A-Z</SelectItem>
              <SelectItem value="name-desc">Name: Z-A</SelectItem>
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

      {/* Table & Mobile Cards */}
      {categoriesLoading ? (
        <CategoriesLoadingSkeleton />
      ) : (
        <>
          {/* Mobile & Tablet Card View (< lg) */}
          <div className="lg:hidden space-y-3">
            {categories.map((category: Category) => (
              <div
                key={category.id}
                className="bg-white dark:bg-charcoal border border-border/80 dark:border-white/10 rounded-2xl p-3.5 space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {category.imageUrl ? (
                      <img src={category.imageUrl} alt={category.name} className="w-12 h-12 object-cover rounded-xl border border-border/60 shrink-0" />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center border border-border/60 shrink-0">
                        <ImageIcon className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-charcoal dark:text-cream truncate">{category.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">{category.description || "No description"}</p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-1.5 hover:bg-cream-dark/50 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-muted-foreground shrink-0">
                      <MoreVertical size={18} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem onClick={() => handleViewCategory(category)}>
                        <Eye size={16} className="mr-2" /> View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEdit(category)}>
                        <Pencil size={16} className="mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          toast.error("Confirm Deletion", {
                            description: `Are you sure you want to delete ${category.name}?`,
                            action: {
                              label: "Delete",
                              onClick: () => deleteMutation.mutate(category.id)
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
                        <Trash2 size={16} className="mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/50 dark:border-white/5 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">Active:</span>
                    <Switch
                      checked={category.isActive}
                      onCheckedChange={(checked) => {
                        updateMutation.mutate({
                          id: category.id,
                          payload: { isActive: checked }
                        });
                      }}
                      className="data-checked:bg-green-500 scale-90"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">Featured:</span>
                    <Switch
                      checked={category.isFeatured}
                      onCheckedChange={(checked) => {
                        updateMutation.mutate({
                          id: category.id,
                          payload: { isFeatured: checked }
                        });
                      }}
                      className="data-checked:bg-fire scale-90"
                    />
                  </div>
                </div>
              </div>
            ))}

            {categories.length === 0 && (
              <div className="p-8 text-center bg-card rounded-2xl border border-border text-muted-foreground">
                কোনো ক্যাটাগরি পাওয়া যায়নি।
              </div>
            )}
          </div>

          {/* Desktop Table View (>= lg) */}
          <div className="hidden lg:block border border-border bg-card rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-cream/50 dark:bg-charcoal-light/30 text-charcoal dark:text-cream text-xs uppercase font-bengali">
                  <tr>
                    <th className="px-6 py-4">Image</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Active Status</th>
                    <th className="px-6 py-4">Featured</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {categories.map((category: Category) => (
                    <tr key={category.id} className="hover:bg-cream/20 dark:hover:bg-charcoal-light/20 transition-colors">
                      <td className="px-6 py-4">
                        {category.imageUrl ? (
                          <img src={category.imageUrl} alt={category.name} className="w-10 h-10 object-cover rounded-lg border" />
                        ) : (
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center border">
                            <ImageIcon className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-charcoal dark:text-cream">{category.name}</td>
                      <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">{category.description || "-"}</td>
                      <td className="px-6 py-4">
                        <Switch
                          checked={category.isActive}
                          onCheckedChange={(checked) => {
                            updateMutation.mutate({
                              id: category.id,
                              payload: { isActive: checked }
                            });
                          }}
                          className="data-checked:bg-green-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <Switch
                          checked={category.isFeatured}
                          onCheckedChange={(checked) => {
                            updateMutation.mutate({
                              id: category.id,
                              payload: { isFeatured: checked }
                            });
                          }}
                          className="data-checked:bg-fire"
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="p-1.5 hover:bg-cream-dark/50 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-muted-foreground">
                            <MoreVertical size={18} />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl">
                            <DropdownMenuItem onClick={() => handleViewCategory(category)}>
                              <Eye size={16} className="mr-2" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEdit(category)}>
                              <Pencil size={16} className="mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                toast.error("Confirm Deletion", {
                                  description: `Are you sure you want to delete ${category.name}?`,
                                  action: {
                                    label: "Delete",
                                    onClick: () => deleteMutation.mutate(category.id)
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
                              <Trash2 size={16} className="mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                        কোনো ক্যাটাগরি পাওয়া যায়নি।
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
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
            <DialogTitle className="font-bengali">নতুন ক্যাটাগরি যোগ করুন</DialogTitle>
          </DialogHeader>
          <AddCategoryForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleCreateSubmit}
            isPending={createMutation.isPending}
            buttonText="ক্যাটাগরি তৈরি করুন"
            onCancel={() => { resetForm(); setIsCreateOpen(false); }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={(open) => { if (!open) resetForm(); setIsEditOpen(open); }}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-bengali">ক্যাটাগরি এডিট করুন</DialogTitle>
          </DialogHeader>
          <AddCategoryForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleEditSubmit}
            isPending={updateMutation.isPending}
            buttonText="ক্যাটাগরি আপডেট করুন"
            onCancel={() => { resetForm(); setIsEditOpen(false); }}
          />
        </DialogContent>
      </Dialog>

      {/* View Category Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="w-[95vw] sm:w-full sm:max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl sm:rounded-3xl border-border shadow-2xl">
          <DialogHeader className="p-4 sm:p-6 border-b border-border/60 bg-muted/10 pr-12">
            <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-lg sm:text-xl font-bold font-bengali text-charcoal flex items-center gap-2">
                  <Eye className="w-5 h-5 text-fire shrink-0" />
                  <span>ক্যাটাগরি বিস্তারিত</span>
                </DialogTitle>
                <DialogDescription className="text-muted-foreground text-xs mt-1 font-bengali">
                  ক্যাটাগরির বিস্তারিত তথ্য ও পরিসংখ্যান
                </DialogDescription>
              </div>
              {selectedCategory && (
                <span className={`px-3 py-1 rounded-full text-xs font-bold font-bengali shrink-0 ${
                  selectedCategory.isActive 
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" 
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                }`}>
                  {selectedCategory.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
                </span>
              )}
            </div>
          </DialogHeader>

          {selectedCategory && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Category Header Card */}
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 p-4 sm:p-5 bg-card rounded-2xl border border-border/70 shadow-xs">
                {selectedCategory.imageUrl ? (
                  <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-border/60 shrink-0 bg-muted/30 shadow-xs">
                    <Image
                      src={selectedCategory.imageUrl}
                      alt={selectedCategory.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-muted/30 flex items-center justify-center shrink-0 border border-border/60">
                    <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground/60" />
                  </div>
                )}

                <div className="space-y-2 min-w-0 flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-md bg-fire/10 text-fire text-xs font-bold font-latin">
                      {selectedCategory._count?.items || 0} Total Items
                    </span>
                    {selectedCategory.isFeatured && (
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 text-xs font-bold font-latin">
                        Featured
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold text-charcoal font-bengali leading-snug break-words">{selectedCategory.name}</h3>
                </div>
              </div>

              {/* Status & Featured Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3.5 sm:p-4 bg-muted/10 rounded-xl border border-border/50 text-center space-y-1">
                  <span className="text-xs text-muted-foreground block font-bengali">স্ট্যাটাস</span>
                  <span className={`text-xs sm:text-sm font-bold px-2.5 sm:px-3 py-0.5 rounded-md inline-block ${
                    selectedCategory.isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                  }`}>
                    {selectedCategory.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="p-3.5 sm:p-4 bg-muted/10 rounded-xl border border-border/50 text-center space-y-1">
                  <span className="text-xs text-muted-foreground block font-bengali">ফিচার্ড ক্যাটাগরি</span>
                  <span className={`text-xs sm:text-sm font-bold px-2.5 sm:px-3 py-0.5 rounded-md inline-block ${
                    selectedCategory.isFeatured ? "bg-amber-500/10 text-amber-600" : "text-muted-foreground bg-muted/30"
                  }`}>
                    {selectedCategory.isFeatured ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              {/* Description */}
              {selectedCategory.description && (
                <div className="p-4 sm:p-5 bg-card rounded-2xl border border-border/70 shadow-xs space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">বিবরণ</h4>
                  <p className="text-charcoal font-bengali text-sm leading-relaxed break-words">
                    {selectedCategory.description}
                  </p>
                </div>
              )}

              {/* Footer Meta */}
              <div className="p-3.5 sm:p-4 bg-muted/10 rounded-2xl border border-border/50 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground font-bengali">
                <div className="min-w-0">
                  <span className="font-semibold text-charcoal mr-1">তৈরি করা হয়েছে:</span>
                  <span>{format(new Date(selectedCategory.createdAt), "dd MMM, yyyy 'at' HH:mm")}</span>
                </div>
                {selectedCategory.updatedAt && (
                  <div className="min-w-0">
                    <span className="font-semibold text-charcoal mr-1">সর্বশেষ আপডেট:</span>
                    <span>{format(new Date(selectedCategory.updatedAt), "dd MMM, yyyy 'at' HH:mm")}</span>
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
