"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Mail, Phone, Shield, Trash2, Search, Filter, RefreshCw, XCircle, Eye, MoreVertical, Copy, Check, MapPin } from "lucide-react";
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
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string, label: string) => {
    if (!text || text === 'N/A') return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(`${label} copied!`, {
      description: `${text} copied to clipboard`,
    });
    setTimeout(() => setCopiedKey(null), 2000);
  };

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
    placeholderData: (previousData) => previousData,
  });

  const users = userResponse?.data || [];
  const meta = userResponse?.meta;

  const updateStatusMutation = useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: string }) => {
      const res = await api.patch(`${API_ROUTES.ADMIN.USERS}/${userId}/status`, { status });
      return res.data;
    },
    onMutate: async ({ userId, status }) => {
      // Cancel outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: ["admin", "users"] });

      // Snapshot previous query data for rollback on failure
      const previousQueriesData = queryClient.getQueriesData({ queryKey: ["admin", "users"] });

      // Optimistically update all cached users queries instantly (0ms delay!)
      queryClient.setQueriesData({ queryKey: ["admin", "users"] }, (old: any) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: old.data.map((user: any) =>
            user.id === userId ? { ...user, status } : user
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
      toast.error(error.message || "স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে");
    },
    onSuccess: () => {
      toast.success("ব্যবহারকারী স্ট্যাটাস আপডেট করা হয়েছে");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
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

  const isFiltered = search !== "" || roleFilter !== "all" || statusFilter !== "all" || sortBy !== "createdAt" || sortOrder !== "desc";

  const getSortLabel = () => {
    const sortMap: Record<string, string> = {
      "createdAt-desc": "Newest First",
      "createdAt-asc": "Oldest First",
      "name-asc": "Name: A to Z",
      "name-desc": "Name: Z to A",
    };
    return sortMap[`${sortBy}-${sortOrder}`] || "Sort By";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border">
        <div>
          <h1 className="text-2xl font-bold font-bengali text-charcoal">ব্যবহারকারীগণ</h1>
          <p className="text-muted-foreground text-sm hidden md:block font-bengali">সকল ব্যবহারকারীর তালিকা ও পরিচালনা</p>
        </div>
      </div>

      {/* Filters and Search Header */}
      <div className="flex flex-row gap-2 sm:gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="নাম, ইমেইল বা ফোন..."
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
                  <SheetDescription className="sr-only">Filter and sort users table</SheetDescription>
                  
                  {/* Role Filter */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">User Role</h3>
                    <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v || "all"); setPage(1); }}>
                      <SelectTrigger className="w-full h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
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
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Status</h3>
                    <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v || "all"); setPage(1); }}>
                      <SelectTrigger className="w-full h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
                        <SelectValue placeholder="Status">
                          {statusFilter === "all" ? "All Status" : statusFilter}
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
              <SelectTrigger className="w-[140px] h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
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
              <SelectTrigger className="w-[140px] h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
                <SelectValue placeholder="Status">
                  {statusFilter === "all" ? "All Status" : statusFilter}
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
              <SelectTrigger className="w-[170px] h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
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
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user: any) => (
                <tr key={user.id} className="hover:bg-cream/30 dark:hover:bg-charcoal-light/20 transition-colors">
                  <td className="px-6 py-4 align-middle">
                    <div className="flex items-center gap-3 group/username">
                      <div className="w-10 h-10 rounded-full bg-fire/10 text-fire font-bold flex items-center justify-center font-bengali shrink-0">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <p className="font-bold text-charcoal font-bengali truncate">{user.name}</p>
                          {user.name && (
                            <button
                              onClick={() => handleCopy(user.name, `tbl-name-${user.id}`, 'User name')}
                              className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 opacity-100 lg:opacity-0 lg:group-hover/username:opacity-100 focus:opacity-100 cursor-pointer shrink-0"
                              title="Copy user name"
                            >
                              {copiedKey === `tbl-name-${user.id}` ? (
                                <Check className="w-3.5 h-3.5 text-green-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground font-latin">{format(new Date(user.createdAt), "dd MMM, yyyy")}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 align-middle">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 group/useremail min-h-[22px]">
                        <Mail size={14} className="text-muted-foreground shrink-0 mr-1" />
                        <span className="font-latin truncate text-charcoal">{user.email}</span>
                        {user.email && (
                          <button
                            onClick={() => handleCopy(user.email, `tbl-email-${user.id}`, 'Email address')}
                            className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 opacity-100 lg:opacity-0 lg:group-hover/useremail:opacity-100 focus:opacity-100 cursor-pointer shrink-0"
                            title="Copy email address"
                          >
                            {copiedKey === `tbl-email-${user.id}` ? (
                              <Check className="w-3.5 h-3.5 text-green-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-1 group/userphone min-h-[22px]">
                          <Phone size={14} className="text-muted-foreground shrink-0 mr-1" />
                          <span className="font-latin text-xs text-muted-foreground">{user.phone}</span>
                          <button
                            onClick={() => handleCopy(user.phone, `tbl-phone-${user.id}`, 'Phone number')}
                            className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 opacity-100 lg:opacity-0 lg:group-hover/userphone:opacity-100 focus:opacity-100 cursor-pointer shrink-0"
                            title="Copy phone number"
                          >
                            {copiedKey === `tbl-phone-${user.id}` ? (
                              <Check className="w-3.5 h-3.5 text-green-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 align-middle">
                    <div className="flex items-center gap-2">
                      {user.role === "ADMIN" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-fire/10 text-fire text-xs font-bold font-latin">
                          <Shield size={12} />
                          ADMIN
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-muted/40 text-charcoal text-xs font-bold font-latin">
                          CUSTOMER
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center align-middle">
                    <span className="inline-flex items-center justify-center font-bold text-fire bg-fire/10 border border-fire/20 px-3 py-1 rounded-full text-xs font-bengali">
                      {user._count?.orders || user.orders?.length || 0} টি
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center align-middle">
                    {user.role === "ADMIN" ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-latin border border-emerald-500/20">
                        Active
                      </span>
                    ) : (
                      <Select
                        value={user.status}
                        onValueChange={(value) => handleStatusChange(user.id, value)}
                      >
                        <SelectTrigger className="w-[110px] h-8 text-xs font-semibold justify-center bg-background rounded-lg mx-auto">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="INACTIVE">Inactive</SelectItem>
                          <SelectItem value="BANNED">Banned</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right align-middle">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-2 hover:bg-fire/10 hover:text-fire rounded-lg transition-colors cursor-pointer text-muted-foreground">
                        <MoreVertical size={18} />
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
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden sm:rounded-3xl border-border shadow-2xl">
          <DialogHeader className="p-4 sm:p-6 border-b border-border/60 bg-muted/10 pr-12">
            <div className="flex items-center justify-between gap-4">
              <div>
                <DialogTitle className="text-xl font-bold font-bengali text-charcoal flex items-center gap-2">
                  <Eye className="w-5 h-5 text-fire shrink-0" />
                  <span>ব্যবহারকারী তথ্য</span>
                </DialogTitle>
                <DialogDescription className="text-muted-foreground text-xs mt-1 font-bengali">
                  ব্যবহারকারীর প্রোফাইল ও অ্যাকাউন্টের সম্পূর্ণ বিস্তারিত
                </DialogDescription>
              </div>
              {selectedUser && (
                <span className={`px-3 py-1 rounded-full text-xs font-bold font-latin ${
                  selectedUser.status === "ACTIVE" 
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" 
                    : selectedUser.status === "BANNED"
                    ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                }`}>
                  {selectedUser.status}
                </span>
              )}
            </div>
          </DialogHeader>

          {selectedUser && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* User Profile Header Card */}
              <div className="p-5 bg-card rounded-2xl border border-border/70 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-fire/10 text-fire font-bold flex items-center justify-center text-2xl font-bengali shrink-0 border border-fire/20">
                    {selectedUser.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1 group/modalname">
                      <h3 className="font-bold text-charcoal font-bengali text-xl leading-tight truncate">{selectedUser.name}</h3>
                      {selectedUser.name && (
                        <button
                          onClick={() => handleCopy(selectedUser.name, 'modal-name', 'User name')}
                          className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 opacity-100 lg:opacity-0 lg:group-hover/modalname:opacity-100 focus:opacity-100 cursor-pointer shrink-0"
                          title="Copy user name"
                        >
                          {copiedKey === 'modal-name' ? (
                            <Check className="w-3.5 h-3.5 text-green-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-1 group/modalemail">
                      <p className="text-xs text-muted-foreground font-latin truncate">{selectedUser.email}</p>
                      {selectedUser.email && (
                        <button
                          onClick={() => handleCopy(selectedUser.email, 'modal-email', 'Email address')}
                          className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 opacity-100 lg:opacity-0 lg:group-hover/modalemail:opacity-100 focus:opacity-100 cursor-pointer shrink-0"
                          title="Copy email address"
                        >
                          {copiedKey === 'modal-email' ? (
                            <Check className="w-3.5 h-3.5 text-green-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                    <div className="pt-1">
                      {selectedUser.role === "ADMIN" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-fire/10 text-fire text-xs font-bold font-latin">
                          <Shield size={12} /> ADMIN
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-muted/40 text-charcoal text-xs font-bold font-latin">
                          CUSTOMER
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-muted/10 rounded-xl border border-border/50 text-center sm:text-right shrink-0">
                  <span className="text-xs text-muted-foreground block mb-1 font-bengali">মোট অর্ডার</span>
                  <span className="font-bold text-fire text-lg font-bengali">
                    {selectedUser._count?.orders || selectedUser.orders?.length || 0} টি
                  </span>
                </div>
              </div>

              {/* Detailed Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/10 rounded-2xl border border-border/50 space-y-1 group/modalphone flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 font-bengali">
                      <Phone size={14} className="text-fire" /> ফোন নম্বর
                    </p>
                    <p className="text-charcoal font-latin font-medium text-sm">{selectedUser.phone || "N/A"}</p>
                  </div>
                  {selectedUser.phone && (
                    <button
                      onClick={() => handleCopy(selectedUser.phone, 'modal-phone', 'Phone number')}
                      className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 opacity-100 lg:opacity-0 lg:group-hover/modalphone:opacity-100 focus:opacity-100 cursor-pointer shrink-0"
                      title="Copy phone number"
                    >
                      {copiedKey === 'modal-phone' ? (
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>

                <div className="p-4 bg-muted/10 rounded-2xl border border-border/50 space-y-1 group/modalemailcard flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 font-bengali">
                      <Mail size={14} className="text-fire" /> ইমেইল ঠিকানা
                    </p>
                    <p className="text-charcoal font-latin font-medium text-sm truncate">{selectedUser.email || "N/A"}</p>
                  </div>
                  {selectedUser.email && (
                    <button
                      onClick={() => handleCopy(selectedUser.email, 'modal-emailcard', 'Email address')}
                      className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 opacity-100 lg:opacity-0 lg:group-hover/modalemailcard:opacity-100 focus:opacity-100 cursor-pointer shrink-0"
                      title="Copy email address"
                    >
                      {copiedKey === 'modal-emailcard' ? (
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>

                <div className="p-4 bg-muted/10 rounded-2xl border border-border/50 space-y-1 sm:col-span-2 group/modaladdr flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-muted-foreground font-bengali">ঠিকানা</p>
                    <p className="text-charcoal font-bengali text-sm leading-relaxed break-words">{selectedUser.address || "N/A"}</p>
                  </div>
                  {selectedUser.address && (
                    <button
                      onClick={() => handleCopy(selectedUser.address, 'modal-address', 'Address')}
                      className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 opacity-100 lg:opacity-0 lg:group-hover/modaladdr:opacity-100 focus:opacity-100 cursor-pointer shrink-0 mt-0.5"
                      title="Copy address"
                    >
                      {copiedKey === 'modal-address' ? (
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Footer Timestamps */}
              <div className="p-4 bg-muted/10 rounded-2xl border border-border/50 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground font-bengali">
                <div>
                  <span className="font-semibold text-charcoal mr-1">যোগদানের তারিখ:</span>
                  <span className="font-latin">{format(new Date(selectedUser.createdAt), "dd MMM, yyyy 'at' HH:mm")}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
