"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Star, CheckCircle, Trash2, Search, Filter, RefreshCw, XCircle, Eye, MoreVertical, Copy, Check, Mail } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";
import ReviewsLoadingSkeleton from "@/components/dashboard/ReviewsLoadingSkeleton";
import USPagination from "@/components/shared/USPagination";


export default function AdminReviewsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [ratingFilter, setRatingFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(`${label} copied!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const { data: reviewResponse, isLoading: reviewsLoading } = useQuery({
    queryKey: ["admin", "reviews", page, debouncedSearch, ratingFilter, statusFilter, sortBy, sortOrder],
    queryFn: async () => {
      const res = await api.get(API_ROUTES.ADMIN.REVIEWS, {
        params: {
          limit: 10,
          page,
          searchTerm: debouncedSearch,
          rating: ratingFilter === "all" ? undefined : ratingFilter,
          isApproved: statusFilter === "approved" ? true : undefined,
          isFeatured: statusFilter === "featured" ? true : undefined,
          sortBy,
          sortOrder
        }
      });
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });

  const reviews = reviewResponse?.data || [];
  const meta = reviewResponse?.meta;

  const updateReviewStatusMutation = useMutation({
    mutationFn: async ({ reviewId, status }: { reviewId: string; status: string }) => {
      const res = await api.patch(`${API_ROUTES.ADMIN.REVIEWS}/${reviewId}/${status}`);
      return res.data;
    },
    onMutate: async ({ reviewId, status }) => {
      await queryClient.cancelQueries({ queryKey: ["admin", "reviews"] });

      const previousQueriesData = queryClient.getQueriesData({ queryKey: ["admin", "reviews"] });

      queryClient.setQueriesData({ queryKey: ["admin", "reviews"] }, (old: any) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: old.data.map((review: any) => {
            if (review.id !== reviewId) return review;
            const updatedReview = { ...review };
            if (status === 'approve') updatedReview.isApproved = true;
            if (status === 'unapprove') updatedReview.isApproved = false;
            if (status === 'feature') updatedReview.isFeatured = true;
            if (status === 'unfeature') updatedReview.isFeatured = false;
            return updatedReview;
          }),
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
      toast.error(error.message || "স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে");
    },
    onSuccess: () => {
      toast.success("রিভিউ স্ট্যাটাস আপডেট করা হয়েছে");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      const res = await api.delete(`${API_ROUTES.ADMIN.REVIEWS}/${reviewId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
      toast.success("রিভিউ মুছে ফেলা হয়েছে");
    },
    onError: (error: any) => {
      toast.error(error.message || "মুছে ফেলতে সমস্যা হয়েছে");
    },
  });

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    updateReviewStatusMutation.mutate({ reviewId: id, status: currentStatus ? 'unapprove' : 'approve' });
  };

  const handleToggleFeatured = (id: string, currentFeatured: boolean) => {
    updateReviewStatusMutation.mutate({ reviewId: id, status: currentFeatured ? 'unfeature' : 'feature' });
  };

  const handleDelete = (id: string) => {
    toast.error("Confirm Deletion", {
      description: "আপনি কি নিশ্চিত যে এই রিভিউটি মুছে ফেলতে চান?",
      action: {
        label: "Delete",
        onClick: () => deleteMutation.mutate(id)
      },
      cancel: {
        label: "Cancel",
        onClick: () => { }
      }
    });
  };

  const handleViewReview = (review: any) => {
    setSelectedReview(review);
    setIsViewDialogOpen(true);
  };

  const resetFilters = () => {
    setSearch("");
    setRatingFilter("all");
    setStatusFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  const isFiltered = search || ratingFilter !== "all" || statusFilter !== "all";

  const getSortLabel = () => {
    if (sortBy === "createdAt" && sortOrder === "desc") return "Newest First";
    if (sortBy === "createdAt" && sortOrder === "asc") return "Oldest First";
    if (sortBy === "rating" && sortOrder === "desc") return "Highest Rating";
    if (sortBy === "rating" && sortOrder === "asc") return "Lowest Rating";
    return "Sort By";
  };

  const columns = [
    {
      header: "আইটেম ও গ্রাহক",
      accessor: (row: any) => (
        <div>
          <p className="font-bold text-charcoal font-bengali">{row.item?.name}</p>
          <p className="text-xs text-muted font-bengali">{row.user?.name} • {format(new Date(row.createdAt), "dd MMM, yy")}</p>
        </div>
      ),
    },
    {
      header: "রেটিং",
      accessor: (row: any) => (
        <div className="flex items-center gap-1 text-warning">
          <Star size={16} fill="currentColor" />
          <span className="font-bold text-charcoal ml-1">{row.rating}</span>
        </div>
      ),
    },
    {
      header: "মতামত",
      accessor: (row: any) => (
        <p className="text-sm text-charcoal font-bengali max-w-xs truncate" title={row.comment}>
          {row.comment || "-"}
        </p>
      ),
    },
    {
      header: "স্ট্যাটাস",
      accessor: (row: any) => (
        <Switch
          checked={row.isApproved}
          onCheckedChange={() => handleToggleStatus(row.id, row.isApproved)}
          disabled={updateReviewStatusMutation.isPending}
        />
      ),
    },
    {
      header: "ফিচার",
      accessor: (row: any) => (
        <Switch
          checked={row.isFeatured || false}
          onCheckedChange={() => handleToggleFeatured(row.id, row.isFeatured || false)}
          disabled={updateReviewStatusMutation.isPending}
        />
      ),
    },
    {
      header: "অ্যাকশন",
      accessor: (row: any) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleViewReview(row)}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
            title="View Review"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
            title="মুছে ফেলুন"
            disabled={deleteMutation.isPending}
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
      className: "text-right",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border">
        <div>
          <h1 className="text-2xl font-bold font-bengali text-charcoal">রিভিউসমূহ</h1>
          <p className="text-muted-foreground text-sm hidden md:block font-bengali">গ্রাহকদের মতামত ও রেটিং পরিচালনা করুন</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-row gap-2 sm:gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reviews..."
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
                  <SheetDescription className="sr-only">Filter and sort reviews table</SheetDescription>
                  
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Rating</h3>
                    <Select value={ratingFilter} onValueChange={(v) => { setRatingFilter(v || "all"); setPage(1); }}>
                      <SelectTrigger className="w-full h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
                        <SelectValue placeholder="All Ratings">
                          {ratingFilter === "all" ? "All Ratings" : `${ratingFilter} Stars`}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="all">All Ratings</SelectItem>
                        <SelectItem value="5">5 Stars</SelectItem>
                        <SelectItem value="4">4 Stars</SelectItem>
                        <SelectItem value="3">3 Stars</SelectItem>
                        <SelectItem value="2">2 Stars</SelectItem>
                        <SelectItem value="1">1 Star</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Status</h3>
                    <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v || "all"); setPage(1); }}>
                      <SelectTrigger className="w-full h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
                        <SelectValue placeholder="All Status">
                          {statusFilter === "all" ? "All Status" :
                           statusFilter === "approved" ? "Approved" :
                           statusFilter === "featured" ? "Featured" : "Status"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
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
                        <SelectItem value="rating-desc">Highest Rating</SelectItem>
                        <SelectItem value="rating-asc">Lowest Rating</SelectItem>
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
            <Select value={ratingFilter} onValueChange={(v) => { setRatingFilter(v || "all"); setPage(1); }}>
              <SelectTrigger className="w-[130px] h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
                <SelectValue placeholder="Rating">
                  {ratingFilter === "all" ? "All Ratings" : `${ratingFilter} Stars`}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v || "all"); setPage(1); }}>
              <SelectTrigger className="w-[130px] h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
                <SelectValue placeholder="Status">
                  {statusFilter === "all" ? "All Status" :
                   statusFilter === "approved" ? "Approved" :
                   statusFilter === "featured" ? "Featured" : "Status"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
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
                <SelectItem value="rating-desc">Highest Rating</SelectItem>
                <SelectItem value="rating-asc">Lowest Rating</SelectItem>
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

      {/* Reviews List / Table */}
      {reviewsLoading ? (
        <ReviewsLoadingSkeleton />
      ) : (
        <>
          {/* Mobile & Tablet Card View (<1024px) */}
          <div className="lg:hidden space-y-3.5">
            {reviews.map((review: any) => {
              const customerName = review.user?.name || review.reviewerName || "Guest Reviewer";
              const customerEmail = review.user?.email || review.reviewerEmail || review.user?.phone || null;

              return (
                <div key={review.id} className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all space-y-3">
                  {/* Top Bar: Item Name & Actions */}
                  <div className="flex items-start justify-between gap-2 border-b border-border/50 pb-2.5">
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="font-bold text-charcoal font-bengali text-base truncate">{review.item?.name || "Unknown Item"}</p>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <div className="flex items-center gap-1 text-warning bg-warning/10 px-2 py-0.5 rounded-md border border-warning/20">
                          <Star size={13} fill="currentColor" />
                          <span className="font-bold text-charcoal text-xs">{review.rating}</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground font-latin">
                          {format(new Date(review.createdAt), "dd MMM, yyyy • hh:mm a")}
                        </span>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-1.5 hover:bg-fire/10 hover:text-fire rounded-lg transition-colors cursor-pointer text-muted-foreground shrink-0">
                        <MoreVertical size={18} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem onClick={() => handleViewReview(review)}>
                          <Eye size={16} className="mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(review.id)}
                          className="text-destructive focus:text-destructive"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 size={16} className="mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Customer Info */}
                  <div className="bg-muted/10 p-2.5 rounded-xl border border-border/40 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 min-w-0">
                        <span className="font-medium text-charcoal font-bengali text-xs truncate">{customerName}</span>
                      </div>
                      {customerName && (
                        <button
                          onClick={() => handleCopy(customerName, `cname-m-${review.id}`, 'Customer name')}
                          className="text-muted-foreground hover:text-fire p-1 rounded hover:bg-cream/50 transition-colors shrink-0"
                          title="Copy name"
                        >
                          {copiedKey === `cname-m-${review.id}` ? (
                            <Check className="w-3.5 h-3.5 text-green-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>

                    {(customerEmail || review.user?.phone) && (
                      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground font-latin border-t border-border/30 pt-1.5">
                        <div className="flex items-center gap-2 min-w-0 flex-wrap">
                          {customerEmail && (
                            <div className="flex items-center gap-1 min-w-0">
                              <Mail size={12} className="shrink-0" />
                              <span className="truncate">{customerEmail}</span>
                            </div>
                          )}
                          {review.user?.phone && (
                            <span className="text-[11px] text-muted-foreground font-mono">
                              • {review.user.phone}
                            </span>
                          )}
                        </div>
                        {customerEmail && (
                          <button
                            onClick={() => handleCopy(customerEmail, `cemail-m-${review.id}`, 'Customer email')}
                            className="text-muted-foreground hover:text-fire p-1 rounded hover:bg-cream/50 transition-colors shrink-0"
                            title="Copy email"
                          >
                            {copiedKey === `cemail-m-${review.id}` ? (
                              <Check className="w-3.5 h-3.5 text-green-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Comment */}
                  {review.comment && (
                    <p className="text-xs text-charcoal/90 font-bengali bg-cream/30 dark:bg-charcoal-light/20 p-2.5 rounded-xl border border-border/40 line-clamp-3 leading-relaxed">
                      "{review.comment}"
                    </p>
                  )}

                  {/* Status Toggles Bar */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/50">
                    <div className="flex items-center justify-between bg-muted/10 px-3 py-2 rounded-xl border border-border/40">
                      <span className="text-xs font-semibold text-charcoal font-bengali">Approved</span>
                      <Switch
                        checked={review.isApproved}
                        onCheckedChange={() => handleToggleStatus(review.id, review.isApproved)}
                        className="data-checked:bg-green-500"
                        disabled={updateReviewStatusMutation.isPending}
                      />
                    </div>

                    <div className="flex items-center justify-between bg-muted/10 px-3 py-2 rounded-xl border border-border/40">
                      <span className="text-xs font-semibold text-charcoal font-bengali">Featured</span>
                      <Switch
                        checked={review.isFeatured || false}
                        onCheckedChange={() => handleToggleFeatured(review.id, review.isFeatured || false)}
                        className="data-checked:bg-amber-500"
                        disabled={updateReviewStatusMutation.isPending}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            {reviews.length === 0 && (
              <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground font-bengali">
                কোনো রিভিউ পাওয়া যায়নি।
              </div>
            )}
          </div>

          {/* Desktop Table View (>=1024px) */}
          <div className="hidden lg:block border border-border bg-card rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-cream/50 dark:bg-charcoal-light/30 text-charcoal dark:text-cream text-xs uppercase font-bengali">
                  <tr>
                    <th className="px-4 py-3 font-bold">Item</th>
                    <th className="px-4 py-3 font-bold">Customer</th>
                    <th className="px-4 py-3 font-bold">Date</th>
                    <th className="px-4 py-3 font-bold">Rating</th>
                    <th className="px-4 py-3 font-bold">Comment</th>
                    <th className="px-4 py-3 font-bold text-center">Status</th>
                    <th className="px-4 py-3 font-bold text-center">Featured</th>
                    <th className="px-4 py-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {reviews.map((review: any) => {
                    const customerName = review.user?.name || review.reviewerName || "Guest Reviewer";
                    const customerEmail = review.user?.email || review.reviewerEmail || review.user?.phone || null;

                    return (
                      <tr key={review.id} className="hover:bg-cream/30 dark:hover:bg-charcoal-light/20 transition-colors">
                        {/* Item */}
                        <td className="px-4 py-3 align-middle">
                          <p className="font-bold text-charcoal font-bengali truncate">{review.item?.name || "Unknown Item"}</p>
                        </td>

                        {/* Customer (Name & Email) */}
                        <td className="px-4 py-3 align-middle">
                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-1 group/cname">
                              <span className="font-medium text-charcoal font-bengali text-sm">{customerName}</span>
                              {customerName && (
                                <button
                                  onClick={() => handleCopy(customerName, `cname-${review.id}`, 'Customer name')}
                                  className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 opacity-100 lg:opacity-0 lg:group-hover/cname:opacity-100 focus:opacity-100 cursor-pointer shrink-0"
                                  title="Copy customer name"
                                >
                                  {copiedKey === `cname-${review.id}` ? (
                                    <Check className="w-3.5 h-3.5 text-green-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              )}
                            </div>
                            <div className="flex items-center gap-1 group/cemail text-xs text-muted-foreground font-latin">
                              <Mail size={12} className="shrink-0" />
                              <span className="truncate">{customerEmail || "No email"}</span>
                              {customerEmail && (
                                <button
                                  onClick={() => handleCopy(customerEmail, `cemail-${review.id}`, 'Customer email')}
                                  className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 opacity-100 lg:opacity-0 lg:group-hover/cemail:opacity-100 focus:opacity-100 cursor-pointer shrink-0"
                                  title="Copy customer email"
                                >
                                  {copiedKey === `cemail-${review.id}` ? (
                                    <Check className="w-3.5 h-3.5 text-green-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Date & Time */}
                        <td className="px-4 py-3 align-middle text-xs whitespace-nowrap font-latin">
                          <div className="font-medium text-charcoal">{format(new Date(review.createdAt), "dd MMM, yyyy")}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">{format(new Date(review.createdAt), "hh:mm a")}</div>
                        </td>

                        {/* Rating */}
                        <td className="px-4 py-3 align-middle">
                          <div className="flex items-center gap-1 text-warning">
                            <Star size={16} fill="currentColor" />
                            <span className="font-bold text-charcoal ml-1">{review.rating}</span>
                          </div>
                        </td>

                        {/* Comment */}
                        <td className="px-4 py-3 align-middle">
                          <p className="text-sm text-charcoal font-bengali max-w-xs truncate" title={review.comment}>
                            {review.comment || "-"}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3 text-center align-middle">
                          <Switch
                            checked={review.isApproved}
                            onCheckedChange={() => handleToggleStatus(review.id, review.isApproved)}
                            className={"data-checked:bg-green-500"}
                          />
                        </td>

                        {/* Featured */}
                        <td className="px-4 py-3 text-center align-middle">
                          <Switch
                            checked={review.isFeatured || false}
                            onCheckedChange={() => handleToggleFeatured(review.id, review.isFeatured || false)}
                            className={"data-checked:bg-amber-500"}
                          />
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right align-middle">
                          <DropdownMenu>
                            <DropdownMenuTrigger className="p-2 hover:bg-fire/10 hover:text-fire rounded-lg transition-colors cursor-pointer text-muted-foreground">
                              <MoreVertical size={18} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewReview(review)}>
                                <Eye size={16} className="mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(review.id)}
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
                    );
                  })}
                {reviews.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground font-bengali">
                      No reviews found.
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
            onPageChange={(p) => setPage(p)} 
          />
        </div>
      )}

      {/* View Review Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="w-[95vw] sm:w-full sm:max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl sm:rounded-3xl border-border shadow-2xl">
          <DialogHeader className="p-4 sm:p-6 border-b border-border/60 bg-muted/10 pr-12">
            <div className="flex items-center justify-between gap-4">
              <div>
                <DialogTitle className="text-xl font-bold font-bengali text-charcoal flex items-center gap-2">
                  <Eye className="w-5 h-5 text-fire shrink-0" />
                  <span>রিভিউ বিস্তারিত</span>
                </DialogTitle>
                <DialogDescription className="text-muted-foreground text-xs mt-1 font-bengali">
                  গ্রাহকের মতামত ও রেটিং বিস্তারিত
                </DialogDescription>
              </div>
              {selectedReview && (
                <span className={`px-3 py-1 rounded-full text-xs font-bold font-bengali ${
                  selectedReview.isApproved 
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" 
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                }`}>
                  {selectedReview.isApproved ? "অনুমোদিত" : "অপেক্ষমাণ"}
                </span>
              )}
            </div>
          </DialogHeader>

          {selectedReview && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* Product Info & Rating Header */}
              <div className="p-5 bg-card rounded-2xl border border-border/70 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1.5 min-w-0 flex-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">আইটেমের নাম</span>
                  <h3 className="text-lg sm:text-xl font-bold text-charcoal font-bengali truncate">{selectedReview.item?.name || "Unknown Item"}</h3>
                </div>

                <div className="flex flex-col items-start sm:items-end shrink-0">
                  <span className="text-xs text-muted-foreground mb-1 font-bengali">রেটিং</span>
                  <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < (selectedReview.rating || 0) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-charcoal font-latin text-base ml-1">{selectedReview.rating}.0</span>
                  </div>
                </div>
              </div>

              {/* Reviewer Profile & Badges */}
              <div className="p-4 bg-muted/10 rounded-2xl border border-border/50 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-fire/10 text-fire font-bold flex items-center justify-center font-bengali shrink-0">
                    {(selectedReview.user?.name || selectedReview.reviewerName || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 group/modalcname">
                      <h4 className="font-bold text-charcoal font-bengali text-sm">
                        {selectedReview.user?.name || selectedReview.reviewerName || "Guest Reviewer"}
                      </h4>
                      {(selectedReview.user?.name || selectedReview.reviewerName) && (
                        <button
                          onClick={() => handleCopy(selectedReview.user?.name || selectedReview.reviewerName, 'modal-cname', 'Customer name')}
                          className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 opacity-100 lg:opacity-0 lg:group-hover/modalcname:opacity-100 focus:opacity-100 cursor-pointer shrink-0"
                          title="Copy customer name"
                        >
                          {copiedKey === 'modal-cname' ? (
                            <Check className="w-3.5 h-3.5 text-green-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-1 group/modalcemail text-xs text-muted-foreground font-latin">
                      <span>{selectedReview.user?.email || selectedReview.reviewerEmail || selectedReview.user?.phone || "No Email"}</span>
                      {(selectedReview.user?.email || selectedReview.reviewerEmail) && (
                        <button
                          onClick={() => handleCopy(selectedReview.user?.email || selectedReview.reviewerEmail, 'modal-cemail', 'Customer email')}
                          className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 opacity-100 lg:opacity-0 lg:group-hover/modalcemail:opacity-100 focus:opacity-100 cursor-pointer shrink-0"
                          title="Copy customer email"
                        >
                          {copiedKey === 'modal-cemail' ? (
                            <Check className="w-3.5 h-3.5 text-green-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedReview.isFeatured && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold font-bengali bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                      ফিচার্ড রিভিউ 🔥
                    </span>
                  )}
                </div>
              </div>

              {/* Review Comment Box */}
              <div className="p-5 bg-card rounded-2xl border border-border/70 shadow-xs space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">গ্রাহকের মন্তব্য</h4>
                <p className="text-charcoal font-bengali text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {selectedReview.comment || "কোনো মন্তব্য নেই।"}
                </p>
              </div>

              {/* Footer Meta */}
              <div className="p-4 bg-muted/10 rounded-2xl border border-border/50 flex items-center justify-between text-xs text-muted-foreground font-bengali">
                <div>
                  <span className="font-semibold text-charcoal mr-1">রিভিউর তারিখ:</span>
                  <span className="font-latin">{format(new Date(selectedReview.createdAt), "dd MMM, yyyy 'at' HH:mm")}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
