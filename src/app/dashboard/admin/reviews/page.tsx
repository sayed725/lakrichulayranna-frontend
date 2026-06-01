"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Star, CheckCircle, Trash2, Search, Filter, RefreshCw, XCircle, Eye } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
  });

  const reviews = reviewResponse?.data || [];
  const meta = reviewResponse?.meta;

  const updateReviewStatusMutation = useMutation({
    mutationFn: async ({ reviewId, status }: { reviewId: string; status: string }) => {
      const res = await api.patch(`${API_ROUTES.ADMIN.REVIEWS}/${reviewId}/${status}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
      toast.success("রিভিউ স্ট্যাটাস আপডেট করা হয়েছে");
    },
    onError: (error: any) => {
      toast.error(error.message || "স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে");
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

  if (reviewsLoading) return <ReviewsLoadingSkeleton />;

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

      {/* Table */}
      <div className="border border-border bg-card rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-cream/50 dark:bg-charcoal-light/30 text-charcoal dark:text-cream text-xs uppercase font-bengali">
              <tr>
                <th className="px-6 py-4">Item & Customer</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Comment</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Featured</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reviews.map((review: any) => (
                <tr key={review.id} className="hover:bg-cream/30 dark:hover:bg-charcoal-light/20 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-charcoal font-bengali">{review.item?.name}</p>
                      <p className="text-xs text-muted-foreground font-bengali">{review.user?.name} • {format(new Date(review.createdAt), "dd MMM, yy")}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-warning">
                      <Star size={16} fill="currentColor" />
                      <span className="font-bold text-charcoal ml-1">{review.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-charcoal font-bengali max-w-xs truncate" title={review.comment}>
                      {review.comment || "-"}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Switch
                      checked={review.isApproved}
                      onCheckedChange={() => handleToggleStatus(review.id, review.isApproved)}
                      disabled={updateReviewStatusMutation.isPending}
                       className={"data-checked:bg-green-500"}
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Switch
                      checked={review.isFeatured || false}
                      onCheckedChange={() => handleToggleFeatured(review.id, review.isFeatured || false)}
                      disabled={updateReviewStatusMutation.isPending}
                      className={"data-checked:bg-amber-500"}
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="order-border hover:bg-blue-50"
                        onClick={() => handleViewReview(review)}
                      >
                        <Eye size={18} />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive border-border hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-destructive"
                        onClick={() => handleDelete(review.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No reviews found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="mt-4 bg-card border-border rounded-xl overflow-hidden shadow-sm">
          <USPagination 
            page={page} 
            totalPage={meta.totalPages} 
            onPageChange={(p) => setPage(p)} 
          />
        </div>
      )}

      {/* View Review Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-bengali">রিভিউ দেখুন</DialogTitle>
            <DialogDescription>সম্পূর্ণ রিভিউ বিস্তারিত</DialogDescription>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-charcoal font-bengali text-lg">{selectedReview.item?.name}</p>
                  <p className="text-sm text-muted-foreground font-bengali">{selectedReview.user?.name}</p>
                </div>
                <div className="flex items-center gap-1 text-warning">
                  <Star size={20} fill="currentColor" />
                  <span className="font-bold text-charcoal text-xl ml-1">{selectedReview.rating}</span>
                </div>
              </div>
              <div className="bg-cream/50 dark:bg-charcoal-light/30 p-4 rounded-lg">
                <p className="text-charcoal font-bengali whitespace-pre-wrap">{selectedReview.comment || "No comment"}</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>তারিখ: {format(new Date(selectedReview.createdAt), "dd MMM, yyyy HH:mm")}</span>
                <span className={`px-2 py-1 rounded-lg text-xs font-semibold font-bengali ${
                  selectedReview.isApproved ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                }`}>
                  {selectedReview.isApproved ? "অনুমোদিত" : "অপেক্ষমাণ"}
                </span>
                {selectedReview.isFeatured && (
                  <span className="px-2 py-1 rounded-lg text-xs font-semibold font-bengali bg-amber-100 text-amber-700">
                    ফিচার
                  </span>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
