"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
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
    });
    
    toast.success(`${item.name} কার্টে যোগ করা হয়েছে!`);
  };

  const effectivePrice = item.discountPrice ?? item.price;
  const hasDiscount = item.discountPrice !== null;
  const discountPercentage = hasDiscount 
    ? Math.round(((item.price - item.discountPrice!) / item.price) * 100)
    : 0;

  return (
    <Link 
      href={`/menu/${item.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:shadow-fire/10 hover:border-fire/20 transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-dark">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasDiscount && (
            <span className="bg-error text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
              -{discountPercentage}% ছাড়
            </span>
          )}
          {!item.isAvailable && (
            <span className="bg-charcoal text-cream text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
              স্টকে নেই
            </span>
          )}
        </div>
        
        <div className="absolute bottom-3 left-3">
          <span className="bg-cream/90 backdrop-blur-sm text-fire text-xs font-semibold px-2.5 py-1 rounded-lg border border-fire/10 shadow-sm">
            {item.category?.name || "ক্যাটাগরি"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold font-bengali text-lg text-charcoal mb-2 line-clamp-1 group-hover:text-fire transition-colors">
          {item.name}
        </h3>
        
        <p className="text-muted text-sm font-bengali line-clamp-2 h-10 mb-4">
          {item.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
          <div className="flex flex-col">
            <span className="font-bold text-lg text-fire">
              {formatPrice(effectivePrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted line-through">
                {formatPrice(item.price)}
              </span>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!item.isAvailable}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-fire/10 text-fire hover:bg-fire hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Add to cart"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </Link>
  );
}
