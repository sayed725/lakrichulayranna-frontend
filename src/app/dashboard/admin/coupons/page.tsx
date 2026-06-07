"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Plus, Edit2, Trash2, Search, RefreshCw, Eye, XCircle, Percent, DollarSign, MoreVertical, Filter } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";
import { useAdminCoupons, useToggleCoupon, useCreateCoupon, useUpdateCoupon } from "@/features/coupon/hooks/useAdminCoupons";
import { formatPrice } from "@/lib/utils";

import USPagination from "@/components/shared/USPagination";
import CouponsLoadingSkeleton from "@/components/dashboard/CouponsLoadingSkeleton";

export default function AdminCouponsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [isActiveFilter, setIsActiveFilter] = useState("all");
  const [discountTypeFilter, setDiscountTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    minOrderAmount: "",
    maxDiscountAmount: "",
    expiryDate: "",
    usageLimit: "",
    isActive: true,
    description: "",
  });

  const { data: couponResponse, isLoading: couponsLoading } = useAdminCoupons({
    page,
    limit: 10,
    searchTerm: debouncedSearch,
    isActive: isActiveFilter === "active" ? true : isActiveFilter === "inactive" ? false : undefined,
    discountType: discountTypeFilter === "all" ? undefined : discountTypeFilter,
    sortBy,
    sortOrder,
  });

  const coupons = couponResponse?.data || [];
  const meta = couponResponse?.meta;

  const toggleCoupon = useToggleCoupon();
  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`${API_ROUTES.ADMIN.COUPONS}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
      toast.success("Coupon deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete coupon");
    },
  });

  const handleToggle = (id: string, currentStatus: boolean) => {
    toggleCoupon.mutate({ couponId: id, isActive: !currentStatus });
  };

  const handleViewCoupon = (coupon: any) => {
    setSelectedCoupon(coupon);
    setIsViewDialogOpen(true);
  };

  const handleOpenCreateDialog = () => {
    setEditingCoupon(null);
    setFormData({
      code: "",
      title: "",
      discountType: "PERCENTAGE",
      discountValue: "",
      minOrderAmount: "",
      maxDiscountAmount: "",
      expiryDate: "",
      usageLimit: "",
      isActive: true,
      description: "",
    });
    setIsFormDialogOpen(true);
  };

  const handleOpenEditDialog = (coupon: any) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      title: coupon.title,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      minOrderAmount: coupon.minOrderAmount?.toString() || "",
      maxDiscountAmount: coupon.maxDiscountAmount?.toString() || "",
      expiryDate: format(new Date(coupon.expiryDate), "yyyy-MM-dd'T'HH:mm"),
      usageLimit: coupon.usageLimit?.toString() || "",
      isActive: coupon.isActive,
      description: coupon.description || "",
    });
    setIsFormDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      discountValue: parseFloat(formData.discountValue),
      minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : undefined,
      maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : undefined,
      usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
      expiryDate: new Date(formData.expiryDate).toISOString(),
    };

    if (editingCoupon) {
      updateCoupon.mutate({ id: editingCoupon.id, data: payload });
    } else {
      createCoupon.mutate(payload);
    }
    setIsFormDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    toast.error("Confirm Deletion", {
      description: "Are you sure you want to delete this coupon?",
      action: {
        label: "Delete",
        onClick: () => deleteMutation.mutate(id),
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  const resetFilters = () => {
    setSearch("");
    setIsActiveFilter("all");
    setDiscountTypeFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  const isFiltered = search || isActiveFilter !== "all" || discountTypeFilter !== "all";

  const getSortLabel = () => {
    if (sortBy === "createdAt" && sortOrder === "desc") return "Newest First";
    if (sortBy === "createdAt" && sortOrder === "asc") return "Oldest First";
    if (sortBy === "discountValue" && sortOrder === "desc") return "Highest Value";
    if (sortBy === "discountValue" && sortOrder === "asc") return "Lowest Value";
    return "Sort By";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border">
        <div>
          <h1 className="text-2xl font-bold font-bengali text-charcoal">কুপনসমূহ</h1>
          <p className="text-muted-foreground text-sm hidden md:block font-bengali">ডিসকাউন্ট কুপন তৈরি ও পরিচালনা করুন</p>
        </div>
        <Button onClick={handleOpenCreateDialog} className="bg-fire text-white font-semibold hover:bg-fire-dark rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> নতুন কুপন
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-row gap-2 sm:gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search coupons..."
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
                  <SheetDescription className="sr-only">Filter and sort coupons table</SheetDescription>

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
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Discount Type</h3>
                    <Select value={discountTypeFilter} onValueChange={(v) => { setDiscountTypeFilter(v || "all"); setPage(1); }}>
                      <SelectTrigger className="w-full h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
                        <SelectValue placeholder="All Types">
                          {discountTypeFilter === "all" ? "All Types" :
                           discountTypeFilter === "PERCENTAGE" ? "Percentage" :
                           discountTypeFilter === "FIXED" ? "Fixed" : "Type"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                        <SelectItem value="FIXED">Fixed</SelectItem>
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
                        <SelectItem value="discountValue-desc">Highest Value</SelectItem>
                        <SelectItem value="discountValue-asc">Lowest Value</SelectItem>
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

            <Select value={discountTypeFilter} onValueChange={(v) => { setDiscountTypeFilter(v || "all"); setPage(1); }}>
              <SelectTrigger className="w-[140px] h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
                <SelectValue placeholder="Type">
                  {discountTypeFilter === "all" ? "All Types" :
                   discountTypeFilter === "PERCENTAGE" ? "Percentage" :
                   discountTypeFilter === "FIXED" ? "Fixed" : "Type"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                <SelectItem value="FIXED">Fixed</SelectItem>
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
                <SelectItem value="discountValue-desc">Highest Value</SelectItem>
                <SelectItem value="discountValue-asc">Lowest Value</SelectItem>
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
      {couponsLoading ? (
        <CouponsLoadingSkeleton />
      ) : (
        <div className="border border-border bg-card rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-cream/50 dark:bg-charcoal-light/30 text-charcoal dark:text-cream text-xs uppercase font-bengali">
                <tr>
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Discount</th>
                  <th className="px-6 py-4">Usage</th>
                  <th className="px-6 py-4">Expiry</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {coupons.map((coupon: any) => (
                  <tr key={coupon.id} className="hover:bg-cream/30 dark:hover:bg-charcoal-light/20 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-bold text-charcoal font-mono bg-cream px-2 py-1 rounded-lg border border-border">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-charcoal font-bengali">{coupon.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 font-bold text-fire">
                        {coupon.discountType === "PERCENTAGE" ? (
                          <>
                            {/* <Percent size={14} /> */}
                            <span>{coupon.discountValue}%</span>
                          </>
                        ) : (
                          <>
                            {/* <DollarSign size={14} /> */}
                            <span>{formatPrice(coupon.discountValue)}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-charcoal">
                        {coupon.usedCount} / {coupon.usageLimit || "∞"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(coupon.expiryDate), "dd MMM, yyyy")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Switch
                        checked={coupon.isActive}
                        onCheckedChange={() => handleToggle(coupon.id, coupon.isActive)}
                        disabled={toggleCoupon.isPending}
                        className={"data-checked:bg-green-500"}
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-2 hover:bg-cream/50 rounded-lg transition-colors">
                          <MoreVertical size={18} className="text-muted-foreground" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewCoupon(coupon)}>
                            <Eye size={16} className="mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenEditDialog(coupon)}>
                            <Edit2 size={16} className="mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(coupon.id)}
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
                {coupons.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                      No coupons found.
                    </td>
                  </tr>
                )}
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
            onPageChange={(p) => setPage(p)} 
          />
        </div>
      )}

      {/* Coupon Form Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-bengali">
              {editingCoupon ? "কুপন এডিট করুন" : "নতুন কুপন তৈরি করুন"}
            </DialogTitle>
            <DialogDescription>
              {editingCoupon ? "কুপনের তথ্য আপডেট করুন" : "নতুন কুপন তৈরি করুন"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Coupon Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="SAVE10"
                  required
                  className="bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Summer Sale"
                  required
                  className="bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountType">Discount Type *</Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(v) => setFormData({ ...formData, discountType: v || "PERCENTAGE" })}
                >
                  <SelectTrigger className="bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                    <SelectItem value="FIXED">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountValue">Discount Value *</Label>
                <Input
                  id="discountValue"
                  type="number"
                  step="0.01"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                  placeholder={formData.discountType === "PERCENTAGE" ? "10" : "100"}
                  required
                  className="bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minOrderAmount">Min Order Amount</Label>
                <Input
                  id="minOrderAmount"
                  type="number"
                  step="0.01"
                  value={formData.minOrderAmount}
                  onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                  placeholder="500"
                  className="bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxDiscountAmount">Max Discount Amount</Label>
                <Input
                  id="maxDiscountAmount"
                  type="number"
                  step="0.01"
                  value={formData.maxDiscountAmount}
                  onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                  placeholder="1000"
                  className="bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  type="datetime-local"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  required
                  className="bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="usageLimit">Usage Limit</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  placeholder="100"
                  className="bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Coupon description..."
                rows={3}
                className="bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl"
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(v) => setFormData({ ...formData, isActive: v })}
                className={"data-checked:bg-green-500"}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormDialogOpen(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createCoupon.isPending || updateCoupon.isPending}
                className="bg-fire text-white hover:bg-fire-dark rounded-xl"
              >
                {editingCoupon ? "Update Coupon" : "Create Coupon"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Coupon Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-bengali">কুপন বিস্তারিত দেখুন</DialogTitle>
            <DialogDescription>সম্পূর্ণ কুপনের বিস্তারিত তথ্য</DialogDescription>
          </DialogHeader>
          {selectedCoupon && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between p-4 bg-cream/30 dark:bg-charcoal-light/20 rounded-lg">
                <div>
                  <span className="font-bold text-charcoal font-mono text-xl bg-cream px-3 py-2 rounded-lg border border-border">
                    {selectedCoupon.code}
                  </span>
                </div>
                <div className="flex items-center gap-1 font-bold text-fire text-xl">
                  {selectedCoupon.discountType === "PERCENTAGE" ? (
                    <>
                      {/* <Percent size={20} /> */}
                      <span>{selectedCoupon.discountValue}%</span>
                    </>
                  ) : (
                    <>
                      {/* <DollarSign size={20} /> */}
                      <span>{formatPrice(selectedCoupon.discountValue)}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Title</label>
                <p className="text-charcoal font-bengali">{selectedCoupon.title}</p>
              </div>

              {selectedCoupon.description && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Description</label>
                  <p className="text-charcoal font-bengali">{selectedCoupon.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Min Order Amount</label>
                  <p className="text-charcoal">{selectedCoupon.minOrderAmount ? formatPrice(selectedCoupon.minOrderAmount) : "No minimum"}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Max Discount Amount</label>
                  <p className="text-charcoal">{selectedCoupon.maxDiscountAmount ? formatPrice(selectedCoupon.maxDiscountAmount) : "No limit"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Usage Limit</label>
                  <p className="text-charcoal">{selectedCoupon.usageLimit || "Unlimited"}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Used Count</label>
                  <p className="text-charcoal">{selectedCoupon.usedCount}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Expiry Date</label>
                  <p className="text-charcoal">{format(new Date(selectedCoupon.expiryDate), "dd MMM, yyyy 'at' HH:mm")}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Status</label>
                  <p className="text-charcoal">{selectedCoupon.isActive ? "Active" : "Inactive"}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Created At</label>
                <p className="text-charcoal">{format(new Date(selectedCoupon.createdAt), "dd MMM, yyyy 'at' HH:mm")}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
