"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Mail, Phone, Shield, Trash2, Search, Filter, RefreshCw, XCircle, Eye, MoreVertical } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import USPagination from "@/components/shared/USPagination";
import UsersLoadingSkeleton from "@/components/dashboard/UsersLoadingSkeleton";

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const { data: userResponse, isLoading: usersLoading } = useQuery({
    queryKey: ["admin", "users", page, debouncedSearch, roleFilter, statusFilter, sortBy, sortOrder],
    queryFn: async () => {
      const res = await api.get(API_ROUTES.ADMIN.USERS, {
        params: {
          limit: 10,
          page,
          searchTerm: debouncedSearch,
          role: roleFilter === "all" ? undefined : roleFilter,
          status: statusFilter === "all" ? undefined : statusFilter,
          sortBy,
          sortOrder
        }
      });
      return res.data;
    },
  });

  const users = userResponse?.data || [];
  const meta = userResponse?.meta;

  const updateStatusMutation = useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: string }) => {
      const res = await api.patch(`${API_ROUTES.ADMIN.USERS}/${userId}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("ব্যবহারকারী স্ট্যাটাস আপডেট করা হয়েছে");
    },
    onError: (error: any) => {
      toast.error(error.message || "স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      const res = await api.delete(`${API_ROUTES.ADMIN.USERS}/${userId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("ব্যবহারকারী মুছে ফেলা হয়েছে");
    },
    onError: (error: any) => {
      toast.error(error.message || "মুছে ফেলতে সমস্যা হয়েছে");
    },
  });

  const handleStatusChange = (userId: string, newStatus: string) => {
    updateStatusMutation.mutate({ userId, status: newStatus });
  };

  const handleDelete = (userId: string) => {
    toast.error("Confirm Deletion", {
      description: "আপনি কি নিশ্চিত যে এই ব্যবহারকারীকে মুছে ফেলতে চান?",
      action: {
        label: "Delete",
        onClick: () => deleteMutation.mutate(userId)
      },
      cancel: {
        label: "Cancel",
        onClick: () => { }
      }
    });
  };

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  const resetFilters = () => {
    setSearch("");
    setRoleFilter("all");
    setStatusFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  const isFiltered = search || roleFilter !== "all" || statusFilter !== "all";

  const getSortLabel = () => {
    if (sortBy === "createdAt" && sortOrder === "desc") return "Newest First";
    if (sortBy === "createdAt" && sortOrder === "asc") return "Oldest First";
    if (sortBy === "name" && sortOrder === "asc") return "Name: A to Z";
    if (sortBy === "name" && sortOrder === "desc") return "Name: Z to A";
    return "Sort By";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border">
        <div>
          <h1 className="text-2xl font-bold font-bengali text-charcoal">ব্যবহারকারী</h1>
          <p className="text-muted-foreground text-sm hidden md:block font-bengali">সিস্টেমের সকল ব্যবহারকারীর তালিকা</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-row gap-2 sm:gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
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
                  <SheetDescription className="sr-only">Filter and sort users table</SheetDescription>
                  
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Role</h3>
                    <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v || "all"); setPage(1); }}>
                      <SelectTrigger className="w-full h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
                        <SelectValue placeholder="All Roles">
                          {roleFilter === "all" ? "All Roles" : roleFilter}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="CUSTOMER">Customer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Status</h3>
                    <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v || "all"); setPage(1); }}>
                      <SelectTrigger className="w-full h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
                        <SelectValue placeholder="All Status">
                          {statusFilter === "all" ? "All Status" :
                           statusFilter === "ACTIVE" ? "Active" :
                           statusFilter === "INACTIVE" ? "Inactive" :
                           statusFilter === "BANNED" ? "Banned" : "Status"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                        <SelectItem value="BANNED">Banned</SelectItem>
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
                        <SelectItem value="name-asc">Name: A to Z</SelectItem>
                        <SelectItem value="name-desc">Name: Z to A</SelectItem>
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
            <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v || "all"); setPage(1); }}>
              <SelectTrigger className="w-[130px] h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
                <SelectValue placeholder="Role">
                  {roleFilter === "all" ? "All Roles" : roleFilter}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="CUSTOMER">Customer</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v || "all"); setPage(1); }}>
              <SelectTrigger className="w-[130px] h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
                <SelectValue placeholder="Status">
                  {statusFilter === "all" ? "All Status" :
                   statusFilter === "ACTIVE" ? "Active" :
                   statusFilter === "INACTIVE" ? "Inactive" :
                   statusFilter === "BANNED" ? "Banned" : "Status"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="BANNED">Banned</SelectItem>
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

      {/* Table */}
      {usersLoading ? (
        <UsersLoadingSkeleton />
      ) : (
        <div className="border border-border bg-card rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-cream/50 dark:bg-charcoal-light/30 text-charcoal dark:text-cream text-xs uppercase font-bengali">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 text-center">Orders</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user: any) => (
                <tr key={user.id} className="hover:bg-cream/30 dark:hover:bg-charcoal-light/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-charcoal font-bold shrink-0">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-bold text-charcoal font-bengali">{user.name}</p>
                        <p className="text-xs text-muted-foreground font-latin">{format(new Date(user.createdAt), "dd MMM, yyyy")}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-charcoal">
                        <Mail size={14} className="text-muted-foreground" />
                        <span className="font-latin">{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2 text-sm text-charcoal">
                          <Phone size={14} className="text-muted-foreground" />
                          <span className="font-latin">{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {user.role === "ADMIN" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-fire/10 text-fire text-xs font-bold font-latin">
                          <Shield size={12} />
                          ADMIN
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-cream-dark text-charcoal text-xs font-bold font-latin">
                          CUSTOMER
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-bold text-charcoal bg-cream px-3 py-1 rounded-full">
                      {user._count?.orders || user.orders?.length || 0} টি
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.role === "ADMIN" ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-bold font-latin">
                        Active
                      </span>
                    ) : (
                      <Select
                        value={user.status}
                        onValueChange={(value) => handleStatusChange(user.id, value)}
                        disabled={updateStatusMutation.isPending}
                      >
                        <SelectTrigger className="w-[130px] h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="INACTIVE">Inactive</SelectItem>
                          <SelectItem value="BANNED">Banned</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-2 hover:bg-cream/50 rounded-lg transition-colors">
                        <MoreVertical size={18} className="text-muted-foreground" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewUser(user)}>
                          <Eye size={16} className="mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(user.id)}
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
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No users found.
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

      {/* View User Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-bengali">ব্যবহারকারী তথ্য দেখুন</DialogTitle>
            <DialogDescription>সম্পূর্ণ ব্যবহারকারী বিস্তারিত</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center text-charcoal font-bold text-2xl shrink-0">
                  {selectedUser.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <p className="font-bold text-charcoal font-bengali text-xl">{selectedUser.name}</p>
                  <p className="text-sm text-muted-foreground font-latin">{selectedUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-cream/50 dark:bg-charcoal-light/30 p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground font-bengali mb-1">ফোন নম্বর</p>
                  <p className="text-charcoal font-latin font-semibold">{selectedUser.phone || "N/A"}</p>
                </div>
                <div className="bg-cream/50 dark:bg-charcoal-light/30 p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground font-bengali mb-1">ঠিকানা</p>
                  <p className="text-charcoal font-bengali font-semibold">{selectedUser.address || "N/A"}</p>
                </div>
                <div className="bg-cream/50 dark:bg-charcoal-light/30 p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground font-bengali mb-1">রোল</p>
                  <p className="text-charcoal font-latin font-semibold">{selectedUser.role}</p>
                </div>
                <div className="bg-cream/50 dark:bg-charcoal-light/30 p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground font-bengali mb-1">স্ট্যাটাস</p>
                  <p className="text-charcoal font-latin font-semibold">{selectedUser.status}</p>
                </div>
                <div className="bg-cream/50 dark:bg-charcoal-light/30 p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground font-bengali mb-1">মোট অর্ডার</p>
                  <p className="text-charcoal font-bengali font-semibold">{selectedUser._count?.orders || 0} টি</p>
                </div>
                <div className="bg-cream/50 dark:bg-charcoal-light/30 p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground font-bengali mb-1">যোগদান তারিখ</p>
                  <p className="text-charcoal font-latin font-semibold">{format(new Date(selectedUser.createdAt), "dd MMM, yyyy")}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
