"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Mail, Phone, MessageSquare, CheckCircle, Clock, Search, Filter, RefreshCw, Eye, Trash2, XCircle, MoreVertical } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { useAdminContacts } from "@/features/contact/hooks/useAdminContacts";

import USPagination from "@/components/shared/USPagination";
import ContactsLoadingSkeleton from "@/components/dashboard/ContactsLoadingSkeleton";

export default function AdminContactsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [isReadFilter, setIsReadFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const { data: contactResponse, isLoading: contactsLoading } = useAdminContacts({
    page,
    limit: 10,
    searchTerm: debouncedSearch,
    isRead: isReadFilter === "read" ? true : isReadFilter === "unread" ? false : undefined,
    sortBy,
    sortOrder,
  });

  const contacts = contactResponse?.data || [];
  const meta = contactResponse?.meta;

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch(`${API_ROUTES.CONTACTS.BASE}/${id}/mark-read`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "contacts"] });
      toast.success("Contact marked as read");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to mark as read");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`${API_ROUTES.CONTACTS.BASE}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "contacts"] });
      toast.success("Contact deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete contact");
    },
  });

  const handleViewContact = (contact: any) => {
    setSelectedContact(contact);
    setIsViewDialogOpen(true);
    if (!contact.isRead) {
      markAsReadMutation.mutate(contact.id);
    }
  };

  const handleDelete = (id: string) => {
    toast.error("Confirm Deletion", {
      description: "Are you sure you want to delete this contact?",
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
    setIsReadFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  const isFiltered = search || isReadFilter !== "all";

  const getSortLabel = () => {
    if (sortBy === "createdAt" && sortOrder === "desc") return "Newest First";
    if (sortBy === "createdAt" && sortOrder === "asc") return "Oldest First";
    return "Sort By";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border">
        <div>
          <h1 className="text-2xl font-bold font-bengali text-charcoal">যোগাযোগ বার্তা</h1>
          <p className="text-muted-foreground text-sm hidden md:block font-bengali">গ্রাহকদের থেকে প্রাপ্ত সকল যোগাযোগ বার্তার তালিকা</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-row gap-2 sm:gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
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
          <Select value={isReadFilter} onValueChange={(v) => { setIsReadFilter(v || "all"); setPage(1); }}>
            <SelectTrigger className="w-[130px] h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
              <SelectValue placeholder="Status">
                {isReadFilter === "all" ? "All Status" :
                 isReadFilter === "read" ? "Read" :
                 isReadFilter === "unread" ? "Unread" : "Status"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
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

      {/* Table */}
      {contactsLoading ? (
        <ContactsLoadingSkeleton />
      ) : (
        <div className="border border-border bg-card rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-cream/50 dark:bg-charcoal-light/30 text-charcoal dark:text-cream text-xs uppercase font-bengali">
                <tr>
                  <th className="px-6 py-4">Person</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Message</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {contacts.map((contact: any) => (
                  <tr key={contact.id} className="hover:bg-cream/30 dark:hover:bg-charcoal-light/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fire to-terracotta flex items-center justify-center text-white font-bold shrink-0">
                          {contact.name?.charAt(0).toUpperCase() || "C"}
                        </div>
                        <div>
                          <p className="font-bold text-charcoal font-bengali">{contact.name}</p>
                          <p className="text-xs text-muted-foreground font-latin">{format(new Date(contact.createdAt), "dd MMM, yyyy")}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-charcoal">
                          <Mail size={14} className="text-muted-foreground" />
                          <span className="font-latin">{contact.email}</span>
                        </div>
                        {contact.phone && (
                          <div className="flex items-center gap-2 text-sm text-charcoal">
                            <Phone size={14} className="text-muted-foreground" />
                            <span className="font-latin">{contact.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MessageSquare size={14} className="text-muted-foreground" />
                        <span className="text-sm text-charcoal font-bengali">{contact.subject}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-charcoal font-bengali max-w-xs truncate">
                        {contact.message}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {contact.isRead ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-bold font-latin">
                            <CheckCircle size={12} />
                            পঠিত
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-fire/10 text-fire text-xs font-bold font-latin">
                            <Clock size={12} />
                            অপঠিত
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-2 hover:bg-cream/50 rounded-lg transition-colors">
                          <MoreVertical size={18} className="text-muted-foreground" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewContact(contact)}>
                            <Eye size={16} className="mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(contact.id)}
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
                {contacts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No contacts found.
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
        <div className="mt-4 bg-card border-border rounded-xl overflow-hidden shadow-sm">
          <USPagination 
            page={page} 
            totalPage={meta.totalPages} 
            onPageChange={(p) => setPage(p)} 
          />
        </div>
      )}

      {/* View Contact Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-bengali">যোগাযোগ বার্তা দেখুন</DialogTitle>
            <DialogDescription>সম্পূর্ণ যোগাযোগ বার্তার বিস্তারিত</DialogDescription>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-fire to-terracotta flex items-center justify-center text-white font-bold text-2xl shrink-0">
                  {selectedContact.name?.charAt(0).toUpperCase() || "C"}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-charcoal font-bengali">{selectedContact.name}</h3>
                  <p className="text-sm text-muted-foreground font-latin">{format(new Date(selectedContact.createdAt), "dd MMM, yyyy 'at' HH:mm")}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Email</label>
                  <div className="flex items-center gap-2 text-charcoal">
                    <Mail size={16} className="text-muted-foreground" />
                    <span className="font-latin">{selectedContact.email}</span>
                  </div>
                </div>
                {selectedContact.phone && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">Phone</label>
                    <div className="flex items-center gap-2 text-charcoal">
                      <Phone size={16} className="text-muted-foreground" />
                      <span className="font-latin">{selectedContact.phone}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Subject</label>
                <div className="flex items-center gap-2 text-charcoal">
                  <MessageSquare size={16} className="text-muted-foreground" />
                  <span className="font-bengali">{selectedContact.subject}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Message</label>
                <p className="text-charcoal font-bengali p-4 bg-cream/30 dark:bg-charcoal-light/20 rounded-lg">
                  {selectedContact.message}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Status</label>
                <div className="flex items-center gap-2">
                  {selectedContact.isRead ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-bold font-latin">
                      <CheckCircle size={12} />
                      পঠিত
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-fire/10 text-fire text-xs font-bold font-latin">
                      <Clock size={12} />
                      অপঠিত
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
