"use client";

import { useState } from "react";
import { Filter, RefreshCw, XCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { SearchInput } from "@/components/shared/SearchInput";
import { UserFilterControls } from "@/components/dashboard/users/UserFilterControls";
import { UserCard } from "@/components/dashboard/users/UserCard";
import { UserTableRow } from "@/components/dashboard/users/UserTableRow";
import { UserViewDialog } from "@/components/dashboard/users/UserViewDialog";
import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";
import USPagination from "@/components/shared/USPagination";
import UsersLoadingSkeleton from "@/components/dashboard/UsersLoadingSkeleton";
import { User } from "@/types/user";

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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { copiedKey, copy: handleCopy } = useCopyToClipboard();

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
          sortOrder,
        },
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
      await queryClient.cancelQueries({ queryKey: ["admin", "users"] });
      const previousQueriesData = queryClient.getQueriesData({ queryKey: ["admin", "users"] });

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
        onClick: () => deleteMutation.mutate(userId),
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  const handleViewUser = (user: User) => {
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

  const isFiltered =
    search !== "" ||
    roleFilter !== "all" ||
    statusFilter !== "all" ||
    sortBy !== "createdAt" ||
    sortOrder !== "desc";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 sm:p-5 rounded-2xl border border-border shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-bengali text-charcoal dark:text-cream">ব্যবহারকারীগণ</h1>
          <p className="text-muted-foreground text-xs sm:text-sm font-bengali mt-0.5 hidden lg:block">
            সকল ব্যবহারকারীর তালিকা ও পরিচালনা
          </p>
        </div>
      </div>

      {/* Filters and Search Header */}
      <div className="flex flex-row gap-2 sm:gap-4 items-center">
        <SearchInput
          placeholder="নাম, ইমেইল বা ফোন..."
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
        />

        <div className="flex items-center gap-2 w-auto">
          {/* Mobile/Tablet Filter Drawer */}
          <div className="lg:hidden">
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <Button
                variant="outline"
                className="w-auto gap-2 border-border hover:bg-cream hover:border-fire/30 hover:text-fire rounded-xl h-11 px-3 sm:px-4 transition-all"
                onClick={() => setIsFilterOpen(true)}
              >
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

                <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                  <SheetDescription className="sr-only">Filter and sort users table</SheetDescription>

                  <UserFilterControls
                    roleFilter={roleFilter}
                    onRoleChange={(v) => { setRoleFilter(v); setPage(1); }}
                    statusFilter={statusFilter}
                    onStatusChange={(v) => { setStatusFilter(v); setPage(1); }}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSortChange={(by, order) => { setSortBy(by); setSortOrder(order); setPage(1); }}
                    className="flex flex-col gap-6"
                  />
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
            <UserFilterControls
              roleFilter={roleFilter}
              onRoleChange={(v) => { setRoleFilter(v); setPage(1); }}
              statusFilter={statusFilter}
              onStatusChange={(v) => { setStatusFilter(v); setPage(1); }}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={(by, order) => { setSortBy(by); setSortOrder(order); setPage(1); }}
              className="flex flex-row gap-2 items-center"
              selectTriggerClassName="h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl"
            />

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

      {/* Users List / Table */}
      {usersLoading ? (
        <UsersLoadingSkeleton />
      ) : (
        <>
          {/* Mobile & Tablet Card View (<1024px) */}
          <div className="lg:hidden space-y-3.5">
            {users.map((user: User) => (
              <UserCard
                key={user.id}
                user={user}
                copiedKey={copiedKey}
                onCopy={handleCopy}
                onStatusChange={handleStatusChange}
                onView={handleViewUser}
                onDelete={handleDelete}
                isDeleting={deleteMutation.isPending}
              />
            ))}

            {users.length === 0 && (
              <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground font-bengali">
                কোনো ইউজার পাওয়া যায়নি।
              </div>
            )}
          </div>

          {/* Desktop Table View (>=1024px) */}
          <div className="hidden lg:block border border-border bg-card rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-cream/50 dark:bg-charcoal-light/30 text-charcoal dark:text-cream text-xs uppercase font-bengali">
                  <tr>
                    <th className="px-4 py-3 font-bold">User</th>
                    <th className="px-4 py-3 font-bold">Contact</th>
                    <th className="px-4 py-3 font-bold">Role</th>
                    <th className="px-4 py-3 font-bold text-center">Orders</th>
                    <th className="px-4 py-3 font-bold text-center">Status</th>
                    <th className="px-4 py-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((user: User) => (
                    <UserTableRow
                      key={user.id}
                      user={user}
                      copiedKey={copiedKey}
                      onCopy={handleCopy}
                      onStatusChange={handleStatusChange}
                      onView={handleViewUser}
                      onDelete={handleDelete}
                      isDeleting={deleteMutation.isPending}
                    />
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground font-bengali">
                        No users found.
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
          <USPagination page={page} totalPage={meta.totalPages} onPageChange={(p) => setPage(p)} />
        </div>
      )}

      {/* View User Dialog */}
      <UserViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        user={selectedUser}
        copiedKey={copiedKey}
        onCopy={handleCopy}
      />
    </div>
  );
}
