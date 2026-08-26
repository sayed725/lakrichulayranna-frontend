import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionTitle } from "@/components/shared/section-title/SectionTitle";
import { ItemCard } from "@/components/item/ItemCard";

interface FeaturedItemsProps {
  items?: any[];
}

export function FeaturedItems({ items = [] }: FeaturedItemsProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <SectionTitle
            // title="Signature Dishes"
            titleBn="বিশেষ আইটেম"
            align="left"
            className="mb-0"
          />
          <Link
            href="/products"
            className="flex items-center gap-2 text-fire font-semibold font-bengali hover:text-fire-dark transition-colors group"
          >
            সব দেখুন
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-3 sm:items-stretch">
          {items.slice(0, 4).map((item: any) => (
            <div key={item.id} className="h-full">
              <ItemCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
