"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, RefreshCw, XCircle, Filter, Download, Eye, Trash2, Edit2, MoreVertical, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { generateInvoicePDF } from "@/lib/generateInvoicePDF";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { format } from "date-fns";
import { useAdminOrders, useCreateManualOrder, useDeleteOrder, useUpdateOrderStatus, useUpdateOrder, useUpdateOrderItems } from "@/features/order/hooks/useAdminOrders";
import USPagination from "@/components/shared/USPagination";
import CreateOrderForm from "@/components/dashboard/CreateOrderForm";
import OrdersLoadingSkeleton from "@/components/dashboard/OrdersLoadingSkeleton";
import { useAdminItems } from "@/features/item/hooks/useAdminItems";
import { ViewOrderModal } from "@/components/modals/ViewOrderModal";
import { EditOrderModal } from "@/components/modals/EditOrderModal";
import { DashboardFilterBar } from "@/components/dashboard/DashboardFilterBar";

const ORDER_STATUSES = [
  { value: "all", label: "সকল অর্ডার" },
  { value: "PENDING", label: "অপেক্ষমাণ" },
  { value: "CONFIRMED", label: "নিশ্চিতকৃত" },
  { value: "PREPARING", label: "প্রস্তুত হচ্ছে" },
  { value: "READY", label: "ডেলিভারির জন্য প্রস্তুত" },
  { value: "DELIVERED", label: "ডেলিভারি সম্পন্ন" },
  { value: "CANCELLED", label: "বাতিলকৃত" },
];

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [copiedTextId, setCopiedTextId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const { data: ordersResponse, isLoading } = useAdminOrders({
    page,
    limit: 10,
    searchTerm: debouncedSearch,
    status: statusFilter,
    paymentMethod: paymentMethodFilter,
    sortBy,
    sortOrder,
  });
  const orders = ordersResponse?.data || [];
  const meta = ordersResponse?.meta;
  const totalPages = meta?.totalPage || 1;
  const createMutation = useCreateManualOrder({
    onSuccess: () => {
      setIsCreateOpen(false);
    },
  });
  const deleteMutation = useDeleteOrder();
  const statusMutation = useUpdateOrderStatus();
  const updateOrderMutation = useUpdateOrder();
  const updateOrderItemsMutation = useUpdateOrderItems();
  const { data: itemsResponse } = useAdminItems({ limit: 1000 });
  const items = itemsResponse?.data || [];
  const availableItems = items.filter((it: any) => it.isAvailable === true);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPaymentMethodFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  const isFiltered = search !== "" || statusFilter !== "all" || paymentMethodFilter !== "all" || sortBy !== "createdAt" || sortOrder !== "desc";

  const handleViewItem = (order: any) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  const openEdit = (order: any) => {
    setSelectedOrder(order);
    setIsEditOpen(true);
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    if (newStatus === "CANCELLED") {
      setCancellingOrderId(orderId);
      setIsCancelDialogOpen(true);
      return;
    }
    statusMutation.mutate({ orderId, status: newStatus });
  };

  const handleCopyOrderNumber = (orderNumber: string, orderId: string) => {
    navigator.clipboard.writeText(orderNumber);
    setCopiedOrderId(orderId);
    toast.success("Order number copied!", {
      description: `Order #${orderNumber} copied to clipboard`,
    });
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  const handleCopyText = (text: string, id: string, type: string) => {
    navigator.clipboard.writeText(text);
    const key = `${id}-${type}`;
    setCopiedTextId(key);
    toast.success(`${type} copied!`, {
      description: `${text} copied to clipboard`,
    });
    setTimeout(() => setCopiedTextId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 sm:p-5 rounded-2xl border border-border shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-bengali text-charcoal dark:text-cream">অর্ডারসমূহ</h1>
          <p className="text-muted-foreground text-xs sm:text-sm font-bengali mt-0.5 hidden lg:block">সকল অর্ডারের তালিকা ও পরিচালনা</p>
        </div>
        <Button className="bg-fire text-white font-semibold hover:bg-fire-dark rounded-xl h-9 sm:h-11 px-3 sm:px-4 text-xs sm:text-sm" onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          ম্যানুয়াল অর্ডার
        </Button>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={(val) => {
        setIsCreateOpen(val);
      }}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-bengali">ম্যানুয়াল অর্ডার তৈরি করুন</DialogTitle>
          </DialogHeader>
          <CreateOrderForm
            onSubmit={(data) => createMutation.mutate(data)}
            isPending={createMutation.isPending}
            onCancel={() => setIsCreateOpen(false)}
            items={availableItems}
            buttonText="অর্ডার তৈরি করুন"
          />
        </DialogContent>
      </Dialog>

      {/* Filters and Search Header */}
      <DashboardFilterBar
        search={{
          placeholder: "অর্ডার নং, নাম বা ফোন...",
          value: search,
          onChange: (val) => {
            setSearch(val);
            setPage(1);
          },
        }}
        filters={[
          {
            key: "status",
            label: "Order Status",
            placeholder: "All Status",
            value: statusFilter,
            onChange: (v) => {
              setStatusFilter(v);
              setPage(1);
            },
            options: ORDER_STATUSES,
            widthClass: "w-[140px]",
          },
          {
            key: "paymentMethod",
            label: "Payment Method",
            placeholder: "All Methods",
            value: paymentMethodFilter,
            onChange: (v) => {
              setPaymentMethodFilter(v);
              setPage(1);
            },
            options: [
              { label: "All Methods", value: "all" },
              { label: "Cash on Delivery", value: "COD" },
              { label: "Online", value: "ONLINE" },
            ],
            widthClass: "w-[150px]",
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
          placeholder: "Sort Orders",
          widthClass: "w-[170px]",
          options: [
            { label: "Newest First", value: "createdAt-desc" },
            { label: "Oldest First", value: "createdAt-asc" },
            { label: "Price: High to Low", value: "total-desc" },
            { label: "Price: Low to High", value: "total-asc" },
          ],
        }}
        isFiltered={isFiltered}
        onReset={resetFilters}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
      />

      {isLoading ? (
        <OrdersLoadingSkeleton />
      ) : (
        <>
          {/* Mobile & Tablet Collapsible Accordion Cards View (< lg) */}
          <div className="lg:hidden space-y-3.5">
            {orders.map((order: any) => {
              const isExpanded = expandedOrderId === order.id;
              return (
                <div 
                  key={order.id}
                  className="bg-white dark:bg-charcoal border border-border/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200"
                >
                  {/* Collapsed Header Bar (Clickable) */}
                  <div 
                    onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                    className="p-3.5 sm:p-4 flex flex-col gap-2.5 cursor-pointer hover:bg-cream/30 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Top Row: Order #, Copy, Date & Price */}
                    <div className="flex items-center justify-between gap-2 border-b border-border/50 dark:border-white/5 pb-2">
                      <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                        <span className="font-mono font-extrabold text-xs sm:text-sm text-charcoal dark:text-cream tracking-wide shrink-0">
                          #{order.orderNumber}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyOrderNumber(order.orderNumber, order.id);
                          }}
                          className="text-muted dark:text-cream/50 hover:text-fire transition-colors p-0.5 rounded hover:bg-cream-dark/40 dark:hover:bg-white/10 shrink-0"
                          title="Copy order number"
                        >
                          {copiedOrderId === order.id ? (
                            <Check className="w-3.5 h-3.5 text-green-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <span className="text-[10px] sm:text-[11px] font-latin text-muted dark:text-cream/60 bg-cream-dark/40 dark:bg-white/5 px-2 py-0.5 rounded-full shrink-0">
                          {format(new Date(order.createdAt), "dd MMM, hh:mm a")}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-extrabold text-fire text-sm sm:text-base font-latin whitespace-nowrap">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Row: Customer Name, Phone (with Copy), Items Count & Badges */}
                    <div className="flex items-center justify-between gap-2 text-xs font-bengali min-w-0">
                      <div className="space-y-1 min-w-0 flex-1">
                        {/* Name with Copy */}
                        <div className="flex items-center gap-1 font-bold text-charcoal dark:text-cream min-w-0">
                          <span className="truncate max-w-[120px] xs:max-w-[160px] sm:max-w-[240px] block">
                            {order.customerName || order.user?.name || "Guest Customer"}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyText(order.customerName || order.user?.name || "Guest Customer", order.id, "Name");
                            }}
                            className="text-muted hover:text-fire transition-colors p-0.5 rounded hover:bg-cream/80 dark:hover:bg-white/10 shrink-0"
                            title="Copy name"
                          >
                            {copiedTextId === `${order.id}-Name` ? (
                              <Check className="w-3 h-3 text-green-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        
                        {/* Phone with Copy & Items Count */}
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted dark:text-cream/60 min-w-0">
                          <div className="flex items-center gap-1 font-latin min-w-0">
                            <span className="truncate max-w-[110px] xs:max-w-[130px] sm:max-w-none block">
                              {order.deliveryAddress?.phone || order.customerPhone || order.user?.phone || "No Phone"}
                            </span>
                            {(order.deliveryAddress?.phone || order.customerPhone || order.user?.phone) && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyText(order.deliveryAddress?.phone || order.customerPhone || order.user?.phone || "", order.id, "Phone");
                                }}
                                className="text-muted hover:text-fire transition-colors p-0.5 rounded hover:bg-cream/80 dark:hover:bg-white/10 shrink-0"
                                title="Copy phone"
                              >
                                {copiedTextId === `${order.id}-Phone` ? (
                                  <Check className="w-3 h-3 text-green-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            )}
                          </div>
                          <span className="hidden xs:inline text-muted/40">•</span>
                          <span className="flex items-center gap-1 font-bengali shrink-0">
                            {order.items?.length || 0}টি খাবার
                          </span>
                        </div>
                      </div>

                      {/* Right Badges & Expand Indicator */}
                      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <div className="scale-90 sm:scale-100 origin-right max-w-[110px] sm:max-w-none">
                            <StatusBadge status={order.status} />
                          </div>
                          <span className="text-[9px] sm:text-[10px] font-extrabold font-latin px-1.5 py-0.5 rounded bg-cream-dark/50 dark:bg-white/10 text-charcoal dark:text-cream whitespace-nowrap">
                            {order.paymentMethod === "COD" ? "COD" : "ONLINE"}
                          </span>
                        </div>
                        <div className="w-7 h-7 rounded-lg text-muted dark:text-cream/60 bg-cream-dark/50 dark:bg-white/10 flex items-center justify-center shrink-0 ml-0.5">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details Content */}
                  {isExpanded && (
                    <div className="p-3.5 sm:p-4 border-t border-border/70 dark:border-white/10 bg-cream/20 dark:bg-white/[0.02] space-y-3.5 text-xs font-bengali">
                      {/* Delivery Address & Account Info Container */}
                      <div className="space-y-2.5 bg-white dark:bg-charcoal-light/40 p-3 sm:p-3.5 rounded-xl border border-border/60 dark:border-white/10">
                        {/* Order From Account User Info */}
                        <div className="flex items-center gap-1.5 text-[11px] pb-2 border-b border-border/50 dark:border-white/5 min-w-0">
                          <span className="font-extrabold uppercase text-[10px] text-muted/80 shrink-0">অর্ডার ফ্রম:</span>
                          <span className="font-bold text-charcoal dark:text-cream truncate">
                            {order.user?.name || "Guest User"}
                          </span>
                          {order.user?.phone && (
                            <>
                              <span className="text-muted/40 shrink-0">•</span>
                              <span className="font-latin text-muted dark:text-cream/70 truncate">
                                {order.user.phone}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Full Parsed Delivery Address with Copy */}
                        {(() => {
                          const parsedAddress = typeof order.deliveryAddress === 'string'
                            ? (() => { try { return JSON.parse(order.deliveryAddress); } catch { return {}; } })()
                            : order.deliveryAddress || {};

                          const fullAddress = parsedAddress.address || 
                            [parsedAddress.street, parsedAddress.area].filter(Boolean).join(', ') || 
                            order.address || 
                            'ঠিকানা দেওয়া হয়নি';

                          return (
                            <div className="flex items-start justify-between gap-2 bg-cream/40 dark:bg-white/[0.03] p-2.5 rounded-lg border border-border/40 dark:border-white/5 min-w-0">
                              <div className="min-w-0 flex-1 space-y-1">
                                <p className="text-[10px] text-muted dark:text-cream/50 uppercase font-extrabold tracking-wider">ডেলিভারি ঠিকানা</p>
                                <p className="font-semibold text-charcoal dark:text-cream text-xs leading-relaxed break-words">
                                  {fullAddress}
                                </p>
                              </div>

                              {fullAddress !== 'ঠিকানা দেওয়া হয়নি' && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyText(fullAddress, order.id, "Address");
                                  }}
                                  className="p-1.5 rounded-md hover:bg-cream dark:hover:bg-white/10 text-muted hover:text-fire transition-colors shrink-0 mt-0.5"
                                  title="Copy address"
                                >
                                  {copiedTextId === `${order.id}-Address` ? (
                                    <Check className="w-3.5 h-3.5 text-green-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              )}
                            </div>
                          );
                        })()}
                      </div>

                      {/* Items Summary & Payment */}
                      <div className="flex items-center justify-between gap-2 bg-white dark:bg-charcoal-light/40 p-3 rounded-xl border border-border/60 dark:border-white/10">
                        <div className="min-w-0">
                          <p className="text-[10px] text-muted dark:text-cream/50 uppercase font-extrabold tracking-wider">পেমেন্ট পদ্ধতি</p>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[11px] font-bold bg-cream-dark/50 dark:bg-white/10 text-charcoal dark:text-cream font-latin">
                            {order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[10px] text-muted dark:text-cream/50 uppercase font-extrabold tracking-wider">মোট খাবার</p>
                          <p className="font-bold text-charcoal dark:text-cream mt-0.5">{order.items?.length || 0} টি আইটেম</p>
                        </div>
                      </div>

                      {/* Status Selector & Actions Bar */}
                      <div className="space-y-1.5 pt-0.5">
                        <p className="text-[10px] text-muted dark:text-cream/50 uppercase font-extrabold tracking-wider">স্ট্যাটাস পরিবর্তন করুন</p>
                        <Select
                          value={order.status}
                          onValueChange={(val) => handleStatusChange(order.id, val)}
                          disabled={statusMutation.isPending || order.status === "DELIVERED" || order.status === "CANCELLED"}
                        >
                          <SelectTrigger className="h-10 w-full font-bold text-xs bg-white dark:bg-charcoal border-border/80 dark:border-white/10 rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="PENDING">PENDING (অপেক্ষমাণ)</SelectItem>
                            <SelectItem value="CONFIRMED">CONFIRMED (নিশ্চিতকৃত)</SelectItem>
                            <SelectItem value="PREPARING">PREPARING (প্রস্তুত হচ্ছে)</SelectItem>
                            <SelectItem value="READY">READY (ডেলিভারির জন্য প্রস্তুত)</SelectItem>
                            <SelectItem value="DELIVERED">DELIVERED (ডেলিভারি সম্পন্ন)</SelectItem>
                            <SelectItem value="CANCELLED">CANCELLED (বাতিলকৃত)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Quick Action Buttons */}
                      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 pt-2 border-t border-border/60 dark:border-white/10">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewItem(order)}
                          className="flex-1 min-w-[90px] h-9 rounded-xl text-xs font-bold gap-1.5 border-border/80 dark:border-white/10"
                        >
                          <Eye className="w-3.5 h-3.5 text-fire" /> ডিটেইলস
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEdit(order)}
                          disabled={order.status === "DELIVERED"}
                          className="flex-1 min-w-[90px] h-9 rounded-xl text-xs font-bold gap-1.5 border-border/80 dark:border-white/10"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-amber-500" /> এডিট
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => await generateInvoicePDF(order)}
                          className="flex-1 min-w-[90px] h-9 rounded-xl text-xs font-bold gap-1.5 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 border-border/80 dark:border-white/10"
                        >
                          <Download className="w-3.5 h-3.5" /> মেমো
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {orders.length === 0 && (
              <div className="p-8 text-center bg-card rounded-2xl border border-border text-muted-foreground">
                কোনো অর্ডার পাওয়া যায়নি।
              </div>
            )}
          </div>

          {/* Desktop Table View (>= lg) */}
          <div className="hidden lg:block border border-border bg-card rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-cream/50 dark:bg-charcoal-light/30 text-charcoal dark:text-cream text-xs uppercase font-bengali">
                  <tr>
                    <th className="px-4 py-3 font-bold">Order Number</th>
                    <th className="px-4 py-3 font-bold">Order From</th>
                    <th className="px-4 py-3 font-bold">Customer</th>
                    <th className="px-4 py-3 font-bold text-right">Total</th>
                    <th className="px-4 py-3 font-bold text-center">Payment</th>
                    <th className="px-4 py-3 font-bold text-center">Status</th>
                    <th className="px-4 py-3 font-bold text-center">Invoice</th>
                    <th className="px-4 py-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-cream/30 dark:hover:bg-charcoal-light/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className="font-mono font-bold text-charcoal">#{order.orderNumber}</div>
                          <button
                            onClick={() => handleCopyOrderNumber(order.orderNumber, order.id)}
                            className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50"
                            title="Copy order number"
                          >
                            {copiedOrderId === order.id ? (
                              <Check className="w-3.5 h-3.5 text-green-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {format(new Date(order.createdAt), "dd MMM, yyyy 'at' HH:mm")}
                        </div>
                      </td>
                      
                      {/* Order From */}
                      <td className="px-4 py-3">
                        {order.user ? (
                          <>
                            <div className="flex items-center gap-1 group/accname">
                              <span className="font-medium text-charcoal text-sm">{order.user.name}</span>
                              <button
                                onClick={() => handleCopyText(order.user.name, order.id, "Account Name")}
                                className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 opacity-100 lg:opacity-0 lg:group-hover/accname:opacity-100 focus:opacity-100 cursor-pointer shrink-0"
                                title="Copy account name"
                              >
                                {copiedTextId === `${order.id}-Account Name` ? (
                                  <Check className="w-3.5 h-3.5 text-green-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                            <div className="flex items-center gap-1 group/accphone text-xs text-muted-foreground font-latin mt-0.5">
                              <span>{order.user.phone || "No phone"}</span>
                              {order.user.phone && (
                                <button
                                  onClick={() => handleCopyText(order.user.phone, order.id, "Account Phone")}
                                  className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 opacity-100 lg:opacity-0 lg:group-hover/accphone:opacity-100 focus:opacity-100 cursor-pointer shrink-0"
                                  title="Copy account phone"
                                >
                                  {copiedTextId === `${order.id}-Account Phone` ? (
                                    <Check className="w-3.5 h-3.5 text-green-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              )}
                            </div>
                          </>
                        ) : (
                          <span className="text-[10px] font-bold text-muted-foreground bg-cream-dark/30 px-2 py-0.5 rounded-full uppercase">Guest</span>
                        )}
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 group/name">
                          <span className="font-medium text-charcoal text-sm">{order.customerName || "Guest"}</span>
                          {order.customerName && (
                            <button
                              onClick={() => handleCopyText(order.customerName, order.id, "Customer Name")}
                              className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 opacity-100 lg:opacity-0 lg:group-hover/name:opacity-100 focus:opacity-100 cursor-pointer shrink-0"
                              title="Copy customer name"
                            >
                              {copiedTextId === `${order.id}-Customer Name` ? (
                                <Check className="w-3.5 h-3.5 text-green-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-1 group/phone text-xs text-muted-foreground font-latin mt-0.5">
                          <span>{order.deliveryAddress?.phone || order.customerPhone || "N/A"}</span>
                          {(order.deliveryAddress?.phone || order.customerPhone) && (
                            <button
                              onClick={() => handleCopyText(order.deliveryAddress?.phone || order.customerPhone || "", order.id, "Customer Phone")}
                              className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50 opacity-100 lg:opacity-0 lg:group-hover/phone:opacity-100 focus:opacity-100 cursor-pointer shrink-0"
                              title="Copy customer phone"
                            >
                              {copiedTextId === `${order.id}-Customer Phone` ? (
                                <Check className="w-3.5 h-3.5 text-green-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-fire">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cream-dark/50 text-charcoal">
                          {order.paymentMethod === "COD" ? "COD" : "ONLINE"}
                        </span>
                      </td>
                      <td className="px-2 py-3 text-center">
                        <Select
                          value={order.status}
                          onValueChange={(val) => handleStatusChange(order.id, val)}
                          disabled={statusMutation.isPending || order.status === "DELIVERED" || order.status === "CANCELLED"}
                        >
                          <SelectTrigger className="h-8 w-28 border-none font-bold justify-center text-xs mx-auto">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">PENDING</SelectItem>
                            <SelectItem value="CONFIRMED">CONFIRMED</SelectItem>
                            <SelectItem value="PREPARING">PREPARING</SelectItem>
                            <SelectItem value="READY">READY</SelectItem>
                            <SelectItem value="DELIVERED">DELIVERED</SelectItem>
                            <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-success hover:text-success hover:bg-success/10 rounded-full h-8 w-8"
                          onClick={async () => await generateInvoicePDF(order)}
                          title="Download Invoice"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="p-2 hover:bg-fire/10 hover:text-fire rounded-lg transition-colors cursor-pointer text-muted-foreground">
                            <MoreVertical size={18} />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewItem(order)}>
                              <Eye size={16} className="mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEdit(order)} disabled={order.status === "DELIVERED"}>
                              <Edit2 size={16} className="mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={async () => await generateInvoicePDF(order)}>
                              <Download size={16} className="mr-2" />
                              Download Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                toast.error("Confirm Deletion", {
                                  description: `Are you sure you want to delete order ${order.orderNumber}?`,
                                  action: {
                                    label: "Delete",
                                    onClick: () => deleteMutation.mutate(order.id),
                                  },
                                  cancel: {
                                    label: "Cancel",
                                    onClick: () => {},
                                  },
                                });
                              }}
                              className="text-destructive focus:text-destructive"
                              disabled={deleteMutation.isPending || order.status === "DELIVERED"}
                            >
                              <Trash2 size={16} className="mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {meta && meta.totalPage > 1 && (
        <div className="flex justify-center flex-wrap mt-4">
          <USPagination
            page={page}
            totalPage={meta.totalPage}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}

      {/* View Order Dialog */}
      <ViewOrderModal
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        order={selectedOrder}
      />

      {/* Edit Order Dialog */}
      <EditOrderModal
        isOpen={isEditOpen}
        onClose={() => {
          setSelectedOrder(null);
          setIsEditOpen(false);
        }}
        order={selectedOrder}
        onSubmit={(data) => {
          // First update order items (recalculates totals)
          updateOrderItemsMutation.mutate(
            { orderId: data.id, data: { items: data.items } },
            {
              onSuccess: () => {
                // Then update order details
                updateOrderMutation.mutate(
                  {
                    orderId: data.id,
                    data: {
                      customerName: data.customerName,
                      customerPhone: data.customerPhone,
                      customerEmail: data.customerEmail,
                      deliveryAddress: data.deliveryAddress,
                      isInsideDhaka: data.isInsideDhaka,
                      deliveryCharge: data.deliveryCharge,
                      notes: data.notes,
                    },
                  },
                  {
                    onSuccess: () => {
                      setIsEditOpen(false);
                      setSelectedOrder(null);
                    },
                  }
                );
              },
            }
          );
        }}
        isSubmitting={updateOrderItemsMutation.isPending || updateOrderMutation.isPending}
      />

      {/* Cancel Order Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCancelDialogOpen(false);
          setCancellingOrderId(null);
          setCancelReason("");
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              Cancel Order
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to cancel this order? This action cannot be undone.
          </DialogDescription>
            
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Reason for cancellation</label>
              <textarea
                placeholder="Please enter the reason for cancelling this order..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="h-32"
              />
              <p className="text-xs text-muted-foreground">
                This reason will be visible to the customer and stored for order history.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button 
                variant="outline" 
                onClick={() => {
                    setIsCancelDialogOpen(false);
                    setCancellingOrderId(null);
                    setCancelReason("");
                }}
            >
              Back
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (!cancelReason.trim()) {
                  toast.error("Please provide a reason for cancellation");
                  return;
                }
                if (cancellingOrderId) {
                  statusMutation.mutate({ orderId: cancellingOrderId, status: "CANCELLED" });
                  setIsCancelDialogOpen(false);
                  setCancellingOrderId(null);
                  setCancelReason("");
                }
              }}
              disabled={statusMutation.isPending}
            >
              {statusMutation.isPending ? "Cancelling..." : "Confirm Cancellation"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
