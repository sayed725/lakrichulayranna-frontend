"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore, type CartItem as CartItemType } from "@/store/cart.store";
import { formatPrice } from "@/lib/utils";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQty, removeItem } = useCartStore();
  const effectivePrice = item.discountPrice ?? item.price;

  return (
    <div className="flex gap-3 p-3 rounded-xl bg-cream/50 border border-border group hover:border-fire/20 transition-colors">
      {/* Item Image */}
      <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-cream-dark">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      {/* Item Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium font-bengali text-charcoal text-sm leading-snug truncate">
          {item.name}
        </h4>

        {/* Price */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-fire font-semibold text-sm">
            {formatPrice(effectivePrice)}
          </span>
          {item.discountPrice && (
            <span className="text-xs text-muted line-through">
              {formatPrice(item.price)}
            </span>
          )}
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => updateQty(item.id, item.quantity - 1)}
              className="w-7 h-7 rounded-lg bg-charcoal/5 hover:bg-fire/10 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus size={14} className="text-charcoal" />
            </button>
            <span className="w-8 text-center text-sm font-semibold text-charcoal">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQty(item.id, item.quantity + 1)}
              className="w-7 h-7 rounded-lg bg-charcoal/5 hover:bg-fire/10 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus size={14} className="text-charcoal" />
            </button>
          </div>

          {/* Line Total + Remove */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted font-medium">
              {formatPrice(effectivePrice * item.quantity)}
            </span>
            <button
              onClick={() => removeItem(item.id)}
              className="p-1.5 rounded-lg hover:bg-error/10 text-muted hover:text-error transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
              aria-label="Remove item"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
