import HeroSlider from "@/components/home/hero/Hero";
import { HomeCategories } from "@/components/home/categories/HomeCategories";
import { FeaturedItems } from "@/components/home/featured-items/FeaturedItems";
import { FeaturedCategoriesWithItems } from "@/components/home/featured-categories/FeaturedCategoriesWithItems";
import { HomeOffers } from "@/components/home/offers/HomeOffers";
import { HomeReviews } from "@/components/home/reviews/HomeReviews";

export default function HomePage() {
  return (
    <main>
      <HeroSlider />
      <HomeCategories />
      <FeaturedItems />
      <FeaturedCategoriesWithItems />
      <HomeOffers />
      <HomeReviews />
    </main>
  );
}
