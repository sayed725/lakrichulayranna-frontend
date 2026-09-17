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
import { DashboardFilterBar } from "@/components/dashboard/DashboardFilterBar";
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
      <DashboardFilterBar
        search={{
          placeholder: "নাম, ইমেইল বা ফোন...",
          value: search,
          onChange: (val) => {
            setSearch(val);
            setPage(1);
          },
        }}
        filters={[
          {
            key: "role",
            label: "Role",
            placeholder: "All Roles",
            value: roleFilter,
            onChange: (v) => {
              setRoleFilter(v);
              setPage(1);
            },
            options: [
              { label: "All Roles", value: "all" },
              { label: "Admin", value: "ADMIN" },
              { label: "Customer", value: "CUSTOMER" },
            ],
            widthClass: "w-[130px]",
          },
          {
            key: "status",
            label: "Status",
            placeholder: "All Status",
            value: statusFilter,
            onChange: (v) => {
              setStatusFilter(v);
              setPage(1);
            },
            options: [
              { label: "All Status", value: "all" },
              { label: "Active", value: "ACTIVE" },
              { label: "Inactive", value: "INACTIVE" },
              { label: "Banned", value: "BANNED" },
            ],
            widthClass: "w-[130px]",
          },
        ]}
        sort={{
          sortBy,
          sortOrder,
          onChange: (by, order) => {
            setSortBy(by);
            setSortOrder(order);
            setPage(1);
          },
          placeholder: "Sort By",
          widthClass: "w-[170px]",
          options: [
            { label: "Newest First", value: "createdAt-desc" },
            { label: "Oldest First", value: "createdAt-asc" },
            { label: "Name: A to Z", value: "name-asc" },
            { label: "Name: Z to A", value: "name-desc" },
          ],
        }}
        isFiltered={isFiltered}
        onReset={resetFilters}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
      />

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
