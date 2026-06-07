"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAdminItems } from "@/features/item/hooks/useAdminItems";
import { formatPrice } from "@/lib/utils";

interface EditOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export function EditOrderModal({ isOpen, onClose, order, onSubmit, isSubmitting }: EditOrderModalProps) {
  const { data: itemsResponse } = useAdminItems();
  const items = itemsResponse?.data || [];
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    deliveryAddress: "",
    deliveryCity: "dhaka" as string,
    paymentStatus: "UNPAID" as string,
    notes: "",
  });

  const [orderItems, setOrderItems] = useState<{ itemId: string; quantity: number }[]>([]);

  const handleAddOrderItem = () => {
    const firstItemId = items.length > 0 ? items[0].id : "";
    setOrderItems([...orderItems, { itemId: firstItemId, quantity: 1 }]);
  };

  const handleRemoveOrderItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const updateOrderItem = (index: number, key: string, value: any) => {
    const updated = [...orderItems];
    (updated[index] as any)[key] = value;
    setOrderItems(updated);
  };

  const calculateTotals = () => {
    const subtotal = orderItems.reduce((sum, oi) => {
      const product = items.find((it: any) => it.id === oi.itemId);
      const price = product ? (product.discountPrice ?? product.price ?? 0) : 0;
      return sum + price * oi.quantity;
    }, 0);

    // Calculate weight (backend logic: parseInt(weight.replace(/\D/g, '')))
    const totalWeight = orderItems.reduce((sum, oi) => {
      const product = items.find((it: any) => it.id === oi.itemId);
      if (!product || !product.weight) return sum;
      
      const weightValue = parseInt(product.weight.replace(/\D/g, '')) || 0;
      return sum + weightValue * oi.quantity;
    }, 0);

    // Validate total weight (max 5000g)
    if (totalWeight > 5000) {
      return { subtotal, deliveryCharge: 0, total: subtotal, error: "Order weight cannot exceed 5000g" };
    }

    // Calculate delivery charge based on isInsideDhaka (backend logic: 100 for inside, 150 for outside)
    const isInsideDhaka = formData.deliveryCity === "dhaka";
    const baseDeliveryCharge = isInsideDhaka ? 100 : 150;

    // Calculate extra charge for weight over 1000g (10tk per 1000g)
    let extraCharge = 0;
    if (totalWeight > 1000) {
      const extraWeight = totalWeight - 1000;
      extraCharge = Math.ceil(extraWeight / 1000) * 10;
    }

    const deliveryCharge = baseDeliveryCharge + extraCharge;
    
    return { subtotal, deliveryCharge, total: subtotal + deliveryCharge, totalWeight };
  };

  const { subtotal, deliveryCharge, total } = calculateTotals();

  useEffect(() => {
    if (order && isOpen) {
      const parsedAddress = typeof order.deliveryAddress === 'string' 
        ? JSON.parse(order.deliveryAddress) 
        : order.deliveryAddress || {};

      setFormData({
        customerName: order.customerName || "",
        customerPhone: order.customerPhone || "",
        customerEmail: order.customerEmail || "",
        deliveryAddress: parsedAddress.street || "",
        deliveryCity: order.isInsideDhaka ? "dhaka" : "outside",
        paymentStatus: order.paymentMethod === "ONLINE" ? "PAID" : "UNPAID",
        notes: order.notes || "",
      });

      // Set order items
      const orderItemsData = order.items?.map((item: any) => ({
        itemId: item.itemId,
        quantity: item.quantity,
      })) || [];
      setOrderItems(orderItemsData);
    }
  }, [order, isOpen, items]);

  const parseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderItems.length === 0) {
      toast.error("Please add at least one item.");
      return;
    }
    if (orderItems.some(i => !i.itemId)) {
      toast.error("Please select an item for all rows.");
      return;
    }
    
    const isInsideDhaka = formData.deliveryCity === "dhaka";
    
    onSubmit({
      id: order.id,
      items: orderItems.map(oi => ({
        itemId: oi.itemId,
        quantity: oi.quantity
      })),
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerEmail: formData.customerEmail || undefined,
      deliveryAddress: {
        area: isInsideDhaka ? "Dhaka" : "Outside Dhaka",
        city: formData.deliveryCity === "dhaka" ? "dhaka" : "other",
        street: formData.deliveryAddress,
        country: "Bangladesh",
      },
      isInsideDhaka,
      deliveryCharge,
      notes: formData.notes,
    });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="font-bengali">অর্ডার সম্পাদনা করুন</DialogTitle>
        </DialogHeader>
        <form onSubmit={parseSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto px-1">
          <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2 font-bengali">গ্রাহক তথ্য</h3>
              <div className="space-y-4">
                  <div className="space-y-2">
                      <label className="text-sm font-medium font-bengali">গ্রাহকের নাম <span className="text-red-500">*</span></label>
                      <Input required value={formData.customerName} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                      <label className="text-sm font-medium font-bengali">ইমেইল</label>
                      <Input type="email" value={formData.customerEmail} onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                      <label className="text-sm font-medium font-bengali">ফোন নম্বর <span className="text-red-500">*</span></label>
                      <Input required value={formData.customerPhone} onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                      <label className="text-sm font-medium font-bengali">এলাকা <span className="text-red-500">*</span></label>
                      <Select required value={formData.deliveryCity} onValueChange={(v) => setFormData({ ...formData, deliveryCity: v || "" })}>
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="এলাকা নির্বাচন করুন">
                              {formData.deliveryCity === "dhaka" ? "ঢাকার ভিতর" : formData.deliveryCity === "outside" ? "ঢাকার বাহিরে" : ""}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dhaka">ঢাকার ভেতর</SelectItem>
                          <SelectItem value="outside">ঢাকার বাইরে</SelectItem>
                        </SelectContent>
                      </Select>
                  </div>
                  <div className="space-y-2">
                      <label className="text-sm font-medium font-bengali">পেমেন্ট স্ট্যাটাস <span className="text-red-500">*</span></label>
                      <Select value={formData.paymentStatus} onValueChange={(v: string | null) => setFormData({ ...formData, paymentStatus: v || "UNPAID" })}>
                          <SelectTrigger className="w-full">
                              <SelectValue placeholder="পেমেন্ট স্ট্যাটাস নির্বাচন করুন">
                                  {formData.paymentStatus === "PAID" ? "পেইড" : formData.paymentStatus === "UNPAID" ? "আনপেইড (COD)" : ""}
                              </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="PAID">পেইড</SelectItem>
                              <SelectItem value="UNPAID">আনপেইড (COD)</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
              <div className="space-y-2">
                  <label className="text-sm font-medium font-bengali">ঠিকানা <span className="text-red-500">*</span></label>
                  <Textarea required value={formData.deliveryAddress} onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })} rows={3} />
              </div>
              <div className="space-y-2">
                  <label className="text-sm font-medium font-bengali">অতিরিক্ত নোট</label>
                  <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={2} />
              </div>
          </div>
      </div>

      <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-semibold text-lg font-bengali">অর্ডার আইটেমস</h3>
              <Button type="button" variant="outline" size="sm" className="rounded-md hover:bg-primary/10" onClick={handleAddOrderItem}>
                  <Plus className="w-4 h-4 mr-1" /> প্রোডাক্ট যোগ করুন
              </Button>
          </div>
          
          <div className="space-y-3">
              {orderItems.map((oi, index) => (
                  <div key={index} className="grid grid-cols-1 gap-3 bg-slate-50 dark:bg-slate-900 border p-3 rounded-lg relative">
                      <div className="space-y-2">
                          <label className="text-xs font-medium font-bengali">প্রোডাক্ট নির্বাচন করুন</label>
                          <Select value={oi.itemId} onValueChange={(v) => updateOrderItem(index, "itemId", v)}>
                              <SelectTrigger className="bg-background text-sm w-full">
                                  <SelectValue placeholder="একটি আইটেম নির্বাচন করুন">
                                      {oi.itemId && (() => {
                                          const item = items.find((it: any) => it.id === oi.itemId);
                                          if (!item) return "";
                                          return <span className="truncate block">{item.name} - ৳{item.price}</span>;
                                      })()}
                                  </SelectValue>
                              </SelectTrigger>
                              <SelectContent className="max-h-60 overflow-y-auto">
                                  {items.map((it: any) => (
                                      <SelectItem key={it.id} value={it.id}>{it.name} - ৳{it.price}</SelectItem>
                                  ))}
                              </SelectContent>
                          </Select>
                      </div>
                      <div className="flex gap-2 items-end">
                          <div className="flex-1 space-y-2">
                              <label className="text-xs font-medium font-bengali">পরিমাণ</label>
                              <Input 
                                  type="number" 
                                  min="1" 
                                  required 
                                  value={oi.quantity} 
                                  onChange={(e) => updateOrderItem(index, "quantity", parseInt(e.target.value) || 1)} 
                                  className="bg-background"
                              />
                          </div>
                          <Button type="button" size="sm" variant="ghost" className="text-destructive hover:bg-red-100 hover:text-red-700 h-10 w-10 shrink-0" onClick={() => handleRemoveOrderItem(index)}>
                              <Trash2 className="w-4 h-4" />
                          </Button>
                      </div>
                  </div>
              ))}
              {orderItems.length === 0 && (
                  <div className="text-center py-6 text-sm text-muted-foreground border-2 border-dashed rounded-lg bg-slate-50 dark:bg-slate-900 font-bengali">
                      এখনো কোনো আইটেম যোগ করা হয়নি।
                  </div>
              )}
          </div>
      </div>

      {/* Order Summary */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-dashed space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground font-bengali">সাবটোটাল</span>
          <span className="font-medium">৳{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground font-bengali">ডেলিভারি চার্জ</span>
          <span className="font-medium text-emerald-600">{deliveryCharge > 0 ? `৳${deliveryCharge.toLocaleString()}` : "এলাকা নির্বাচন করুন"}</span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
          <span className="font-bengali">মোট টাকা</span>
          <span className="text-primary">৳{total.toLocaleString()}</span>
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-2 border-t mt-6">
          <Button type="button" variant="outline" className="rounded-md hover:bg-primary/10" onClick={onClose}>বাতিল</Button>
          <Button type="submit" className="bg-fire text-white font-semibold hover:bg-fire-dark" disabled={isSubmitting || orderItems.length === 0}>
              {isSubmitting ? "আপডেট হচ্ছে..." : "আপডেট করুন"}
          </Button>
      </div>
    </form>
      </DialogContent>
    </Dialog>
  );
}
