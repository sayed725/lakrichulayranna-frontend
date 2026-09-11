"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Mail, Phone, MessageSquare, CheckCircle, Clock, Search, Filter, RefreshCw, Eye, Trash2, XCircle, MoreVertical, Copy, Check } from "lucide-react";
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription, SheetClose } from "@/components/ui/sheet";
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(`${label} copied!`, {
      description: `${text} copied to clipboard`,
    });
    setTimeout(() => setCopiedKey(null), 2000);
  };

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
                  <SheetDescription className="sr-only">Filter and sort contacts table</SheetDescription>
                  
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Status</h3>
                    <Select value={isReadFilter} onValueChange={(v) => { setIsReadFilter(v || "all"); setPage(1); }}>
                      <SelectTrigger className="w-full h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
                        <SelectValue placeholder="All Status">
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
          <div className="hidden lg:flex gap-2 items-center">
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
      </div>

      {/* Contacts List / Table */}
      {contactsLoading ? (
        <ContactsLoadingSkeleton />
      ) : (
        <>
          {/* Mobile & Tablet Card View (<1024px) */}
          <div className="lg:hidden space-y-3.5">
            {contacts.map((contact: any) => (
              <div key={contact.id} className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all space-y-3">
                {/* Top Bar: Contact Name, Avatar, Date & Actions */}
                <div className="flex items-center justify-between gap-3 border-b border-border/50 pb-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fire to-terracotta flex items-center justify-center text-white font-bold shrink-0 shadow-xs text-base">
                      {contact.name?.charAt(0).toUpperCase() || "C"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <p className="font-bold text-charcoal font-bengali text-base truncate">{contact.name}</p>
                        {contact.name && (
                          <button
                            onClick={() => handleCopy(contact.name, `card-name-${contact.id}`, 'Contact name')}
                            className="text-muted-foreground hover:text-fire p-1 rounded hover:bg-cream/50 transition-colors shrink-0"
                            title="Copy name"
                          >
                            {copiedKey === `card-name-${contact.id}` ? (
                              <Check className="w-3.5 h-3.5 text-green-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-latin">
                        {format(new Date(contact.createdAt), "dd MMM, yyyy • hh:mm a")}
                      </p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-1.5 hover:bg-fire/10 hover:text-fire rounded-lg transition-colors cursor-pointer text-muted-foreground shrink-0">
                      <MoreVertical size={18} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
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
                </div>

                {/* Contact Info (Email & Phone) */}
                <div className="bg-muted/10 p-2.5 rounded-xl border border-border/40 space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground font-latin">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Mail size={13} className="shrink-0 text-muted-foreground" />
                      <span className="truncate text-charcoal font-medium">{contact.email}</span>
                    </div>
                    {contact.email && (
                      <button
                        onClick={() => handleCopy(contact.email, `card-email-${contact.id}`, 'Email address')}
                        className="text-muted-foreground hover:text-fire p-1 rounded hover:bg-cream/50 transition-colors shrink-0"
                        title="Copy email"
                      >
                        {copiedKey === `card-email-${contact.id}` ? (
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>

                  {contact.phone && (
                    <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground font-latin border-t border-border/30 pt-1.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Phone size={13} className="shrink-0 text-muted-foreground" />
                        <span className="truncate text-charcoal font-medium">{contact.phone}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(contact.phone, `card-phone-${contact.id}`, 'Phone number')}
                        className="text-muted-foreground hover:text-fire p-1 rounded hover:bg-cream/50 transition-colors shrink-0"
                        title="Copy phone"
                      >
                        {copiedKey === `card-phone-${contact.id}` ? (
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Subject & Message Preview */}
                <div className="bg-cream/30 dark:bg-charcoal-light/20 p-2.5 rounded-xl border border-border/40 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-charcoal font-bengali">
                    <MessageSquare size={13} className="text-fire shrink-0" />
                    <span className="truncate">{contact.subject}</span>
                  </div>
                  <p className="text-xs text-charcoal/90 font-bengali line-clamp-2 leading-relaxed">
                    {contact.message}
                  </p>
                </div>

                {/* Status Bar */}
                <div className="flex items-center justify-between pt-1 border-t border-border/50">
                  <span className="text-xs text-muted-foreground font-bengali">Status</span>
                  {contact.isRead ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-success/10 text-success text-xs font-bold font-latin">
                      <CheckCircle size={12} />
                      পঠিত
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-fire/10 text-fire text-xs font-bold font-latin">
                      <Clock size={12} />
                      অপঠিত
                    </span>
                  )}
                </div>
              </div>
            ))}

            {contacts.length === 0 && (
              <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground font-bengali">
                কোনো যোগাযোগ বার্তা পাওয়া যায়নি।
              </div>
            )}
          </div>

          {/* Desktop Table View (>=1024px) */}
          <div className="hidden lg:block border border-border bg-card rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-cream/50 dark:bg-charcoal-light/30 text-charcoal dark:text-cream text-xs uppercase font-bengali">
                  <tr>
                    <th className="px-4 py-3 font-bold">Person</th>
                    <th className="px-4 py-3 font-bold">Contact</th>
                    <th className="px-4 py-3 font-bold">Subject</th>
                    <th className="px-4 py-3 font-bold">Message</th>
                    <th className="px-4 py-3 font-bold text-center">Status</th>
                    <th className="px-4 py-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {contacts.map((contact: any) => (
                    <tr key={contact.id} className="hover:bg-cream/30 dark:hover:bg-charcoal-light/20 transition-colors">
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center gap-3 group/contactname">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-fire to-terracotta flex items-center justify-center text-white font-bold shrink-0 shadow-xs text-sm">
                            {contact.name?.charAt(0).toUpperCase() || "C"}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1">
                              <p className="font-bold text-charcoal font-bengali truncate text-sm">{contact.name}</p>
                              {contact.name && (
                                <button
                                  onClick={() => handleCopy(contact.name, `tbl-name-${contact.id}`, 'Contact name')}
                                  className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 opacity-100 lg:opacity-0 lg:group-hover/contactname:opacity-100 focus:opacity-100 cursor-pointer shrink-0"
                                  title="Copy contact name"
                                >
                                  {copiedKey === `tbl-name-${contact.id}` ? (
                                    <Check className="w-3 h-3 text-green-600" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              )}
                            </div>
                            <p className="text-[11px] text-muted-foreground font-latin">{format(new Date(contact.createdAt), "dd MMM, yyyy")}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1 group/contactemail min-h-[20px]">
                            <Mail size={13} className="text-muted-foreground shrink-0 mr-1" />
                            <span className="font-latin truncate text-charcoal text-sm">{contact.email}</span>
                            {contact.email && (
                              <button
                                onClick={() => handleCopy(contact.email, `tbl-email-${contact.id}`, 'Email address')}
                                className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 opacity-100 lg:opacity-0 lg:group-hover/contactemail:opacity-100 focus:opacity-100 cursor-pointer shrink-0"
                                title="Copy email address"
                              >
                                {copiedKey === `tbl-email-${contact.id}` ? (
                                  <Check className="w-3 h-3 text-green-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            )}
                          </div>
                          {contact.phone && (
                            <div className="flex items-center gap-1 group/contactphone min-h-[20px]">
                              <Phone size={13} className="text-muted-foreground shrink-0 mr-1" />
                              <span className="font-latin text-xs text-muted-foreground">{contact.phone}</span>
                              <button
                                onClick={() => handleCopy(contact.phone, `tbl-phone-${contact.id}`, 'Phone number')}
                                className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 opacity-100 lg:opacity-0 lg:group-hover/contactphone:opacity-100 focus:opacity-100 cursor-pointer shrink-0"
                                title="Copy phone number"
                              >
                                {copiedKey === `tbl-phone-${contact.id}` ? (
                                  <Check className="w-3 h-3 text-green-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <MessageSquare size={14} className="text-muted-foreground" />
                          <span className="text-sm text-charcoal font-bengali">{contact.subject}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-charcoal font-bengali max-w-xs truncate">
                          {contact.message}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-center">
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
                          <DropdownMenuTrigger className="p-2 hover:bg-fire/10 hover:text-fire rounded-lg transition-colors cursor-pointer text-muted-foreground">
                            <MoreVertical size={18} />
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
                      <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground font-bengali">
                        No contacts found.
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

      {/* View Contact Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="w-[95vw] sm:w-full sm:max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl sm:rounded-3xl border-border shadow-2xl">
          <DialogHeader className="p-4 sm:p-6 border-b border-border/60 bg-muted/10 pr-12">
            <div className="flex items-center justify-between gap-4">
              <div>
                <DialogTitle className="text-xl font-bold font-bengali text-charcoal flex items-center gap-2">
                  <Eye className="w-5 h-5 text-fire shrink-0" />
                  <span>যোগাযোগ বার্তা</span>
                </DialogTitle>
                <DialogDescription className="text-muted-foreground text-xs mt-1 font-bengali">
                  গ্রাহকের থেকে প্রাপ্ত বার্তা
                </DialogDescription>
              </div>
              {selectedContact && (
                <span className={`px-3 py-1 rounded-full text-xs font-bold font-latin flex items-center gap-1 ${
                  selectedContact.isRead 
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" 
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                }`}>
                  {selectedContact.isRead ? (
                    <><CheckCircle size={12} /> পঠিত (Read)</>
                  ) : (
                    <><Clock size={12} /> অপঠিত (Unread)</>
                  )}
                </span>
              )}
            </div>
          </DialogHeader>

          {selectedContact && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* Contact Profile Header Card */}
              <div className="p-5 bg-card rounded-2xl border border-border/70 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-fire to-terracotta flex items-center justify-center text-white font-bold text-2xl font-bengali shrink-0 border border-fire/20 shadow-xs">
                    {selectedContact.name?.charAt(0).toUpperCase() || "C"}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1 group/modalcontactname">
                      <h3 className="font-bold text-charcoal font-bengali text-xl leading-tight truncate">{selectedContact.name}</h3>
                      {selectedContact.name && (
                        <button
                          onClick={() => handleCopy(selectedContact.name, 'modal-name', 'Contact name')}
                          className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 opacity-0 group-hover/modalcontactname:opacity-100 focus:opacity-100 cursor-pointer shrink-0"
                          title="Copy contact name"
                        >
                          {copiedKey === 'modal-name' ? (
                            <Check className="w-3.5 h-3.5 text-green-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-latin">{format(new Date(selectedContact.createdAt), "dd MMM, yyyy 'at' HH:mm")}</p>
                  </div>
                </div>
              </div>

              {/* Contact Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email Card */}
                <div className="p-4 bg-muted/10 rounded-2xl border border-border/50 space-y-1 group/modalemailcard flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 font-bengali">
                      <Mail size={14} className="text-fire" /> ইমেইল ঠিকানা
                    </p>
                    <p className="text-charcoal font-latin font-medium text-sm truncate">{selectedContact.email || "N/A"}</p>
                  </div>
                  {selectedContact.email && (
                    <button
                      onClick={() => handleCopy(selectedContact.email, 'modal-email', 'Email address')}
                      className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 opacity-0 group-hover/modalemailcard:opacity-100 focus:opacity-100 cursor-pointer shrink-0"
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

                {/* Phone Card */}
                <div className="p-4 bg-muted/10 rounded-2xl border border-border/50 space-y-1 group/modalphonecard flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 font-bengali">
                      <Phone size={14} className="text-fire" /> ফোন নম্বর
                    </p>
                    <p className="text-charcoal font-latin font-medium text-sm truncate">{selectedContact.phone || "N/A"}</p>
                  </div>
                  {selectedContact.phone && (
                    <button
                      onClick={() => handleCopy(selectedContact.phone, 'modal-phone', 'Phone number')}
                      className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 opacity-0 group-hover/modalphonecard:opacity-100 focus:opacity-100 cursor-pointer shrink-0"
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

                {/* Subject */}
                <div className="p-4 bg-muted/10 rounded-2xl border border-border/50 space-y-1 sm:col-span-2 group/modalsubject flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 font-bengali">
                      <MessageSquare size={14} className="text-fire" /> বিষয় (Subject)
                    </p>
                    <p className="text-charcoal font-bengali font-semibold text-sm leading-relaxed break-words">{selectedContact.subject || "N/A"}</p>
                  </div>
                  {selectedContact.subject && (
                    <button
                      onClick={() => handleCopy(selectedContact.subject, 'modal-subject', 'Subject')}
                      className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 opacity-0 group-hover/modalsubject:opacity-100 focus:opacity-100 cursor-pointer shrink-0 mt-0.5"
                      title="Copy subject"
                    >
                      {copiedKey === 'modal-subject' ? (
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>

                {/* Message Body */}
                <div className="p-4 bg-muted/10 rounded-2xl border border-border/50 space-y-2 sm:col-span-2 group/modalmsg flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted-foreground font-bengali">বার্তা (Message)</p>
                    {selectedContact.message && (
                      <button
                        onClick={() => handleCopy(selectedContact.message, 'modal-message', 'Message')}
                        className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 opacity-0 group-hover/modalmsg:opacity-100 focus:opacity-100 cursor-pointer shrink-0"
                        title="Copy message"
                      >
                        {copiedKey === 'modal-message' ? (
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                  <div className="p-4 bg-background/80 rounded-xl border border-border/60 text-charcoal font-bengali text-sm leading-relaxed whitespace-pre-wrap break-words max-h-[220px] overflow-y-auto">
                    {selectedContact.message}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
