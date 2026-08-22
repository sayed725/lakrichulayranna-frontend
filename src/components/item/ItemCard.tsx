"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Flame, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart.store";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Item {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice: number | null;
  imageUrl: string;
  category: Category;
  isAvailable: boolean;
  isSpicy?: boolean;
  isFeatured?: boolean;
  weight?: string;
}

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if wrapped in a link
    e.stopPropagation();
    
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      discountPrice: item.discountPrice ?? undefined,
      imageUrl: item.imageUrl,
      slug: item.slug,
      weight: item.weight,
    });
    
    toast.success(`${item.name} কার্টে যোগ করা হয়েছে!`);
  };

  const effectivePrice = item.discountPrice ?? item.price;
  const hasDiscount = item.discountPrice !== null;
  const discountPercentage = hasDiscount 
    ? Math.round(((item.price - item.discountPrice!) / item.price) * 100)
    : 0;

  return (
    <div 
      className="group flex flex-col bg-white rounded-2xl md:rounded-3xl border border-border/80 overflow-hidden hover:shadow-xl hover:shadow-fire/10 hover:border-fire/30 transition-all duration-300 transform hover:-translate-y-1 h-full"
    >
      <Link href={`/products/${item.slug}`} className="flex flex-col flex-grow">
        {/* Image Container */}
        <div className="relative aspect-[4/3] lg:aspect-[1.6/1] w-full overflow-hidden bg-cream-dark/30 shrink-0">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
        {/* Badges on Image */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
          {item.isSpicy && (
            <span className="bg-amber-600/90 text-white backdrop-blur-md px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-bold tracking-wide shadow-sm flex items-center gap-1">
              <Flame className="w-2.5 h-2.5 fill-current" /> ঝাল
            </span>
          )}
          {!item.isAvailable && (
            <span className="bg-charcoal text-cream text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-sm">
              স্টকে নেই
            </span>
          )}
        </div>
        
        <div className="absolute top-2 right-2 z-10">
          {hasDiscount && (
            <span className="bg-error text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-sm">
              -{discountPercentage}%
            </span>
          )}
        </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:px-4 sm:pt-4 sm:pb-0 pb-0 flex flex-col">
          {/* Name and Weight */}
          <div className="flex items-start justify-between gap-2 min-h-[2.5rem]">
            <h3 className="font-bold font-bengali text-sm sm:text-base md:text-lg text-charcoal line-clamp-2 group-hover:text-fire transition-colors leading-snug flex-1">
              {item.name}
            </h3>
            {item.weight && (
              <span className="text-[10px] sm:text-xs bg-cream text-charcoal/70 px-2 py-0.5 rounded-md font-semibold border border-border shrink-0 mt-0.5 whitespace-nowrap">
                {item.weight}
              </span>
            )}
          </div>
        </div>
      </Link>
      
      {/* Bottom Container: Pricing and Add to Cart Button */}
      <div className="mt-auto p-3 sm:px-4 sm:pb-4 sm:pt-1 pb-3 pt-1 space-y-2">
        {/* Pricing */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-sm sm:text-base md:text-lg text-fire">
              {formatPrice(effectivePrice)}
            </span>
            {hasDiscount && (
              <span className="text-[10px] sm:text-xs text-muted line-through">
                {formatPrice(item.price)}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!item.isAvailable}
          className="flex items-center justify-center gap-2 w-full py-2 sm:py-2.5 rounded-xl bg-fire text-white hover:bg-fire-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md hover:shadow-fire/20 hover:scale-[1.02] active:scale-95 text-xs sm:text-sm font-bold font-bengali"
          aria-label="Add to cart"
        >
          <ShoppingBag size={16} />
          <span>{item.isAvailable ? "কার্টে যোগ করুন" : "স্টকে নেই"}</span>
        </button>
      </div>
    </div>
  );
}
