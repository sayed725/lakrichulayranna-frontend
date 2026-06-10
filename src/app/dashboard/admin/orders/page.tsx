"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, RefreshCw, XCircle, Filter, Download, Eye, Trash2, Edit2, MoreVertical, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { generateInvoicePDF } from "@/lib/generateInvoicePDF";
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
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

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
  const { data: itemsResponse } = useAdminItems();
  const items = itemsResponse?.data || [];

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPaymentMethodFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  const isFiltered = search !== "" || statusFilter !== "all" || paymentMethodFilter !== "all" || sortBy !== "createdAt" || sortOrder !== "desc";

  const getSortLabel = () => {
    const sortMap: Record<string, string> = {
      "createdAt-desc": "Newest First",
      "createdAt-asc": "Oldest First",
      "total-desc": "Price: High to Low",
      "total-asc": "Price: Low to High",
    };
    return sortMap[`${sortBy}-${sortOrder}`] || "Sort By";
  };

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border">
        <div>
          <h1 className="text-2xl font-bold font-bengali text-charcoal">অর্ডারসমূহ</h1>
          <p className="text-muted-foreground text-sm hidden md:block font-bengali">সকল অর্ডারের তালিকা ও পরিচালনা</p>
        </div>
        <Button className="bg-fire text-white font-semibold hover:bg-fire-dark" onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          ম্যানুয়াল অর্ডার
        </Button>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={(val) => {
        setIsCreateOpen(val);
      }}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="font-bengali">ম্যানুয়াল অর্ডার তৈরি করুন</DialogTitle>
          </DialogHeader>
          <CreateOrderForm
            onSubmit={(data) => createMutation.mutate(data)}
            isPending={createMutation.isPending}
            onCancel={() => setIsCreateOpen(false)}
            items={items}
            buttonText="অর্ডার তৈরি করুন"
          />
        </DialogContent>
      </Dialog>

      {/* Filters and Search Header */}
      <div className="flex flex-row gap-2 sm:gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="অর্ডার নং, নাম বা ফোন..."
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
                  <SheetDescription className="sr-only">Filter and sort orders table</SheetDescription>
                  
                  {/* Status Filter */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Order Status</h3>
                    <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v || "all"); setPage(1); }}>
                      <SelectTrigger className="w-full h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
                        <SelectValue placeholder="Status">
                          {statusFilter === "all" ? "All Status" : ORDER_STATUSES.find(s => s.value === statusFilter)?.label}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {ORDER_STATUSES.map((status) => (
                          <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Payment Method</h3>
                    <Select value={paymentMethodFilter} onValueChange={(v) => { setPaymentMethodFilter(v || "all"); setPage(1); }}>
                      <SelectTrigger className="w-full h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
                        <SelectValue placeholder="Method">
                          {paymentMethodFilter === "all" ? "All Methods" : paymentMethodFilter}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="all">All Methods</SelectItem>
                        <SelectItem value="COD">Cash on Delivery</SelectItem>
                        <SelectItem value="ONLINE">Online</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort By */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Sort Orders</h3>
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
                        <SelectItem value="total-desc">Price: High to Low</SelectItem>
                        <SelectItem value="total-asc">Price: Low to High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-6 border-t border-border bg-cream/50 dark:bg-charcoal-light/30">
                  <Button 
                    onClick={resetFilters} 
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
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v || "all"); setPage(1); }}>
              <SelectTrigger className="w-[140px] h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
                <SelectValue placeholder="Status">
                  {statusFilter === "all" ? "All Status" : ORDER_STATUSES.find(s => s.value === statusFilter)?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {ORDER_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={paymentMethodFilter} onValueChange={(v) => { setPaymentMethodFilter(v || "all"); setPage(1); }}>
              <SelectTrigger className="w-[150px] h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
                <SelectValue placeholder="Method">
                  {paymentMethodFilter === "all" ? "All Methods" : paymentMethodFilter}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="COD">Cash on Delivery</SelectItem>
                <SelectItem value="ONLINE">Online</SelectItem>
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
                <SelectItem value="total-desc">Price: High to Low</SelectItem>
                <SelectItem value="total-asc">Price: Low to High</SelectItem>
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

      {isLoading ? (
        <OrdersLoadingSkeleton />
      ) : (
        <div className="border border-border bg-card rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-cream/50 dark:bg-charcoal-light/30 text-charcoal dark:text-cream text-xs uppercase font-bengali">
                <tr>
                  <th className="px-6 py-4">Order Number</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4 text-right">Total</th>
                  <th className="px-6 py-4 text-center">Payment</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Invoice</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-cream/30 dark:hover:bg-charcoal-light/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="font-mono font-bold text-charcoal">#{order.orderNumber}</div>
                        <button
                          onClick={() => handleCopyOrderNumber(order.orderNumber, order.id)}
                          className="text-muted-foreground hover:text-fire transition-colors p-1 rounded hover:bg-cream/50"
                          title="Copy order number"
                        >
                          {copiedOrderId === order.id ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(order.createdAt), "dd MMM, yyyy 'at' HH:mm")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-charcoal">{ order.customerName || "Guest"}</div>
                      <div className="text-xs text-muted-foreground font-latin">{order.deliveryAddress?.phone || order.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-fire">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-cream-dark/50 text-charcoal">
                        {order.paymentMethod === "COD" ? "COD" : "ONLINE"}
                      </span>
                    </td>
                    <td className="py-4 text-center">
                      <Select
                        value={order.status}
                        onValueChange={(val) => handleStatusChange(order.id, val)}
                        disabled={statusMutation.isPending || order.status === "DELIVERED" || order.status === "CANCELLED"}
                      >
                        <SelectTrigger className="h-8 w-32 border-none font-bold justify-center">
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
                    <td className="px-6 py-4 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-success hover:text-success hover:bg-success/10 rounded-full"
                        onClick={async () => await generateInvoicePDF(order)}
                        title="Download Invoice"
                      >
                        <Download className="w-5 h-5" />
                      </Button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-2 hover:bg-cream/50 rounded-lg transition-colors">
                          <MoreVertical size={18} className="text-muted-foreground" />
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
                    <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
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
