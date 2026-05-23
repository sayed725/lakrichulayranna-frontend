export interface User {
  id?: string;
  role?: string;
}

export function canAccessAdmin(user: User | null | undefined): boolean {
  if (!user) return false;
  return user.role === "ADMIN";
}

export function canWriteReview(
  user: User | null | undefined, 
  itemId: string, 
  orders: any[]
): boolean {
  if (!user) return false;
  
  // Check if the user has ordered this item and the order is DELIVERED
  const hasOrderedItem = orders?.some((order) => 
    order.status === "DELIVERED" && 
    order.items?.some((orderItem: any) => orderItem.item?.id === itemId || orderItem.itemId === itemId)
  );

  return !!hasOrderedItem;
}
